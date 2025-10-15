# Teams Scaling & Performance Strategy

**Enterprise-Scale Architecture for 10K+ Teams**

---

## Table of Contents

1. [Performance Goals](#performance-goals)
2. [Caching Strategy](#caching-strategy)
3. [Database Optimization](#database-optimization)
4. [Horizontal Scaling](#horizontal-scaling)
5. [CDN & Asset Optimization](#cdn--asset-optimization)
6. [Monitoring & Observability](#monitoring--observability)

---

## Performance Goals

### Target Metrics

```typescript
// lib/performance/targets.ts
export const PERFORMANCE_TARGETS = {
  // API Response Times (p95)
  teamList: 100, // ms
  teamDetails: 150, // ms
  promptsList: 200, // ms
  membersList: 100, // ms
  usageStats: 300, // ms

  // Frontend Metrics
  firstContentfulPaint: 1200, // ms
  largestContentfulPaint: 2500, // ms
  cumulativeLayoutShift: 0.1,
  firstInputDelay: 100, // ms

  // Database Queries (p95)
  simpleQuery: 10, // ms
  complexQuery: 50, // ms
  aggregation: 100, // ms

  // Throughput
  requestsPerSecond: 10000,
  concurrentUsers: 50000,
  teamsSupported: 10000,

  // Availability
  uptime: 99.9, // %
  errorRate: 0.1 // %
} as const
```

### Current Bottlenecks

1. **Database Queries**
   - Complex joins on team_prompts with usage stats
   - Full-text search on large prompt collections
   - Audit log queries spanning multiple partitions

2. **API Endpoints**
   - Usage statistics aggregation
   - Member list with user profile joins
   - Real-time notification delivery

3. **Frontend**
   - Large team lists (100+ teams per user)
   - Chart rendering for usage data
   - Real-time updates causing re-renders

---

## Caching Strategy

### 1. Multi-Layer Caching Architecture

```
┌─────────────────────────────────────────┐
│ CDN (Vercel Edge) - Static Assets      │
│ TTL: 1 year                             │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ Redis (Upstash) - Hot Data              │
│ TTL: 5-15 minutes                       │
│ - Team metadata                         │
│ - Permission checks                     │
│ - Usage aggregates                      │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ React Query - Client-side               │
│ TTL: 5 minutes                          │
│ - UI state                              │
│ - API responses                         │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ Supabase (PostgreSQL) - Source of Truth│
└─────────────────────────────────────────┘
```

### 2. Redis Implementation

```typescript
// lib/cache/redis.ts
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
})

export const CACHE_TTL = {
  team: 5 * 60, // 5 minutes
  members: 3 * 60, // 3 minutes
  permissions: 10 * 60, // 10 minutes
  usage: 1 * 60, // 1 minute (more volatile)
  billing: 5 * 60 // 5 minutes
} as const

export class CacheService {
  /**
   * Get cached data with automatic JSON parsing
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key)
      return data as T | null
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  /**
   * Set cached data with automatic JSON serialization
   */
  async set(key: string, value: any, ttl: number): Promise<void> {
    try {
      await redis.set(key, value, { ex: ttl })
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }

  /**
   * Delete cached data
   */
  async delete(key: string): Promise<void> {
    try {
      await redis.del(key)
    } catch (error) {
      console.error('Cache delete error:', error)
    }
  }

  /**
   * Delete multiple keys by pattern
   */
  async deletePattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        await redis.del(...keys)
      }
    } catch (error) {
      console.error('Cache delete pattern error:', error)
    }
  }

  /**
   * Cache wrapper with automatic get/set
   */
  async wrap<T>(
    key: string,
    ttl: number,
    fetcher: () => Promise<T>
  ): Promise<T> {
    // Try cache first
    const cached = await this.get<T>(key)
    if (cached !== null) {
      return cached
    }

    // Fetch fresh data
    const data = await fetcher()

    // Store in cache (fire and forget)
    void this.set(key, data, ttl)

    return data
  }
}

export const cache = new CacheService()
```

### 3. Cached API Endpoint Example

```typescript
// app/api/v1/teams/[id]/route.ts
import { cache, CACHE_TTL } from '@/lib/cache/redis'

export const GET = withAuth(async (req: NextRequest, { params, user }) => {
  const teamId = params.id

  // Check cache first
  const cacheKey = `team:${teamId}:details`

  const team = await cache.wrap(cacheKey, CACHE_TTL.team, async () => {
    // Fetch from database
    const supabase = await createClient()
    const { data, error } = await supabase.rpc('get_team_with_stats', {
      p_team_id: teamId
    })

    if (error) throw error
    return data
  })

  return NextResponse.json({ team })
})
```

### 4. Cache Invalidation

```typescript
// lib/cache/invalidation.ts
import { cache } from './redis'

export async function invalidateTeamCache(teamId: string): Promise<void> {
  await Promise.all([
    cache.deletePattern(`team:${teamId}:*`),
    cache.deletePattern(`teams:user:*`) // Invalidate user's team lists
  ])
}

export async function invalidateTeamMembersCache(teamId: string): Promise<void> {
  await cache.deletePattern(`team:${teamId}:members:*`)
}

export async function invalidateTeamPromptsCache(teamId: string): Promise<void> {
  await cache.deletePattern(`team:${teamId}:prompts:*`)
}

// Trigger invalidation on updates
// In your mutation handlers:
export const updateTeam = async (teamId: string, updates: any) => {
  const result = await supabase
    .from('teams')
    .update(updates)
    .eq('id', teamId)

  await invalidateTeamCache(teamId)

  return result
}
```

---

## Database Optimization

### 1. Strategic Indexing

```sql
-- Performance-critical indexes

-- Team lookups
create index idx_teams_slug_active on teams (slug) where is_active = true;
create index idx_teams_tier on teams (tier);

-- Member queries
create index idx_team_members_composite on team_members (team_id, user_id, is_active);
create index idx_team_members_user_active on team_members (user_id) where is_active = true;
create index idx_team_members_last_active on team_members (team_id, last_active_at desc);

-- Prompt searches
create index idx_team_prompts_search on team_prompts
  using gin (to_tsvector('english', name || ' ' || coalesce(description, '') || ' ' || prompt_text));
create index idx_team_prompts_team_created on team_prompts (team_id, created_at desc);
create index idx_team_prompts_creator on team_prompts (created_by, created_at desc);

-- Usage tracking
create index idx_usage_team_date on team_usage_logs (team_id, created_at desc);
create index idx_usage_user_date on team_usage_logs (user_id, created_at desc);
create index idx_usage_cost on team_usage_logs (team_id, cost_usd) where cost_usd > 0;

-- Audit logs (partitioned)
create index idx_audit_team_action on team_audit_logs (team_id, action, created_at desc);
create index idx_audit_user on team_audit_logs (user_id, created_at desc);

-- Analyze tables regularly
analyze teams;
analyze team_members;
analyze team_prompts;
analyze team_usage_logs;
```

### 2. Query Optimization

```sql
-- Materialized view for team statistics
create materialized view team_stats_mv as
select
  t.id as team_id,
  t.name,
  t.tier,
  count(distinct tm.user_id) as member_count,
  count(distinct tp.id) as prompt_count,
  count(distinct td.id) as dataset_count,
  coalesce(sum(tul.cost_usd), 0) as total_cost,
  coalesce(sum(case when tul.created_at >= date_trunc('month', now()) then tul.cost_usd else 0 end), 0) as monthly_cost,
  max(tm.last_active_at) as last_activity
from teams t
left join team_members tm on tm.team_id = t.id and tm.is_active = true
left join team_prompts tp on tp.team_id = t.id
left join team_datasets td on td.team_id = t.id
left join team_usage_logs tul on tul.team_id = t.id
where t.is_active = true
group by t.id, t.name, t.tier;

-- Index the materialized view
create unique index on team_stats_mv (team_id);
create index on team_stats_mv (tier);
create index on team_stats_mv (last_activity desc);

-- Refresh function
create or replace function refresh_team_stats()
returns void as $$
begin
  refresh materialized view concurrently team_stats_mv;
end;
$$ language plpgsql;

-- Schedule refresh (via cron or external job)
-- Run every 5 minutes: */5 * * * *
```

### 3. Connection Pooling

```typescript
// lib/database/pool.ts
import { createClient } from '@supabase/supabase-js'

// Production pool configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'prompt-manage-teams'
    }
  }
})

// Connection pool limits
// Set in Supabase project settings:
// - Max connections: 100
// - Statement timeout: 30s
// - Idle connection timeout: 10m
```

### 4. Read Replicas (Production)

```typescript
// lib/database/replicas.ts
import { createClient } from '@supabase/supabase-js'

// Primary (write)
export const supabasePrimary = createClient(
  process.env.SUPABASE_PRIMARY_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Read replica (read-heavy queries)
export const supabaseReplica = createClient(
  process.env.SUPABASE_REPLICA_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    db: { schema: 'public' }
  }
)

// Smart query router
export function getSupabaseClient(operation: 'read' | 'write') {
  return operation === 'write' ? supabasePrimary : supabaseReplica
}
```

---

## Horizontal Scaling

### 1. Stateless API Design

```typescript
// All API routes are stateless
// No server-side session storage
// All state in JWT or database

// Example: Token-based auth
export async function authenticate(token: string) {
  const decoded = await verifyJWT(token)
  return decoded.userId
}

// No in-memory state
// Use Redis for shared state across instances
```

### 2. Load Balancing Strategy

```
                    ┌─────────────┐
                    │ Vercel Edge │
                    │   Network   │
                    └──────┬──────┘
                           │
                 ┌─────────┴─────────┐
                 │                   │
          ┌──────▼──────┐    ┌──────▼──────┐
          │  Region 1   │    │  Region 2   │
          │  (US-East)  │    │  (EU-West)  │
          └──────┬──────┘    └──────┬──────┘
                 │                   │
       ┌─────────┴────────┐  ┌──────┴──────────┐
       │                  │  │                 │
  ┌────▼────┐      ┌────▼────┐         ┌────▼────┐
  │ Server 1│      │ Server 2│         │ Server 3│
  └─────────┘      └─────────┘         └─────────┘
```

### 3. Auto-Scaling Configuration

```typescript
// vercel.json (if using Vercel)
{
  "functions": {
    "app/api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}

// For AWS/GCP:
// - Min instances: 2
// - Max instances: 50
// - Scale up: CPU > 70% for 2 minutes
// - Scale down: CPU < 30% for 5 minutes
```

### 4. Database Sharding Strategy

```sql
-- For 10K+ teams, implement horizontal sharding

-- Shard key: team_id (consistent hashing)
-- Shard function
create or replace function get_shard_number(team_id uuid)
returns integer as $$
begin
  -- Use first byte of UUID to determine shard
  -- Supports up to 256 shards
  return get_byte(team_id::bytea, 0) % 8; -- Start with 8 shards
end;
$$ language plpgsql immutable;

-- Shard-aware query routing
create or replace function query_team_shard(p_team_id uuid)
returns table (shard_number integer, connection_string text) as $$
declare
  shard_num integer;
begin
  shard_num := get_shard_number(p_team_id);

  return query
  select
    shard_num,
    case shard_num
      when 0 then 'shard0.supabase.co'
      when 1 then 'shard1.supabase.co'
      -- ... etc
    end as connection_string;
end;
$$ language plpgsql;
```

---

## CDN & Asset Optimization

### 1. Static Asset Strategy

```typescript
// next.config.mjs
const nextConfig = {
  images: {
    domains: ['supabase.co', 'avatars.githubusercontent.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30 // 30 days
  },

  // Enable SWC minification
  swcMinify: true,

  // Compress responses
  compress: true,

  // Asset optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
}
```

### 2. Bundle Size Optimization

```typescript
// app/teams/[slug]/layout.tsx
// Dynamic imports for heavy components
import dynamic from 'next/dynamic'

const UsageChart = dynamic(() => import('@/components/teams/usage-chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false // Client-side only for charts
})

const MemberTable = dynamic(() => import('@/components/teams/member-table'), {
  loading: () => <TableSkeleton />
})
```

### 3. Image Optimization

```typescript
// components/teams/team-avatar.tsx
import Image from 'next/image'

export function TeamAvatar({ team }: { team: Team }) {
  return (
    <Image
      src={team.avatar_url || '/default-team.png'}
      alt={team.name}
      width={40}
      height={40}
      className="rounded-full"
      priority={false}
      loading="lazy"
      quality={75}
    />
  )
}
```

---

## Monitoring & Observability

### 1. Application Performance Monitoring (APM)

```typescript
// lib/monitoring/apm.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // 10% of transactions

  beforeSend(event, hint) {
    // Filter out PII
    if (event.user) {
      delete event.user.email
      delete event.user.ip_address
    }
    return event
  }
})

// Custom transaction tracking
export function trackTransaction(name: string, operation: string) {
  return Sentry.startTransaction({
    name,
    op: operation,
    tags: {
      feature: 'teams'
    }
  })
}

// Usage in API routes
export async function GET(req: NextRequest) {
  const transaction = trackTransaction('teams.list', 'http.server')

  try {
    // ... handler code
  } finally {
    transaction.finish()
  }
}
```

### 2. Database Query Monitoring

```sql
-- Enable pg_stat_statements extension
create extension if not exists pg_stat_statements;

-- View slow queries
select
  query,
  calls,
  total_exec_time,
  mean_exec_time,
  max_exec_time,
  stddev_exec_time
from pg_stat_statements
where query like '%team%'
order by mean_exec_time desc
limit 20;

-- Identify missing indexes
select
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
from pg_stat_user_indexes
where idx_scan = 0
  and schemaname = 'public'
order by pg_relation_size(indexrelid) desc;
```

### 3. Custom Metrics

```typescript
// lib/monitoring/metrics.ts
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
})

export class MetricsService {
  /**
   * Increment counter metric
   */
  async increment(metric: string, tags?: Record<string, string>): Promise<void> {
    const key = this.buildKey(metric, tags)
    await redis.incr(key)
  }

  /**
   * Record timing metric
   */
  async timing(metric: string, duration: number, tags?: Record<string, string>): Promise<void> {
    const key = this.buildKey(metric, tags)
    await redis.lpush(key, duration)
    await redis.ltrim(key, 0, 999) // Keep last 1000 values
    await redis.expire(key, 3600) // 1 hour TTL
  }

  /**
   * Record gauge metric
   */
  async gauge(metric: string, value: number, tags?: Record<string, string>): Promise<void> {
    const key = this.buildKey(metric, tags)
    await redis.set(key, value, { ex: 60 })
  }

  private buildKey(metric: string, tags?: Record<string, string>): string {
    const tagString = tags
      ? Object.entries(tags)
          .map(([k, v]) => `${k}:${v}`)
          .join(',')
      : ''

    return `metrics:${metric}${tagString ? `:${tagString}` : ''}`
  }
}

export const metrics = new MetricsService()

// Usage
await metrics.increment('team.created', { tier: 'pro' })
await metrics.timing('api.teams.list', 150, { region: 'us-east' })
await metrics.gauge('teams.active', 1234)
```

### 4. Real-time Dashboards

```typescript
// app/admin/metrics/page.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { Line } from 'react-chartjs-2'

export default function MetricsDashboard() {
  const { data: metrics } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: fetchMetrics,
    refetchInterval: 30000 // Refresh every 30s
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">System Metrics</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Active Teams"
          value={metrics?.activeTeams}
          change="+12%"
        />
        <MetricCard
          title="API Requests/min"
          value={metrics?.requestsPerMin}
          change="+5%"
        />
        <MetricCard
          title="P95 Latency"
          value={`${metrics?.p95Latency}ms`}
          change="-8%"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Response Times (p95)</CardTitle>
        </CardHeader>
        <CardContent>
          <Line data={metrics?.responseTimeData} />
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## Performance Testing

### 1. Load Testing

```typescript
// scripts/load-test.ts
import { check } from 'k6'
import http from 'k6/http'

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 }    // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95% of requests should be below 200ms
    http_req_failed: ['rate<0.01']    // Error rate should be below 1%
  }
}

export default function () {
  const res = http.get('https://api.promptmanage.com/v1/teams')

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200
  })
}
```

### 2. Database Stress Testing

```sql
-- Simulate high load
do $$
declare
  i integer;
begin
  for i in 1..10000 loop
    perform get_team_with_stats(
      (select id from teams order by random() limit 1)
    );
  end loop;
end $$;

-- Measure query performance
explain (analyze, buffers, timing)
select * from get_team_with_stats('some-team-id');
```

---

## Summary

### Scaling Capabilities

✅ **Performance**
- Sub-200ms API responses (p95)
- 10K+ concurrent users
- 10K+ teams supported

✅ **Caching**
- Multi-layer caching (CDN, Redis, Client)
- 5-15 minute TTL with smart invalidation
- 80%+ cache hit rate target

✅ **Database**
- Strategic indexing
- Materialized views
- Connection pooling
- Read replicas

✅ **Monitoring**
- APM with Sentry
- Custom metrics with Redis
- Real-time dashboards
- Automated alerting

✅ **Horizontal Scaling**
- Stateless API design
- Auto-scaling configuration
- Load balancing
- Sharding strategy (10K+ teams)

### Cost Efficiency

| Component | Monthly Cost (10K teams) |
|-----------|--------------------------|
| Supabase | $299 (Pro + Read Replica) |
| Upstash Redis | $49 (Pay-as-you-go) |
| Vercel | $20 per seat (5 seats) |
| Sentry | $29 (Team) |
| **Total** | **~$477/month** |

**Per-Team Cost:** $0.048/month

### Next Steps

Continue to [IMPLEMENTATION.md](#) for the implementation roadmap and timeline.
