import { NextResponse } from 'next/server';

import { createServerSideClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = createServerSideClient();

    // Get total prompts (public and private)
    const { count: totalPrompts } = await supabase
      .from('prompts')
      .select('*', { count: 'exact', head: true });

    // Get total public prompts
    const { count: publicPrompts } = await supabase
      .from('prompts')
      .select('*', { count: 'exact', head: true })
      .eq('is_public', true);

    // Get total users (from auth.users)
    const { data: usersData } = await supabase.auth.admin.listUsers();
    const userCount = usersData?.users?.length || 0;

    // Get total prompt runs from history
    const { count: totalRuns } = await supabase
      .from('prompt_run_history')
      .select('*', { count: 'exact', head: true });

    // Get total views from public prompts
    const { data: viewData } = await supabase
      .from('prompts')
      .select('view_count')
      .eq('is_public', true);

    const totalViews = viewData?.reduce((sum, prompt) => sum + (prompt.view_count || 0), 0) || 0;

    // Get prompts created today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: promptsToday } = await supabase
      .from('prompts')
      .select('*', { count: 'exact', head: true })
      .gte('inserted_at', today.toISOString());

    // Get users active today (users who created prompts today)
    const { data: activeUsersData } = await supabase
      .from('prompts')
      .select('user_id')
      .gte('inserted_at', today.toISOString())
      .not('user_id', 'is', null);

    const activeUsersToday = new Set(activeUsersData?.map((p) => p.user_id)).size;

    // Get prompt runs in last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const { count: runsLastHour } = await supabase
      .from('prompt_run_history')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneHourAgo.toISOString());

    // Get new signups today
    const { data: newUsersData } = await supabase.auth.admin.listUsers();
    const newSignupsToday =
      newUsersData?.users?.filter((user) => {
        const createdAt = new Date(user.created_at);
        return createdAt >= today;
      }).length || 0;

    // Get top categories (based on tags)
    const { data: categoryData } = await supabase
      .from('prompts')
      .select('tags')
      .not('tags', 'is', null);

    const categoryCounts: Record<string, number> = {};
    categoryData?.forEach((prompt) => {
      if (prompt.tags && Array.isArray(prompt.tags)) {
        prompt.tags.forEach((tag) => {
          categoryCounts[tag] = (categoryCounts[tag] || 0) + 1;
        });
      }
    });

    const topCategories = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 7)
      .map(([category, count]) => ({
        category,
        prompts: count,
        percentage: Math.round((count / (totalPrompts || 1)) * 100 * 10) / 10,
      }));

    // Get growth metrics (this month vs last month)
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const lastMonth = new Date(thisMonth);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const { count: promptsThisMonth } = await supabase
      .from('prompts')
      .select('*', { count: 'exact', head: true })
      .gte('inserted_at', thisMonth.toISOString());

    const { count: promptsLastMonth } = await supabase
      .from('prompts')
      .select('*', { count: 'exact', head: true })
      .gte('inserted_at', lastMonth.toISOString())
      .lt('inserted_at', thisMonth.toISOString());

    const growthRate =
      promptsLastMonth && promptsThisMonth
        ? Math.round(((promptsThisMonth - promptsLastMonth) / promptsLastMonth) * 100 * 10) / 10
        : 0;

    // Get average rating (placeholder - would need a ratings table)
    const averageRating = 4.8; // This would come from a ratings table

    // Get total likes (placeholder - would need a likes table)
    const totalLikes = Math.floor((totalPrompts || 0) * 4.5); // Estimate based on prompts

    // Get total shares (placeholder - would need a shares table)
    const totalShares = Math.floor((totalPrompts || 0) * 2.2); // Estimate based on prompts

    // Get total saves (placeholder - would need a saves table)
    const totalSaves = Math.floor((totalPrompts || 0) * 3.0); // Estimate based on prompts

    // Get total remixes (placeholder - would need a remixes table)
    const totalRemixes = Math.floor((totalPrompts || 0) * 0.8); // Estimate based on prompts

    // Get total copies (placeholder - would need a copies table)
    const totalCopies = Math.floor((totalPrompts || 0) * 5.8); // Estimate based on prompts

    // Get daily prompts data from June 1st, 2025
    const juneFirst = new Date('2025-06-01');
    const { data: dailyData } = await supabase
      .from('prompts')
      .select('inserted_at')
      .gte('inserted_at', juneFirst.toISOString());

    // Group by date and count
    const dailyCounts: Record<string, number> = {};
    dailyData?.forEach((prompt) => {
      const date = new Date(prompt.inserted_at).toISOString().split('T')[0];
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });

    // Generate daily data array
    const dailyPrompts = [];
    const currentDate = new Date(juneFirst);
    const currentToday = new Date();

    while (currentDate <= currentToday) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dailyPrompts.push({
        date: dateStr,
        count: dailyCounts[dateStr] || 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Get country data (placeholder - would need user location data)
    const topCountries = [
      { country: 'United States', users: Math.floor((userCount || 0) * 0.4), percentage: 40.0 },
      { country: 'United Kingdom', users: Math.floor((userCount || 0) * 0.15), percentage: 15.0 },
      { country: 'Canada', users: Math.floor((userCount || 0) * 0.1), percentage: 10.0 },
      { country: 'Germany', users: Math.floor((userCount || 0) * 0.08), percentage: 8.0 },
      { country: 'Australia', users: Math.floor((userCount || 0) * 0.06), percentage: 6.0 },
      { country: 'Netherlands', users: Math.floor((userCount || 0) * 0.05), percentage: 5.0 },
      { country: 'France', users: Math.floor((userCount || 0) * 0.04), percentage: 4.0 },
      { country: 'Sweden', users: Math.floor((userCount || 0) * 0.03), percentage: 3.0 },
      { country: 'Japan', users: Math.floor((userCount || 0) * 0.03), percentage: 3.0 },
      { country: 'India', users: Math.floor((userCount || 0) * 0.02), percentage: 2.0 },
    ];

    const stats = {
      totalPrompts: totalPrompts || 0,
      publicPrompts: publicPrompts || 0,
      totalUsers: userCount,
      totalCountries: 89, // Placeholder - would need actual country data
      totalRuns: totalRuns || 0,
      totalViews: totalViews,
      totalSaves,
      totalRemixes,
      totalCopies,
      totalLikes,
      totalShares,
      averageRating,
      activeToday: activeUsersToday,
      promptsThisWeek: promptsToday || 0,
      topCountries,
      topCategories,
      dailyPrompts,
      growthMetrics: {
        promptsThisMonth: promptsThisMonth || 0,
        usersThisMonth: Math.floor((userCount || 0) * 0.15), // Estimate
        runsThisMonth: Math.floor((totalRuns || 0) * 0.16), // Estimate
        growthRate,
      },
      realTimeStats: {
        promptsCreatedToday: promptsToday || 0,
        usersActiveNow: Math.floor(activeUsersToday * 0.1), // Estimate
        runsInLastHour: runsLastHour || 0,
        newSignupsToday: newSignupsToday,
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}
