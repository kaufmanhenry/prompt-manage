# Prompt Collections

## Overview

Prompt Collections is a powerful feature that allows you to organize, store, and manage your AI prompts into curated collections. Whether you're creating themed collections for specific use cases, organizing prompts by AI model, or building a public showcase, Collections helps you structure your prompt library efficiently.

## Key Features

### Create Collections

- **Private Collections**: Organize prompts for your personal use or team collaboration
- **Public Collections**: Share curated collections with the community and get discovered
- **Custom Titles & Descriptions**: Add meaningful metadata to help others understand your collection
- **Cover Images**: Visualize your collection with custom cover images

### Organize Prompts

- **Multi-Select**: Add multiple prompts to a collection at once
- **Search & Filter**: Quickly find prompts to add to your collections
- **Drag & Drop**: Reorder prompts within collections (coming soon)
- **Smart Duplicates**: Collections prevent duplicate prompts automatically

### Discover Collections

- **Browse Public Collections**: Explore trending, popular, and newest collections
- **Search Collections**: Find collections by title, description, or tags
- **View Creator Profiles**: See who created each collection and explore their work
- **Engagement Stats**: See views, likes, and prompt counts for each collection

## Use Cases

### Personal Organization

Organize your prompts by:

- **Project**: Group prompts for specific projects or clients
- **AI Model**: Create collections for ChatGPT, Claude, Gemini, etc.
- **Use Case**: Marketing prompts, coding prompts, creative writing, etc.
- **Topic**: Research prompts, business prompts, educational content, etc.

### Team Collaboration

- **Team Collections**: Share collections with team members for collaborative prompt development
- **Version Control**: Keep track of prompt iterations within collections
- **Best Practices**: Create collections of approved prompts for your organization

### Public Sharing

- **Showcase Work**: Build public collections to showcase your prompt engineering skills
- **Community Contribution**: Share valuable collections that help others discover new prompts
- **SEO Benefits**: Public collections are indexed and searchable, helping you build your profile

## Getting Started

### Creating a Collection

1. Navigate to **Dashboard → Collections**
2. Click **"New Collection"**
3. Enter a title (required)
4. Add a description (optional but recommended)
5. Set visibility:
   - **Private**: Only visible to you
   - **Public**: Visible to everyone and indexed for SEO
6. Optionally add a cover image URL
7. Click **"Save Collection"**

### Adding Prompts to Collections

#### From the Dashboard

1. Go to **Dashboard → Collections**
2. Click **"Add Prompts"** on any collection
3. Search or browse your prompts
4. Select prompts using checkboxes
5. Click **"Add Selected"** to add multiple prompts at once

#### From Prompt Pages

1. On any prompt page or card, click **"Add to Collection"**
2. Choose an existing collection or **"Create New Collection"**
3. If creating new, fill in the form and click **"Create & Add Prompt"**

### Publishing Collections

1. In **Dashboard → Collections**, find your collection
2. Click **"Publish"** (or **"Unpublish"** to make it private)
3. Confirm the action
4. Your collection is now live at `/collections/[slug]`

### Viewing Public Collections

- **Browse**: Visit `/collections` to see trending, popular, and newest collections
- **Search**: Use the search bar to find specific collections
- **Filter**: Sort by trending, popular, newest, or views
- **Share**: Copy links, share on social media, or embed collections

## Best Practices

### Naming Collections

- Use descriptive, specific titles
- Include keywords that others might search for
- Keep titles concise but informative

### Writing Descriptions

- Clearly explain what the collection contains
- Mention the AI models or use cases covered
- Include examples of what prompts are included

### Organizing Prompts

- Group related prompts together
- Aim for 5-20 prompts per collection for optimal engagement
- Update collections regularly with new prompts

### SEO Optimization

- Use descriptive titles and descriptions
- Add relevant tags
- Include cover images for visual appeal
- Share your collections on social media

## Advanced Features

### Collection Analytics

Track your collection performance:

- **Views**: How many times your collection has been viewed
- **Likes**: Community engagement with your collection
- **Prompt Count**: Number of prompts in the collection

### Public Profile Integration

Collections appear on your public profile (`/u/[username]`):

- Showcase your best work
- Build your reputation as a prompt engineer
- Attract followers and engagement

### Copying Collections

- Copy entire collections to create variations
- Use as templates for new collections
- Share collections within teams

## API Integration

Collections are fully integrated with the Prompt Manage API:

```typescript
// Get user's collections
GET /api/collections

// Create a collection
POST /api/collections
{
  title: "My Collection",
  description: "Collection description",
  visibility: "public" | "private"
}

// Add prompt to collection
POST /api/collections/[id]/prompts
{
  prompt_id: "prompt-uuid"
}
```

## Technical Details

### Database Schema

Collections are stored in the `prompt_collections` table with:

- Unique slugs for SEO-friendly URLs
- Visibility settings (private/public)
- Analytics fields (views, likes)
- Metadata (title, description, cover image)

### Security

- Private collections are only visible to the creator
- Public collections are visible to everyone
- RLS (Row Level Security) ensures proper access control

### Performance

- Collections are cached and revalidated every 5 minutes
- Optimized queries for trending/popular/newest sorting
- Efficient pagination for large collections

## FAQ

### Can I change a collection from private to public?

Yes! Go to **Dashboard → Collections**, click **"Publish"** on any private collection to make it public.

### How many prompts can I add to a collection?

There's no hard limit, but we recommend 5-20 prompts per collection for the best user experience.

### Can I delete a collection?

Yes, but this will remove all prompts from the collection. Prompts themselves are not deleted.

### Can I reorder prompts in a collection?

Currently, prompts maintain their original order. Drag-and-drop reordering is coming soon.

### Do collections help with SEO?

Yes! Public collections are fully indexed by search engines. Use descriptive titles, descriptions, and tags to maximize SEO benefits.

## Related Features

- [Prompt Management](./prompt-editing.md)
- [Public Profile](/docs/features/public-profiles.md)
- [Team Collaboration](/docs/teams/README.md)

## Support

For questions or issues with Collections, visit our [Support Center](/support) or check our [Documentation](/docs).
