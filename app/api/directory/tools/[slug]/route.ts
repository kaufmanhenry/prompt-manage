import { createServerSideClient } from '@/utils/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = createServerSideClient()

    const { data: tool, error } = await supabase
      .from('ai_tools')
      .select(
        `
        id,
        name,
        slug,
        website_url,
        description,
        full_description,
        logo_url,
        banner_image_url,
        company_name,
        company_website,
        contact_email,
        primary_category_id,
        tool_categories(name),
        pricing_model,
        monthly_price,
        annual_price,
        pricing_details_url,
        has_free_trial,
        trial_duration_days,
        key_features,
        use_cases,
        integrations,
        platforms,
        ai_models_used,
        api_available,
        rating,
        review_count,
        favorite_count,
        view_count,
        upvote_count,
        is_open_source,
        github_url,
        founded_year,
        created_at,
        is_verified,
        is_featured
      `
      )
      .eq('slug', params.slug)
      .eq('status', 'approved')
      .single()

    if (error || !tool) {
      return Response.json(
        { error: 'Tool not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await supabase
      .from('ai_tools')
      .update({ view_count: (tool.view_count || 0) + 1 })
      .eq('id', tool.id)

    // Format response
    const formattedTool = {
      ...tool,
      category_name: tool.tool_categories?.name || 'Uncategorized',
      tool_categories: undefined,
    }

    return Response.json(formattedTool)
  } catch (error: unknown) {
    console.error('Error fetching tool:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tool'
    return Response.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
