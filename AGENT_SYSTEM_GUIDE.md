# AI Agent System - User Guide

## 🎯 What is the Agent System?

The AI Agent System is a **fully functional** autonomous prompt generation tool that automatically creates high-quality prompts for you. It's currently available to **admin users only**.

---

## 🔑 How to Access the Agent System

### Access Requirements

**Only these admin emails can access:**

- `mikemoloney.business@gmail.com`
- `hkaufman19@gmail.com`
- `mike@filtergrade.com`

If you're logged in with one of these emails, you'll see the agent dashboard at:

**👉 `/dashboard/agent`**

---

## 📍 Where to Find It

1. **Direct URL**: Navigate to `/dashboard/agent` in your browser
2. **From Dashboard**: Look for an "AI Agents" link (if added to sidebar)
3. **Manual Navigation**: Type the URL directly

**Note:** The `/ai-agents` page is just a marketing/coming-soon page. The **actual functional dashboard** is at `/dashboard/agent`.

---

## 🚀 How to Use the Agent System

### Step 1: Access the Dashboard

1. Make sure you're logged in with an admin email
2. Navigate to `https://yourdomain.com/dashboard/agent`
3. You'll see the main dashboard

### Step 2: Create Your First Agent (if needed)

If you don't have an agent yet:

1. Navigate to `/dashboard/agent/setup`
2. Fill in the agent details:
   - **Name**: Give your agent a name (e.g., "Content Generator")
   - **Mode**:
     - `autonomous` - Auto-publishes prompts if quality score >= threshold
     - `review` - Requires manual approval before publishing
   - **Temperature**: 0.0-2.0 (higher = more creative, default: 0.7)
   - **Quality Threshold**: 0-100 (minimum score to auto-publish, default: 85)
3. Click "Create Agent"

### Step 3: Add Keywords

Keywords are topics your agent will generate prompts about:

1. Go to the **Keywords** tab
2. Click "Add Keyword"
3. Enter keywords like:
   - "blog writing"
   - "email marketing"
   - "social media"
   - "product descriptions"

### Step 4: Generate Prompts

1. Click the **"Generate Batch"** button in the top right
2. The agent will:
   - Generate prompts based on your keywords
   - Score each prompt (0-100 quality score)
   - Auto-publish if mode = `autonomous` and score >= threshold
   - Queue for review if mode = `review` or score < threshold

### Step 5: Review Generated Prompts

1. Go to the **Prompts** tab
2. You'll see all generated prompts with:
   - **Status**: draft, review, approved, published, rejected
   - **Quality Score**: 0-100
   - **Topic/Keyword**: What it was generated from
3. **Actions you can take**:
   - **Approve**: Move from review → approved
   - **Publish**: Make prompt public
   - **Reject**: Remove if not good enough
   - **Unpublish**: Make public prompt private

---

## 📊 Understanding the Dashboard Tabs

### Overview Tab

- **Stats Cards**: Total prompts, published, pending, average quality
- **Recent Activity**: Latest generated prompts
- **Quick Metrics**: Generation stats, top keywords

### Prompts Tab

- **Table View**: All agent-generated prompts
- **Filtering**: By status, keyword, date
- **Actions**: Approve, publish, reject, unpublish
- **Click prompt name**: View/edit in prompt editor

### Keywords Tab

- **Manage Keywords**: Add, remove, activate/deactivate
- **Categories**: Organize keywords by category
- **Priority**: Set which keywords to generate first
- **Stats**: See how many prompts generated per keyword

### Settings Tab

- **Agent Configuration**: Name, mode, temperature, quality threshold
- **Update Settings**: Change any configuration
- **Activate/Deactivate**: Turn agent on/off

---

## 🎛️ Agent Modes Explained

### Review Mode (Recommended for Start)

- ✅ All generated prompts require manual approval
- ✅ You review each prompt before publishing
- ✅ Best for maintaining quality control
- ✅ See quality scores before deciding

### Autonomous Mode (Advanced)

- ✅ Auto-publishes prompts if quality score >= threshold
- ✅ Runs 24/7 without manual intervention
- ✅ Great for high-volume content generation
- ⚠️ Set quality threshold carefully (recommend 85+)

---

## 🔧 Advanced Features

### Batch Generation

- Generate multiple prompts at once
- Default batch size: 5 prompts
- Can generate up to 100+ prompts in one batch
- Each prompt takes ~5-8 seconds

### Quality Scoring

Every prompt gets a quality score (0-100) based on:

- **Clarity**: How clear and understandable
- **Usefulness**: How practical and valuable
- **Uniqueness**: How original and distinct
- **SEO**: How search-engine optimized

### Keyword Management

- **Priority**: Higher priority keywords generate first
- **Category**: Organize by topic/category
- **Active/Inactive**: Turn keywords on/off
- **Generation Count**: See how many prompts per keyword

---

## 📈 Monitoring Agent Performance

### Stats to Watch

- **Total Generated**: How many prompts created
- **Published Count**: How many made public
- **Average Quality**: Overall quality score
- **Success Rate**: % of prompts that meet threshold

### Key Metrics

- **Generation Speed**: ~5-8 seconds per prompt
- **Quality Distribution**: Most prompts should score 75-95
- **Keyword Performance**: Which keywords produce best results

---

## ⚠️ Important Notes

1. **Admin Only**: Only admin emails can access
2. **OpenAI Required**: System uses OpenAI GPT-4o (requires `OPENAI_API_KEY`)
3. **Cost**: Each prompt generation uses OpenAI API credits
4. **Rate Limits**: OpenAI API has rate limits (be mindful of batch sizes)
5. **Database**: All prompts saved to Supabase database

---

## 🐛 Troubleshooting

### "Unauthorized" Error

- ✅ Make sure you're logged in with an admin email
- ✅ Check your email in the user profile
- ✅ Contact support to add your email to admin list

### No Agents Showing

- ✅ Create your first agent at `/dashboard/agent/setup`
- ✅ Check database to see if agents exist

### Generation Fails

- ✅ Check `OPENAI_API_KEY` is set in environment variables
- ✅ Check OpenAI API credits/balance
- ✅ Check network/API connectivity
- ✅ Review server logs for errors

### Quality Scores Too Low

- ✅ Lower the quality threshold (try 75 instead of 85)
- ✅ Adjust temperature (try 0.8-0.9 for more creative prompts)
- ✅ Refine keywords to be more specific

---

## 🎯 Best Practices

1. **Start in Review Mode**: Learn the system before going autonomous
2. **Start with 5-10 Keywords**: Don't overwhelm the system initially
3. **Monitor First 50 Prompts**: Review quality before scaling
4. **Adjust Threshold Based on Results**: Start at 85, adjust up/down
5. **Use Specific Keywords**: "email subject lines" > "email"
6. **Review Published Prompts**: Check what's going live

---

## 📞 Support & Resources

- **Dashboard**: `/dashboard/agent`
- **Test Page**: `/dashboard/agent/test` (testing utilities)
- **Setup Page**: `/dashboard/agent/setup`
- **API Docs**: See `AGENT_SYSTEM_SUMMARY.md`
- **Database Tables**: `agents`, `agent_prompts`, `agent_keywords`

---

## 🚀 Next Steps

1. **Access Dashboard**: Go to `/dashboard/agent`
2. **Create Agent**: If you don't have one yet
3. **Add Keywords**: 5-10 relevant keywords
4. **Generate First Batch**: Click "Generate Batch" button
5. **Review Results**: Check the Prompts tab
6. **Publish Best Ones**: Approve and publish high-quality prompts
7. **Iterate**: Add more keywords, adjust settings, scale up

---

**Ready to start?** Navigate to `/dashboard/agent` now! 🎉
