# Agent System Quick Reference

## 🎯 Quick Create Examples

### Blog Writer (Marketing)

```
Name: Marketing Blog Writer
Department: Marketing
Output Type: Blog Post
Strategy: Niche
Audience: Marketing professionals
Tone: Professional
Length: Detailed
Topics: ["SEO", "content marketing", "growth"]
```

### Support Doc Generator

```
Name: Support Documentation Agent
Department: Support
Output Type: Documentation
Strategy: Educational
Audience: Customers
Tone: Friendly
Length: Comprehensive
Topics: ["troubleshooting", "setup", "FAQs"]
```

### Social Media Bot

```
Name: Social Media Manager
Department: Marketing
Output Type: Social Media
Strategy: Trending
Audience: Social followers
Tone: Engaging
Length: Concise
Platforms: ["twitter", "linkedin", "instagram"]
```

### Code Generator

```
Name: Code Utility Generator
Department: Engineering
Output Type: Code
Strategy: Educational
Audience: Developers
Tone: Technical
Length: Medium
Languages: ["typescript", "python"]
```

### Email Marketer

```
Name: Email Campaign Bot
Department: Marketing
Output Type: Email
Strategy: Niche
Audience: Subscribers
Tone: Persuasive
Length: Medium
Topics: ["product launches", "promotions"]
```

## 🔧 Token Limits by Output Type

| Type          | Concise | Medium | Detailed | Comprehensive |
| ------------- | ------- | ------ | -------- | ------------- |
| Prompt        | 300     | 500    | 700      | 1000          |
| Blog Post     | 400     | 600    | 1000     | 1500          |
| Documentation | 500     | 800    | 1200     | 1500          |
| Email         | 200     | 400    | 500      | 600           |
| Social Media  | 150     | 300    | 400      | 500           |
| Code          | 400     | 600    | 800      | 1000          |
| Tutorial      | 500     | 800    | 1200     | 1500          |

## 📊 Cost Estimates (gpt-4o-mini)

| Output Type   | Avg Tokens | Cost per Generation |
| ------------- | ---------- | ------------------- |
| Social Media  | 300        | ~$0.0001            |
| Email         | 400        | ~$0.00015           |
| Prompt        | 500        | ~$0.0002            |
| Code          | 600        | ~$0.00025           |
| Blog Post     | 1000       | ~$0.0004            |
| Documentation | 800        | ~$0.00032           |
| Tutorial      | 800        | ~$0.00032           |

_Prices based on gpt-4o-mini at $0.150/1M input tokens, $0.600/1M output tokens_

## 🎨 Department + Output Type Combinations

### Marketing

- ✅ Blog Posts - SEO content
- ✅ Emails - Campaigns
- ✅ Social Media - Platform posts
- ✅ Ads - Copy
- ✅ Landing Pages - Marketing copy

### Support

- ✅ Documentation - Help docs
- ✅ Tutorials - How-to guides
- ✅ Emails - Support responses
- ✅ FAQs - Common questions

### Engineering

- ✅ Code - Snippets & utilities
- ✅ Documentation - API docs
- ✅ Tutorials - Technical guides

### Content

- ✅ Blog Posts - Articles
- ✅ Social Media - Posts
- ✅ Newsletters - Email content
- ✅ Scripts - Video content

### Product

- ✅ Documentation - Product docs
- ✅ Tutorials - User guides
- ✅ Product Descriptions - Copy
- ✅ Case Studies - Success stories

### Sales

- ✅ Emails - Outreach
- ✅ Presentations - Pitch decks
- ✅ Case Studies - Social proof

## 🚀 Quick Start Workflow

1. **Choose Department** → Where does this fit?
2. **Select Output Type** → What format do you need?
3. **Pick Strategy** → How should it find topics?
   - Trending → Current hot topics
   - Niche → Specific industries
   - Educational → Teaching content
   - Seasonal → Time-based
4. **Set Audience** → Who's this for?
5. **Choose Tone** → How should it sound?
6. **Pick Length** → How long should it be?
7. **Create & Test** → Generate one manually first

## 💡 Pro Tips

### For High Volume

- Use `concise` length
- Choose `social_media` or `email` types
- Lower max_tokens = lower cost

### For Quality

- Use `detailed` or `comprehensive` length
- Set specific target_audience
- Include detailed config topics

### For Engagement

- Use `conversational` or `engaging` tone
- Add platform-specific formatting
- Include CTAs in output_format

### For Technical Content

- Use `authoritative` or `educational` tone
- Enable code examples in output_format
- Set audience to specific role

## 🎯 Success Metrics

**Track these per agent:**

- Quality Score (0-1)
- Views/Engagement
- Cost per generation
- Generations per day
- Published vs rejected ratio

**Optimize when:**

- Quality score < 0.7 → Adjust config
- High cost → Reduce length/tokens
- Low engagement → Change tone/audience
- Low publish rate → Better topics

## 🔄 Iteration Tips

### If outputs are too generic:

1. Add more specific topics to config
2. Define narrower target_audience
3. Add industry context to config

### If outputs are too long:

1. Reduce length_preference
2. Lower max_tokens in code
3. Use more concise output type

### If outputs miss the mark:

1. Adjust tone setting
2. Refine target_audience
3. Change strategy type
4. Add more config context

### If costs are too high:

1. Reduce frequency in config
2. Use concise length
3. Pick shorter output types
4. Cap max_tokens lower

## 📝 Common Configurations

### Daily Content Engine

```
5 agents running:
- Blog Writer (2x/day, detailed)
- Social Manager (4x/day, concise)
- Email Marketer (1x/day, medium)
- Doc Writer (1x/week, comprehensive)
- Tutorial Creator (2x/week, detailed)
```

### Cost-Optimized Setup

```
3 agents running:
- Social only (4x/day, concise, 300 tokens)
- Prompts only (2x/day, medium, 500 tokens)
- Emails only (1x/day, medium, 400 tokens)
Daily cost: ~$0.02
```

### Quality-Focused Setup

```
2 agents running:
- Blog Writer (1x/day, comprehensive, 1500 tokens)
- Documentation (1x/week, comprehensive, 1500 tokens)
Focus on quality over quantity
```

## 🎓 Learning Path

1. **Start Simple**
   - Create 1 prompt agent
   - Test manually
   - Review output

2. **Add Variety**
   - Create blog agent
   - Create social agent
   - Compare results

3. **Optimize**
   - Adjust tones
   - Tweak audiences
   - Refine configs

4. **Scale**
   - Add more agents
   - Automate schedule
   - Monitor metrics

5. **Advanced**
   - Custom output_format
   - Multi-department strategy
   - A/B test configurations
