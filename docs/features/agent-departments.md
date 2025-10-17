# Agent Department System

## Overview

The agent system now supports department-based organization, making it easy to categorize and filter agents by their functional area.

## Available Departments

| Department      | Icon | Use Case                                             |
| --------------- | ---- | ---------------------------------------------------- |
| **Marketing**   | 📊   | Campaigns, analytics, growth strategies, branding    |
| **Support**     | 💬   | Customer service, ticket resolution, help desk       |
| **Legal**       | ⚖️   | Compliance, contracts, policy documents              |
| **Design**      | 🎨   | UI/UX, branding, creative assets                     |
| **Engineering** | ⚙️   | Code reviews, architecture, debugging, documentation |
| **Sales**       | 💰   | Prospecting, objection handling, closing deals       |
| **Content**     | ✍️   | Blog posts, social media, video scripts              |
| **Product**     | 📦   | Product strategy, user research, roadmap planning    |
| **Operations**  | 🔧   | Business operations, workflows, processes            |
| **General**     | 📂   | Cross-functional or generic prompts                  |

## Pre-configured Department Agents

### Marketing Department

- **Marketing Manager Agent**: Campaigns, analytics, growth strategies

### Content Department

- **Content Creator Agent**: Social media, blogging, video content

### Operations Department

- **Small Business Owner Agent**: Business operations, customer service, sales

### Support Department

- **Customer Support Agent**: Ticket resolution, customer satisfaction, troubleshooting

### Sales Department

- **Sales Team Agent**: Prospecting, objection handling, closing deals

### Product Department

- **Product Manager Agent**: Product strategy, user research, roadmap planning

### Engineering Department

- **Engineering Team Agent**: Code review, architecture, debugging, documentation

### General Department

- **Trending Topics Agent**: AI, productivity, marketing, coding
- **Niche Expert Agent**: Healthcare, finance, education, ecommerce
- **Educational Agent**: Prompt engineering, AI tools, workflow optimization
- **Seasonal Agent**: Holidays, seasons, business cycles

## Using the Department System

### Viewing Agents by Department

1. Go to `/dashboard/agents`
2. Click on department filter buttons to view only that department's agents
3. Click "All" to view all agents across departments

### Creating Department-Specific Agents

1. Click "Create Agent"
2. Fill in agent details
3. Select the appropriate department from the dropdown
4. Click "Create Agent"

### Filtering in Dashboard

- Department badges appear on each agent card
- Filter buttons show count of agents per department
- Only departments with active agents are displayed in filter

## Agent Configuration by Department

### Marketing Agents

```json
{
  "industries": ["marketing", "advertising", "growth"],
  "topics": ["campaigns", "analytics", "conversion", "branding"],
  "persona": "marketing_manager"
}
```

### Support Agents

```json
{
  "industries": ["customer_service", "support", "help_desk"],
  "topics": ["ticket_resolution", "customer_satisfaction", "empathy"],
  "persona": "support_agent"
}
```

### Sales Agents

```json
{
  "industries": ["sales", "business_development"],
  "topics": ["prospecting", "objection_handling", "closing", "follow_up"],
  "persona": "sales_professional"
}
```

### Engineering Agents

```json
{
  "industries": ["software", "development"],
  "topics": ["code_review", "architecture", "debugging", "documentation"],
  "persona": "engineer"
}
```

### Product Agents

```json
{
  "subjects": ["product_strategy", "user_research", "roadmap_planning"],
  "persona": "product_manager"
}
```

## Database Schema

```sql
-- Department field in agents table
department text default 'general',
constraint agents_department_check check (
  department in (
    'marketing', 'support', 'legal', 'design',
    'engineering', 'sales', 'content', 'product',
    'operations', 'general'
  )
)
```

## API Updates

### Creating an Agent with Department

```javascript
POST /api/agents
{
  "name": "My Custom Agent",
  "description": "Agent description",
  "strategy": "niche",
  "department": "marketing",
  "config": {}
}
```

### Filtering by Department

The dashboard automatically filters agents when you select a department button. The filtering happens client-side for instant response.

## Best Practices

1. **Choose Appropriate Department**: Select the department that best matches the agent's primary function
2. **Configure for Audience**: Tailor agent config to the specific persona in that department
3. **Monitor Performance**: Track agent metrics by department to optimize effectiveness
4. **Organize Logically**: Keep related agents in the same department for easy management
5. **Use General Sparingly**: Reserve "General" for truly cross-functional agents

## Migration

Run the following migrations in order:

1. `20241220000000_autonomous_agent.sql` - Creates tables and default agents
2. `20241220000001_agent_departments.sql` - Adds department field (if needed as upgrade)

## Future Enhancements

- Department-specific metrics and reporting
- Department templates for quick agent creation
- Department-based scheduling and quotas
- Cross-department collaboration agents
