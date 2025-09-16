# Derivative Prompts Feature

This feature allows users to copy public prompts into their personal collection while maintaining a link to the original prompt.

## Overview

When a user finds a useful public prompt, they can now copy it to their personal collection with a single click. The copied prompt maintains a reference to the original, showing that it's a derivative work.

## Features

### 🔗 Copy to Personal Collection

- **One-click copying**: Users can copy any public prompt to their personal collection
- **Automatic naming**: Copied prompts get "(Copy)" appended to the name
- **Private by default**: All copied prompts are private and can be customized
- **Duplicate prevention**: Users can only copy a prompt once

### 📊 Derivative Tracking

- **Parent-child relationship**: Each copied prompt links back to the original
- **Visual indicators**: Clear indication when a prompt is a derivative
- **Usage statistics**: Public prompts show how many times they've been copied

### 🎨 User Interface

- **Copy button**: Prominent "Copy to My Prompts" button on public prompt pages
- **Derivative badges**: Visual indicators in the dashboard for derivative prompts
- **Statistics display**: Shows derivative count on public prompt pages

## Database Schema

### New Fields

- `parent_prompt_id`: UUID reference to the original prompt (nullable)
- Indexes for efficient querying of derivative relationships

### New Functions

- `copy_public_prompt()`: Copies a public prompt to a user's collection
- `get_derivative_prompts()`: Retrieves all derivatives of a given prompt

## API Endpoints

### POST /api/prompts/copy

Copies a public prompt to the authenticated user's collection.

**Request Body:**

```json
{
  "source_prompt_id": "uuid",
  "new_name": "optional-custom-name"
}
```

**Response:**

```json
{
  "message": "Prompt copied successfully",
  "prompt": {
    "id": "uuid",
    "name": "Original Name (Copy)",
    "parent_prompt_id": "original-prompt-uuid"
    // ... other prompt fields
  }
}
```

## Components

### CopyPromptButton

A reusable button component that handles copying prompts with loading states and success feedback.

### DerivativePrompts

Displays statistics about how many users have copied a public prompt.

## Migration Required

To enable this feature, run the following migration:

```sql
-- Run this in your Supabase SQL Editor
-- Migration file: supabase/migrations/20240321000000_add_derivative_prompts.sql
```

## Usage Flow

1. **Browse Public Prompts**: User visits a public prompt page
2. **Copy Prompt**: User clicks "Copy to My Prompts" button
3. **Confirmation**: Success message and redirect to dashboard
4. **Customization**: User can edit the copied prompt as needed
5. **Visual Feedback**: Derivative prompts show clear indicators

## Security

- Users can only copy prompts they have access to (public prompts)
- Copied prompts are always private by default
- Users can only copy a prompt once to prevent spam
- RLS policies ensure proper access control

## Future Enhancements

- **Fork tracking**: Show the full chain of derivatives
- **Collaboration**: Allow users to contribute back to original prompts
- **Analytics**: More detailed statistics about prompt usage
- **Notifications**: Alert original authors when their prompts are copied
