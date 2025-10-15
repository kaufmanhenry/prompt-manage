# Token Tracking User Workflows & UI/UX

## User Personas & Use Cases

### Persona 1: Sarah - Solo Content Creator (Free Tier)
**Background:** Freelance writer experimenting with AI prompts

**Goals:**
- Understand basic token usage
- See simple cost estimates
- Know when to upgrade

**Workflow:**
1. Opens Prompt Lab
2. Sees basic token count estimate (~450 tokens)
3. Runs prompt
4. Views simple usage: "839 tokens used"
5. After 10 runs, sees upgrade prompt: "Upgrade to Teams for detailed cost tracking"

---

### Persona 2: Mike - Marketing Manager (Teams Tier)
**Background:** Manages content creation for a small marketing team

**Goals:**
- Track monthly spending
- Stay within budget
- Optimize costs

**Workflow:**
1. Sets monthly budget: $50/month
2. Gets alert when reaching 75% ($37.50)
3. Views breakdown by prompt type
4. Sees recommendation: "Switch to GPT-4o Mini to save 60%"
5. Adjusts prompts accordingly
6. Exports monthly report for manager

---

### Persona 3: Alex - Engineering Lead (Enterprise Tier)
**Background:** Manages 15-person team using AI for code reviews and documentation

**Goals:**
- Monitor team-wide usage
- Allocate budgets per team member
- Identify optimization opportunities
- Generate executive reports

**Workflow:**
1. Views team dashboard: $450/month across 15 users
2. Sees top users: John ($85), Sarah ($72)
3. Reviews cost optimization recommendations
4. Implements suggestions, saves $120/month
5. Schedules weekly reports to CFO
6. Sets per-user budget limits ($40/user/month)

---

## Detailed User Journeys

### Journey 1: First-Time User Setting Up Budget

**Starting Point:** User just upgraded to Teams plan

**Steps:**

1. **Welcome Screen**
   ```
   ┌─────────────────────────────────────────────────┐
   │ 🎉 Welcome to Teams!                             │
   │                                                  │
   │ You now have access to:                         │
   │ ✅ Detailed token tracking                      │
   │ ✅ Cost breakdowns                              │
   │ ✅ Budget management                            │
   │                                                  │
   │ Let's set up your budget to get started.        │
   │                                                  │
   │ [Set Up Budget] [Skip for Now]                  │
   └─────────────────────────────────────────────────┘
   ```

2. **Budget Setup Wizard - Step 1: Estimate Usage**
   ```
   ┌─────────────────────────────────────────────────┐
   │ Step 1: Estimate Your Usage                     │
   │                                                  │
   │ How many prompts do you run per month?          │
   │ ⚪ 1-50 prompts                                  │
   │ ⚪ 50-200 prompts                                │
   │ ⚪ 200-500 prompts                               │
   │ ⚪ 500+ prompts                                  │
   │                                                  │
   │ What models do you primarily use?               │
   │ ☑ GPT-4o Mini (Budget-friendly)                 │
   │ ☐ GPT-4o (Balanced)                             │
   │ ☐ GPT-4 (Premium)                               │
   │                                                  │
   │ [Back] [Next]                                    │
   └─────────────────────────────────────────────────┘
   ```

3. **Budget Setup Wizard - Step 2: Recommended Budget**
   ```
   ┌─────────────────────────────────────────────────┐
   │ Step 2: Recommended Budget                      │
   │                                                  │
   │ Based on your usage:                            │
   │ • 50-200 prompts/month                          │
   │ • Primarily GPT-4o Mini                         │
   │                                                  │
   │ We recommend: $30/month                         │
   │                                                  │
   │ Adjust your budget:                             │
   │ ┌───────────────────────────┐                   │
   │ │ $ 30.00                   │                   │
   │ └───────────────────────────┘                   │
   │                                                  │
   │ Set alerts at:                                  │
   │ ☑ 75% ($22.50)                                  │
   │ ☑ 90% ($27.00)                                  │
   │ ☑ 100% ($30.00)                                 │
   │                                                  │
   │ [Back] [Complete Setup]                         │
   └─────────────────────────────────────────────────┘
   ```

4. **Confirmation**
   ```
   ┌─────────────────────────────────────────────────┐
   │ ✅ Budget Set Successfully!                      │
   │                                                  │
   │ Monthly Budget: $30.00                          │
   │ You'll receive alerts at 75%, 90%, and 100%     │
   │                                                  │
   │ [Go to Dashboard] [Run Your First Prompt]       │
   └─────────────────────────────────────────────────┘
   ```

---

### Journey 2: Running a Prompt with Cost Preview

**Starting Point:** User opens Prompt Lab with a draft prompt

**Steps:**

1. **Prompt Editor with Live Preview**
   ```
   ┌──────────────────────────────────────────────────────┐
   │ Prompt Lab                          [gpt-4o-mini ▼] │
   ├──────────────────────────────────────────────────────┤
   │ Your Prompt:                                         │
   │ ┌────────────────────────────────────────────────┐  │
   │ │ Write a comprehensive blog post about the      │  │
   │ │ future of AI in healthcare. Include:           │  │
   │ │ - Current applications                         │  │
   │ │ - Emerging technologies                        │  │
   │ │ - Ethical considerations                       │  │
   │ │ - Future predictions                           │  │
   │ └────────────────────────────────────────────────┘  │
   │                                                      │
   │ 💰 Cost Preview                                     │
   │ ┌────────────────────────────────────────────────┐  │
   │ │ Input:  ~185 tokens                            │  │
   │ │ Output: ~1500 tokens (estimated)               │  │
   │ │ Total:  ~1685 tokens                           │  │
   │ │                                                 │  │
   │ │ Estimated cost: $0.0009                        │  │
   │ │                                                 │  │
   │ │ 💡 Tip: This prompt is optimal for             │  │
   │ │    gpt-4o-mini. Switching to GPT-4o would     │  │
   │ │    cost $0.0042 (4.6x more expensive)         │  │
   │ └────────────────────────────────────────────────┘  │
   │                                                      │
   │ [▶ Run Prompt]                                      │
   └──────────────────────────────────────────────────────┘
   ```

2. **During Execution - Progress Indicator**
   ```
   ┌──────────────────────────────────────────────────────┐
   │ ⏳ Running your prompt...                            │
   │ ▓▓▓▓▓▓▓▓░░░░░░░░░░░░                               │
   │ Estimated time: 3-5 seconds                          │
   └──────────────────────────────────────────────────────┘
   ```

3. **After Execution - Results with Actual Cost**
   ```
   ┌──────────────────────────────────────────────────────┐
   │ ✅ Execution Complete                                │
   ├──────────────────────────────────────────────────────┤
   │ Results:                                             │
   │ ┌────────────────────────────────────────────────┐  │
   │ │ [AI-generated blog post content...]            │  │
   │ │                                                 │  │
   │ │ [Copy] [Edit] [Save]                           │  │
   │ └────────────────────────────────────────────────┘  │
   │                                                      │
   │ 📊 Usage Breakdown                                  │
   │ ┌────────────────────────────────────────────────┐  │
   │ │ Input:  187 tokens ($0.000028)                 │  │
   │ │ Output: 1342 tokens ($0.000805)                │  │
   │ │ Total:  1529 tokens                            │  │
   │ │                                                 │  │
   │ │ Actual cost: $0.000833                         │  │
   │ │ Execution time: 4.2s                           │  │
   │ │                                                 │  │
   │ │ Monthly usage: $12.45 / $30.00 (41.5%)        │  │
   │ │ ▓▓▓▓▓▓▓▓░░░░░░░░░░░░                          │  │
   │ └────────────────────────────────────────────────┘  │
   └──────────────────────────────────────────────────────┘
   ```

---

### Journey 3: Budget Alert & Response

**Starting Point:** User has used 76% of monthly budget

**Steps:**

1. **Alert Notification**
   ```
   ┌──────────────────────────────────────────────────────┐
   │ 🔔 [1]   Dashboard   Prompts   Usage   Settings      │
   └──────────────────────────────────────────────────────┘
   ```

2. **Alert Banner in Prompt Lab**
   ```
   ┌──────────────────────────────────────────────────────┐
   │ ⚠️  Budget Alert                                      │
   │ You've used 76% of your monthly budget               │
   │ ($22.80 / $30.00)                                    │
   │                                                       │
   │ [View Usage Details] [Increase Budget] [Dismiss]     │
   └──────────────────────────────────────────────────────┘
   ```

3. **Usage Details Modal**
   ```
   ┌──────────────────────────────────────────────────────┐
   │ Current Usage Details                        [✕]     │
   ├──────────────────────────────────────────────────────┤
   │ December 2025                                        │
   │ $22.80 / $30.00 (76%)                               │
   │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░                              │
   │                                                      │
   │ Usage by Model:                                     │
   │ • gpt-4o-mini: $14.25 (62%)                         │
   │ • gpt-4o: $6.55 (29%)                               │
   │ • gpt-4: $2.00 (9%)                                 │
   │                                                      │
   │ Projected month-end: $35.20                         │
   │ ⚠️ You may exceed your budget                       │
   │                                                      │
   │ 💡 Recommendations:                                 │
   │ • Switch GPT-4o runs to GPT-4o Mini (save $4/mo)   │
   │ • Reduce prompt length by 20% (save $3/mo)         │
   │                                                      │
   │ [View Detailed Report] [Adjust Budget] [Close]      │
   └──────────────────────────────────────────────────────┘
   ```

4. **Quick Budget Adjustment**
   ```
   ┌──────────────────────────────────────────────────────┐
   │ Adjust Monthly Budget                        [✕]     │
   ├──────────────────────────────────────────────────────┤
   │ Current Budget: $30.00                              │
   │ Projected Usage: $35.20                             │
   │                                                      │
   │ Suggested Budget: $40.00                            │
   │                                                      │
   │ New Monthly Budget:                                 │
   │ ┌──────────────────────────┐                        │
   │ │ $ 40.00                  │                        │
   │ └──────────────────────────┘                        │
   │                                                      │
   │ ☑ Keep existing alert thresholds (75%, 90%, 100%)  │
   │                                                      │
   │ [Cancel] [Save Changes]                             │
   └──────────────────────────────────────────────────────┘
   ```

---

### Journey 4: Viewing Usage Dashboard

**Starting Point:** User clicks "Usage" in main navigation

**Full Dashboard Layout:**

```
┌────────────────────────────────────────────────────────────────┐
│ Dashboard > Usage Analytics                                     │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│ December 2025                    [Last 30 Days ▼]  [Export ▼]  │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐      │
│ │   $22.80  │ │   850K    │ │  $0.019   │ │    145    │      │
│ │   Spent   │ │  Tokens   │ │ Avg Cost  │ │   Runs    │      │
│ │   ───────  │ │  ───────  │ │  ───────  │ │  ───────  │      │
│ │ Budget:   │ │ vs last:  │ │ per run   │ │ vs last:  │      │
│ │ $30.00    │ │ +12%  ▲   │ │           │ │ +8%   ▲   │      │
│ │ (76%)     │ │           │ │           │ │           │      │
│ └───────────┘ └───────────┘ └───────────┘ └───────────┘      │
│                                                                 │
│ Daily Usage Trend                                              │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │  $2.0                                                     │  │
│ │  $1.5        ▄▆▇                                          │  │
│ │  $1.0  ▂▄▃▆█████▆▄▃▂                                      │  │
│ │  $0.5 ▁████████████▃▂▁                                    │  │
│ │  $0.0 ─────┬──────┬──────┬──────┬──────                  │  │
│ │       Dec 1    Dec 8   Dec 15  Dec 22  Dec 29            │  │
│ │                                                            │  │
│ │ Legend: ▬ Tokens  ▬ Cost                                  │  │
│ └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│ Cost Breakdown by Model             Top Prompts by Cost        │
│ ┌──────────────────────────┐       ┌───────────────────────┐  │
│ │                          │       │ 1. Blog Post Gen      │  │
│ │    ███████  62%          │       │    $8.25  (52 runs)   │  │
│ │    gpt-4o-mini           │       │                        │  │
│ │    $14.25                │       │ 2. Code Review        │  │
│ │                          │       │    $5.60  (28 runs)   │  │
│ │    ████  29%             │       │                        │  │
│ │    gpt-4o                │       │ 3. Email Writer       │  │
│ │    $6.55                 │       │    $4.10  (45 runs)   │  │
│ │                          │       │                        │  │
│ │    █  9%                 │       │ 4. Social Posts       │  │
│ │    gpt-4                 │       │    $2.85  (20 runs)   │  │
│ │    $2.00                 │       │                        │  │
│ └──────────────────────────┘       └───────────────────────┘  │
│                                                                 │
│ Recent Activity                                                │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ Date/Time       Prompt           Model      Tokens  Cost  │  │
│ ├──────────────────────────────────────────────────────────┤  │
│ │ Dec 15, 2:30pm  Blog Post Gen    4o-mini   1,529  $0.83  │  │
│ │ Dec 15, 11:15am Code Review      4o         2,341  $1.25  │  │
│ │ Dec 14, 4:45pm  Email Writer     4o-mini     842  $0.42  │  │
│ │ Dec 14, 2:20pm  Social Posts     4o-mini     324  $0.18  │  │
│ │ ...                                                        │  │
│ └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│ [← Previous Page] [1] [2] [3] [Next Page →]                   │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

### Journey 5: Enterprise Team Admin View

**Starting Point:** Team admin viewing team usage

**Team Dashboard:**

```
┌────────────────────────────────────────────────────────────────┐
│ Team Dashboard - Engineering Team (15 members)                  │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│ December 2025                    [View as: Team ▼]  [Export ▼] │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐      │
│ │  $342.50  │ │    15     │ │  $22.83   │ │   2,145   │      │
│ │   Team    │ │   Active  │ │  Average  │ │   Total   │      │
│ │   Total   │ │   Users   │ │ per User  │ │   Runs    │      │
│ │  ───────  │ │  ───────  │ │  ───────  │ │  ───────  │      │
│ │ Budget:   │ │ Limit: 20 │ │ Target:   │ │ vs last:  │      │
│ │ $500.00   │ │           │ │ <$25.00   │ │ +15%  ▲   │      │
│ │ (68.5%)   │ │           │ │           │ │           │      │
│ └───────────┘ └───────────┘ └───────────┘ └───────────┘      │
│                                                                 │
│ Usage by Team Member                                           │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ User            Runs   Tokens    Cost    Budget   Status  │  │
│ ├──────────────────────────────────────────────────────────┤  │
│ │ John Doe         245   125K    $42.50   $50.00   ⚠️  85%  │  │
│ │ Jane Smith       198    98K    $38.20   $50.00   ✅  76%  │  │
│ │ Bob Johnson      156    75K    $32.80   $50.00   ✅  66%  │  │
│ │ Alice Williams   142    68K    $28.90   $50.00   ✅  58%  │  │
│ │ Charlie Brown    128    52K    $24.10   $50.00   ✅  48%  │  │
│ │ ...                                                        │  │
│ └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│ 💡 Cost Optimization Recommendations                           │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ 1. High-cost users: 3 users over $35/month                │  │
│ │    → Recommend switching to GPT-4o Mini                   │  │
│ │    Potential savings: $48/month                           │  │
│ │                                                             │  │
│ │ 2. Excessive context: 5 prompts use >4000 input tokens    │  │
│ │    → Optimize prompt structure                            │  │
│ │    Potential savings: $22/month                           │  │
│ │                                                             │  │
│ │ 3. Model selection: 15% of runs use GPT-4 unnecessarily   │  │
│ │    → Review prompt requirements                           │  │
│ │    Potential savings: $35/month                           │  │
│ │                                                             │  │
│ │ Total potential savings: $105/month (30% reduction)       │  │
│ │                                                             │  │
│ │ [View Detailed Recommendations] [Apply Suggestions]        │  │
│ └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│ Scheduled Reports                                              │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ Weekly Team Summary  →  CFO@company.com   Every Monday    │  │
│ │ Monthly Cost Report  →  Finance Team      1st of month    │  │
│ │                                                             │  │
│ │ [+ Add New Report]                                         │  │
│ └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## Mobile Responsiveness

### Mobile Prompt Lab View

```
┌─────────────────────┐
│ ☰  Prompt Lab  [⚙]  │
├─────────────────────┤
│                      │
│ Model: gpt-4o-mini  │
│                      │
│ ┌─────────────────┐ │
│ │ Write a blog    │ │
│ │ post about...   │ │
│ │                 │ │
│ └─────────────────┘ │
│                      │
│ 💰 Est: $0.0009     │
│ ~1685 tokens        │
│                      │
│ [▶ Run]             │
│                      │
│ ═══════════════     │
│                      │
│ History (3)         │
│ ┌─────────────────┐ │
│ │ ✅ 1529 tokens  │ │
│ │ $0.000833       │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ ✅ 842 tokens   │ │
│ │ $0.000420       │ │
│ └─────────────────┘ │
│                      │
└─────────────────────┘
```

### Mobile Dashboard View

```
┌─────────────────────┐
│ ☰  Usage     [⋮]    │
├─────────────────────┤
│                      │
│ December 2025       │
│ [Last 30 Days ▼]    │
│                      │
│ ┌─────────────────┐ │
│ │ $22.80 / $30    │ │
│ │ Spent (76%)     │ │
│ │ ▓▓▓▓▓▓▓░░░      │ │
│ └─────────────────┘ │
│                      │
│ ┌─────────────────┐ │
│ │ 850K Tokens     │ │
│ │ +12% from last  │ │
│ └─────────────────┘ │
│                      │
│ ┌─────────────────┐ │
│ │ 145 Runs        │ │
│ │ $0.019 avg      │ │
│ └─────────────────┘ │
│                      │
│ [View Chart]        │
│ [Export Data]       │
│                      │
└─────────────────────┘
```

---

## Accessibility Considerations

### ARIA Labels & Screen Reader Support

```typescript
// Example: TokenPreview Component
<div role="region" aria-label="Cost preview">
  <div aria-live="polite" aria-atomic="true">
    Estimated cost: ${estimate.cost.toFixed(4)}
  </div>
  <div aria-label="Token breakdown">
    <span>Input tokens: {inputTokens}</span>
    <span>Output tokens: {outputTokens}</span>
  </div>
</div>

// Budget progress bar
<div
  role="progressbar"
  aria-valuenow={percentage}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label={`Budget usage: ${percentage}% of $${budget}`}
>
  <div style={{ width: `${percentage}%` }} />
</div>
```

### Keyboard Navigation

- **Tab**: Navigate through interactive elements
- **Enter/Space**: Activate buttons
- **Escape**: Close modals and alerts
- **Arrow keys**: Navigate charts and tables

### Color Contrast

All color combinations meet WCAG AA standards:
- Warning alerts: Amber text on light background (4.5:1 ratio)
- Critical alerts: Red text on light background (4.5:1 ratio)
- Success indicators: Green with sufficient contrast

---

## Error States & Edge Cases

### Error: Budget Exceeded - Cannot Run Prompt

```
┌─────────────────────────────────────────────────┐
│ 🚫 Cannot Run Prompt                             │
│                                                  │
│ Your monthly budget has been exceeded.          │
│ Current usage: $32.50 / $30.00                  │
│                                                  │
│ Options:                                        │
│ • [Increase Budget] to continue running prompts │
│ • [Wait until next month] (resets Jan 1)        │
│ • [Contact Support] for assistance              │
│                                                  │
│ [View Usage Details]                            │
└─────────────────────────────────────────────────┘
```

### Error: Token Limit Exceeded

```
┌─────────────────────────────────────────────────┐
│ ⚠️ Prompt Too Long                               │
│                                                  │
│ Your prompt exceeds the token limit:            │
│ • Current: 12,450 tokens                        │
│ • Limit: 10,000 tokens per prompt              │
│                                                  │
│ Suggestions:                                    │
│ • Shorten the prompt or context                 │
│ • Remove unnecessary details                    │
│ • Upgrade to Enterprise for higher limits      │
│                                                  │
│ [Edit Prompt] [Learn More]                      │
└─────────────────────────────────────────────────┘
```

### Loading State: Fetching Usage Data

```
┌─────────────────────────────────────────────────┐
│ Loading usage data...                           │
│                                                  │
│ ┌─────────────────┐  ▓▓▓▓░░░░░░░░              │
│ │                 │  Fetching analytics...      │
│ │   [Skeleton]    │                             │
│ │                 │                             │
│ └─────────────────┘                             │
└─────────────────────────────────────────────────┘
```


