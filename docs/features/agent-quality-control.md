# Agent Quality Control & Brand Guidelines System

## Overview
Ensure your agents create consistently amazing, on-brand content that meets your quality standards. Full control over style, tone, phrases, and content requirements.

## 🎯 Quality Control Features

### 1. **Brand Guidelines**
Define your brand voice and values:

```json
{
  "brand_voice": "Professional yet approachable, innovative, data-driven",
  "brand_values": ["transparency", "innovation", "customer-first", "quality"],
  "do_use": ["actionable insights", "proven strategies", "data-backed"],
  "dont_use": ["revolutionary", "game-changing", "disruptive", "synergy"]
}
```

### 2. **Quality Standards**
Set measurable quality requirements:

```json
{
  "min_word_count": 800,
  "max_word_count": 1200,
  "readability_level": "8th grade",
  "must_include_examples": true,
  "must_include_actionable_steps": true,
  "must_include_statistics": true,
  "formatting_required": true,
  "citations_required": false
}
```

### 3. **Required Elements**
Specify what must be included:

```json
{
  "headline": "Number or power word + benefit + keyword",
  "introduction": "Hook question + problem statement + solution preview",
  "body": "Minimum 3 sections with H2 subheadings, each with examples",
  "actionable_tips": "Minimum 3 specific, implementable steps",
  "conclusion": "Summary + next step + CTA",
  "metadata": "SEO title (60 chars), meta description (155 chars)"
}
```

### 4. **Key Phrases**
Words/phrases agents should include naturally:

```
["proven strategies", "actionable insights", "data-backed results", "practical approach", "step-by-step guide", "real-world examples"]
```

### 5. **Forbidden Phrases**
Words/phrases agents must NEVER use:

```
["click here", "buy now", "limited time", "secret trick", "revolutionary", "guaranteed", "make money fast"]
```

### 6. **Style Guide**
Detailed writing instructions:

```
STYLE GUIDE:
- Use active voice (not passive)
- Address reader directly with "you"
- One main idea per paragraph
- Paragraphs: 2-4 sentences max
- Include transition words between sections
- Use bullet points for lists (3+ items)
- Bold key takeaways
- Include at least 1 relevant statistic per section
- End sections with actionable insight
- No jargon without explanation
- Conversational but professional tone
```

### 7. **Examples**
Show good vs. bad examples:

```json
{
  "good_example": "Discover 5 proven email marketing strategies that increased open rates by 34% for over 1,000 businesses.",
  "bad_example": "This revolutionary email marketing secret will change everything! Click now!",
  "good_headline": "7 Data-Backed Email Strategies That Boosted Our Open Rate by 45%",
  "bad_headline": "Revolutionary Email Secrets The Gurus Don't Want You To Know!"
}
```

### 8. **Review Controls**
- `review_required`: Boolean - Require manual approval before publishing
- `min_quality_score`: Number (0-1) - Minimum AI quality score to pass

---

## 📝 How Quality Control Works

### During Generation

1. **System Prompt Enhancement**: Quality instructions added to AI prompt
   ```
   BRAND VOICE: Professional yet approachable, innovative
   
   KEY PHRASES TO INCLUDE: proven strategies, data-backed results
   
   FORBIDDEN PHRASES (never use): click here, buy now, guaranteed
   
   STYLE GUIDE:
   - Use active voice
   - Keep paragraphs under 4 sentences
   - Include examples
   ```

2. **Required Elements Enforced**: Specific structure requirements included in prompt

3. **Examples Provided**: Good/bad examples shown to guide generation

### After Generation

1. **Automated Checks**:
   - ✅ Scan for forbidden phrases
   - ✅ Verify word count within range
   - ✅ Calculate quality score
   - ✅ Log any quality issues

2. **Quality Scoring**:
   - No issues: 0.8 score
   - With issues: 0.6 score
   - Issues logged in `strategy_context`

3. **Review Queue**:
   - If `review_required = true`: Content goes to review
   - If `quality_score < min_quality_score`: Flagged for review
   - Auto-approve if passes all checks

---

## 🚀 Setting Up Quality Controls

### Via Dashboard

1. **Go to** `/dashboard/agents`
2. **Click** "Create Agent"
3. **Fill basic info** (name, department, output type, etc.)
4. **Click** "Quality Control & Brand Guidelines" to expand
5. **Configure**:
   - Style Guide (text area)
   - Key Phrases (comma-separated)
   - Forbidden Phrases (comma-separated)
   - Min Quality Score (0-1)
   - Review Required (checkbox)

### Via API

```javascript
POST /api/agents
{
  "name": "Premium Blog Writer",
  "department": "content",
  "output_type": "blog_post",
  "brand_guidelines": {
    "brand_voice": "Expert, trustworthy, actionable",
    "brand_values": ["quality", "expertise"],
    "do_use": ["proven strategies", "data-backed"],
    "dont_use": ["cheap", "guaranteed"]
  },
  "quality_standards": {
    "min_word_count": 800,
    "max_word_count": 1200,
    "must_include_examples": true
  },
  "required_elements": {
    "headline": "Number + benefit + keyword",
    "introduction": "Hook + problem + solution",
    "body": "3+ sections with examples"
  },
  "key_phrases": ["proven strategies", "actionable insights"],
  "forbidden_phrases": ["click here", "buy now"],
  "style_guide": "Use active voice. Keep paragraphs under 4 sentences.",
  "review_required": true,
  "min_quality_score": 0.85
}
```

---

## 💡 Real-World Examples

### Example 1: Marketing Blog Writer
**Goal**: High-quality, SEO-optimized blog posts that sound professional but approachable

```javascript
{
  brand_guidelines: {
    brand_voice: "Professional yet approachable, data-driven, helpful",
    brand_values: ["transparency", "quality", "customer-first"],
    do_use: ["proven strategies", "research shows", "data indicates", "real-world examples"],
    dont_use: ["revolutionary", "secret", "guaranteed", "cheap"]
  },
  quality_standards: {
    min_word_count: 800,
    max_word_count: 1500,
    must_include_examples: true,
    must_include_statistics: true
  },
  key_phrases: [
    "proven strategies",
    "data-backed approach",
    "actionable insights",
    "step-by-step"
  ],
  forbidden_phrases: [
    "click here",
    "buy now",
    "limited time only",
    "secret trick"
  ],
  style_guide: `
    - Use active voice exclusively
    - Address reader as "you"
    - Paragraphs: 2-4 sentences max
    - Include 1 stat per section
    - Bold key takeaways
    - End with clear next steps
  `,
  min_quality_score: 0.80,
  review_required: false
}
```

### Example 2: Technical Documentation
**Goal**: Clear, accurate, developer-friendly docs

```javascript
{
  brand_guidelines: {
    brand_voice: "Clear, precise, helpful, technical but accessible",
    do_use: ["for example", "step-by-step", "best practice", "recommended"],
    dont_use: ["obviously", "simply", "just", "easy"]
  },
  quality_standards: {
    min_word_count: 500,
    must_include_examples: true,
    include_code_examples: true
  },
  required_elements: {
    overview: "What it does and why",
    prerequisites: "What you need first",
    steps: "Numbered instructions",
    examples: "Working code samples",
    troubleshooting: "Common issues"
  },
  key_phrases: [
    "best practice",
    "recommended approach",
    "important note"
  ],
  forbidden_phrases: [
    "obviously",
    "simply",
    "just do this",
    "it's easy"
  ],
  style_guide: `
    - Be precise and technical
    - Explain jargon on first use
    - Include code examples
    - Number all steps
    - Use callouts for warnings
  `,
  min_quality_score: 0.85,
  review_required: true
}
```

### Example 3: Customer Support Content
**Goal**: Friendly, helpful, empathetic support articles

```javascript
{
  brand_guidelines: {
    brand_voice: "Friendly, helpful, empathetic, solution-focused",
    brand_values: ["customer-first", "clarity", "empathy"],
    do_use: ["we understand", "here's how", "happy to help", "let's solve this"],
    dont_use: ["user error", "you should have", "obviously", "can't"]
  },
  quality_standards: {
    min_word_count: 300,
    max_word_count: 800,
    must_include_actionable_steps: true
  },
  key_phrases: [
    "we're here to help",
    "step-by-step",
    "if you need more help",
    "happy to assist"
  ],
  forbidden_phrases: [
    "user error",
    "your fault",
    "should have known",
    "can't be done"
  ],
  style_guide: `
    - Start with empathy
    - Use "we" and "you"
    - Number all steps clearly
    - Include screenshots references
    - End with "still need help?" CTA
    - Positive, solution-focused tone
  `,
  min_quality_score: 0.75,
  review_required: false
}
```

---

## 🔍 Quality Checks Performed

### Automated Checks

1. **Forbidden Phrase Detection**
   - Scans content for banned phrases
   - Case-insensitive matching
   - Logs violations

2. **Word Count Validation**
   - Checks against min/max limits
   - Flags if outside range
   - Adjusts quality score

3. **Quality Score Calculation**
   - Base score: 0.8
   - Reduced if issues found
   - Compared against threshold

### Manual Review Process

When `review_required = true` or quality score too low:

1. Content saved with status: `pending`
2. Admin reviews in dashboard
3. Can approve, reject, or request revision
4. Revision notes stored for agent learning

---

## 📊 Review Statuses

| Status | Meaning |
|--------|---------|
| `pending` | Awaiting review |
| `approved` | Passed review, published |
| `rejected` | Did not meet standards |
| `needs_revision` | Requires changes |
| `auto_approved` | Passed all automated checks |

---

## 🎓 Best Practices

### 1. Start Simple, Iterate
```
Week 1: Just forbidden phrases
Week 2: Add key phrases
Week 3: Add style guide
Week 4: Add full quality standards
```

### 2. Use Specific, Clear Guidelines
❌ Bad: "Write good content"
✅ Good: "Include 1 statistic per section. Bold key takeaways. 2-4 sentences per paragraph."

### 3. Provide Examples
- Show good vs. bad examples
- Include actual headlines, intros
- Demonstrate desired style

### 4. Test and Refine
1. Generate test content
2. Review quality
3. Adjust guidelines
4. Test again

### 5. Balance Control vs. Creativity
- Too strict = robotic content
- Too loose = inconsistent quality
- Find your sweet spot

---

## 🔧 Advanced Configurations

### Multi-Brand Setup
Different brands, different voices:

```javascript
// Brand A: Professional
{
  brand_voice: "Professional, data-driven, authoritative",
  forbidden_phrases: ["cheap", "amazing", "revolutionary"]
}

// Brand B: Casual
{
  brand_voice: "Casual, friendly, conversational",
  forbidden_phrases: ["leverage", "synergy", "paradigm"]
}
```

### A/B Testing Quality Standards
Create two agents with different standards:

```javascript
// Agent A: Strict
{ min_quality_score: 0.9, review_required: true }

// Agent B: Balanced
{ min_quality_score: 0.75, review_required: false }

// Compare: quality vs. volume
```

### Progressive Quality Levels

```javascript
// Tier 1: Basic (social media)
{ min_quality_score: 0.70, simple_style_guide }

// Tier 2: Standard (blog posts)
{ min_quality_score: 0.80, detailed_style_guide }

// Tier 3: Premium (whitepapers)
{ min_quality_score: 0.90, comprehensive_guidelines, review_required: true }
```

---

## 📈 Measuring Quality

### Key Metrics

1. **Quality Score Trend**: Are scores improving?
2. **Review Rate**: How many need manual review?
3. **Approval Rate**: What % pass first time?
4. **Forbidden Phrase Violations**: Frequency?
5. **Word Count Compliance**: Within range?

### Dashboard Views

- Quality score over time
- Most common quality issues
- Approval/rejection reasons
- Agent performance comparison

---

## 🚦 Quality Control Workflow

```
1. Agent generates content
   ↓
2. Quality instructions embedded in prompt
   ↓
3. Content generated by AI
   ↓
4. Automated checks run
   ├─ Forbidden phrases?
   ├─ Word count OK?
   └─ Quality score calculated
   ↓
5. Decision point
   ├─ If review_required OR score < threshold
   │  └→ Send to review queue
   └─ If passed all checks
      └→ Auto-approve and publish
```

---

## 💪 What This Enables

✅ **Consistent Brand Voice** across all content
✅ **Prevent Bad Content** before it's published
✅ **Scale Quality** without sacrificing standards
✅ **Enforce Best Practices** automatically
✅ **Build Trust** with reliable, on-brand content
✅ **Reduce Manual Review** with smart automation
✅ **Maintain Control** while scaling production

---

## 🎯 Quick Start Checklist

- [ ] Define your brand voice
- [ ] List 5-10 key phrases to include
- [ ] List 5-10 forbidden phrases
- [ ] Write 3-5 style guidelines
- [ ] Set min quality score (start with 0.75)
- [ ] Create test agent
- [ ] Generate 3-5 test pieces
- [ ] Review and refine guidelines
- [ ] Deploy to production
- [ ] Monitor quality metrics

---

You now have enterprise-level quality control for your autonomous content generation! 🎉
