# Autonomous Agent System

## Overview
The autonomous agent system generates high-quality prompts for the public directory using AI. Agents can be manually triggered to create prompts based on different strategies.

## Architecture

### Database Schema
- **agents**: Agent configurations and settings
- **agent_generations**: History of generated prompts
- **agent_metrics**: Performance tracking and analytics

### Agent Strategies
1. **Trending**: Generates prompts for current trending topics
2. **Niche**: Creates industry-specific prompts for specialized use cases
3. **Educational**: Produces learning-focused prompts and tutorials
4. **Seasonal**: Generates prompts based on seasons, holidays, and events

### Core Components
- `AutonomousAgent` class: Main agent logic and prompt generation
- `/api/agents/schedule`: Manual trigger endpoint for agent generation
- `/api/agents`: Agent management API
- `AgentDashboard`: Admin interface for monitoring and control

## Setup Instructions

### 1. Database Migration
Run the migration to create agent tables:
```sql
-- Run in Supabase SQL Editor
-- File: supabase/migrations/20241220000000_autonomous_agent.sql
```

### 2. Agent Dashboard
Add to your admin dashboard:
```tsx
import { AgentDashboard } from '@/components/AgentDashboard'

// In your admin page
<AgentDashboard />
```

## Usage

### Manual Generation
Test individual agents:
```bash
curl "https://your-domain.com/api/agents/schedule?agentId=AGENT_ID"
```

### Agent Management
- View all agents: `GET /api/agents`
- Create agent: `POST /api/agents`
- Update agent: `PUT /api/agents`
- Delete agent: `DELETE /api/agents?id=AGENT_ID`

### Quality Control
- Only prompts with quality score ≥ 0.6 are published
- AI-powered scoring based on clarity, usefulness, professionalism, and completeness
- Automatic cost tracking and budget controls

## Cost Optimization

### Current Controls
- Uses `gpt-4o-mini` for generation (cheapest model)
- Caps max_tokens to 300-500 per generation
- Input truncation to prevent runaway costs
- Quality scoring to avoid publishing low-quality prompts

### Additional Optimizations
1. **Batch Processing**: Generate multiple prompts in single API call
2. **Caching**: Cache similar prompts to avoid duplicate generation
3. **Rate Limiting**: Limit generation frequency per agent
4. **Budget Caps**: Set daily/monthly spending limits per agent

## Monitoring

### Key Metrics
- Prompts generated per day
- Average quality score
- Cost per prompt
- View count of generated prompts
- Agent uptime and error rates

### Alerts
Set up monitoring for:
- Agent failures
- Cost threshold breaches
- Quality score drops
- Generation rate anomalies

## Customization

### Adding New Strategies
1. Extend `AgentConfig` interface
2. Add strategy case in `AutonomousAgent.generatePrompt()`
3. Implement strategy-specific generation method
4. Update agent configuration in database

### Quality Scoring
Modify `scorePrompt()` method to adjust scoring criteria:
- Add industry-specific scoring
- Weight different quality factors
- Implement custom scoring models

### Manual Generation
Trigger agents manually from the dashboard:
- Generate prompts on-demand for any active agent
- Control when prompts are created
- Test different agent configurations

## Security

### Access Control
- Agent management requires admin privileges
- Manual generation available through admin dashboard
- Database operations use service role

### Content Filtering
- Generated prompts reviewed by quality scoring
- Automatic filtering of inappropriate content
- Manual review queue for edge cases

## Troubleshooting

### Common Issues
1. **Agent not generating**: Check `is_active` status and API key
2. **Low quality scores**: Adjust generation prompts or scoring criteria
3. **High costs**: Reduce generation frequency or token limits
4. **Database errors**: Verify RLS policies and service role permissions

### Debugging
- Use manual generation endpoint for testing: `GET /api/agents/schedule?agentId=AGENT_ID`
- Monitor database for failed generations
- Test agents from the admin dashboard
- Review agent metrics for performance issues
