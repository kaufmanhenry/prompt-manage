# Model Categories Implementation Plan

## Problem Statement

Currently when users create Suno prompts, they're forced to select "GPT-5" or similar LLM models, which is inaccurate. We need to support different model types (Music, Video, Image, Voice, etc.) as first-class citizens.

## Solution Architecture

### 1. Database Schema Changes

**Add new fields to prompts table:**

```sql
ALTER TABLE public.prompts
ADD COLUMN IF NOT EXISTS model_category TEXT, -- 'LLM', 'Music', 'Video', 'Image', 'Voice', etc.
ADD COLUMN IF NOT EXISTS model_id TEXT;        -- Keep existing 'model' field for backward compatibility

-- Add index for filtering
CREATE INDEX IF NOT EXISTS prompts_model_category_idx ON public.prompts(model_category);
CREATE INDEX IF NOT EXISTS prompts_model_id_idx ON public.prompts(model_id);
```

### 2. Model Categories

We'll organize models by category:

- **LLM** (Language Models) - GPT, Claude, Gemini, Llama, etc.
- **Music** - Suno, Udio, Mubert, AIVA
- **Video** - Runway, Pika, Sora
- **Image** - DALL-E, Midjourney, Leonardo, Stable Diffusion
- **Voice** - ElevenLabs, PlayHT
- **Code** - GitHub Copilot, Cursor, etc.

### 3. Update lib/models.ts

Add category field and group by category:

- Add `category: 'LLM' | 'Music' | 'Video' | 'Image' | 'Voice' | 'Code'` to Model interface
- Group Suno, Udio under Music category
- Group Runway, Pika under Video category
- Group DALL-E, Midjourney under Image category

### 4. Update UI Components

**PromptForm.tsx:**

- Change from flat model list to categorized/grouped dropdown
- Show categories: LLMs, Music Models, Video Models, etc.
- Each category has its own section in the dropdown

**Public Directory:**

- Add category filtering
- Show model category badges
- Filter by model type

### 5. Migration Strategy

1. Add new columns (nullable initially)
2. Update schema validation
3. Update UI components
4. Data migration: Set category based on existing model values
5. Backward compatibility: Keep 'model' field for now

## Implementation Steps

1. ✅ Create migration file for database schema
2. ✅ Update lib/models.ts to add categories
3. ✅ Update prompt schema validation
4. ✅ Update PromptForm UI for categorized selection
5. ✅ Update public directory filtering
6. ✅ Test with Suno/Udio prompts
7. ✅ Data migration for existing prompts
