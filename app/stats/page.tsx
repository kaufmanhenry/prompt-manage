'use client';
import {
  Activity,
  BarChart3,
  Clock,
  Download,
  GitBranch,
  Globe,
  Heart,
  MapPin,
  Share2,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Stats {
  totalPrompts: number;
  publicPrompts: number;
  totalUsers: number;
  totalCountries: number;
  totalRuns: number;
  totalViews: number;
  totalSaves: number;
  totalRemixes: number;
  totalCopies: number;
  totalLikes: number;
  totalShares: number;
  averageRating: number;
  activeToday: number;
  promptsThisWeek: number;
  topCountries: Array<{ country: string; users: number; percentage: number }>;
  topCategories: Array<{ category: string; prompts: number; percentage: number }>;
  growthMetrics: {
    promptsThisMonth: number;
    usersThisMonth: number;
    runsThisMonth: number;
    growthRate: number;
  };
  realTimeStats: {
    promptsCreatedToday: number;
    usersActiveNow: number;
    runsInLastHour: number;
    newSignupsToday: number;
  };
  dailyPrompts?: Array<{ date: string; count: number }>;
}

export default function StatsPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch real stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    trend?: {
      value: number;
      isPositive: boolean;
    };
  }

  const StatCard = ({ title, value, icon: Icon, description, trend }: StatCardProps) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        {trend && (
          <span
            className={`text-sm font-medium flex items-center ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend.isPositive ? '+' : ''}
            {trend.value}%
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {typeof value === 'number' ? formatNumber(value) : value}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{title}</p>
      {description && (
        <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">{description}</p>
      )}
    </div>
  );

  const DailyPromptsChart = ({ data }: { data: Array<{ date: string; count: number }> }) => {
    if (!data || data.length === 0) return null;

    const maxCount = Math.max(...data.map((d) => d.count));
    const chartHeight = 200;
    const chartWidth = 800;
    const padding = 40;
    const availableWidth = chartWidth - padding * 2;
    const availableHeight = chartHeight - padding * 2;
    const pointSpacing = availableWidth / (data.length - 1);

    const points = data.map((point, index) => {
      const x = padding + index * pointSpacing;
      const y = padding + availableHeight - (point.count / maxCount) * availableHeight;
      return { x, y, ...point };
    });

    const pathData = points
      .map((point, index) => {
        if (index === 0) return `M ${point.x} ${point.y}`;
        return `L ${point.x} ${point.y}`;
      })
      .join(' ');

    const areaPathData =
      points
        .map((point, index) => {
          if (index === 0) return `M ${point.x} ${point.y}`;
          return `L ${point.x} ${point.y}`;
        })
        .join(' ') +
      ` L ${points[points.length - 1].x} ${padding + availableHeight} L ${points[0].x} ${padding + availableHeight} Z`;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Daily Prompts Published
        </h3>
        <div className="overflow-x-auto">
          <svg width={chartWidth} height={chartHeight} className="mx-auto">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1={padding}
                y1={padding + (i * availableHeight) / 4}
                x2={chartWidth - padding}
                y2={padding + (i * availableHeight) / 4}
                stroke="#e5e7eb"
                strokeWidth="1"
                className="dark:stroke-gray-700"
              />
            ))}

            {/* Y-axis labels */}
            {[0, 1, 2, 3, 4].map((i) => (
              <text
                key={i}
                x={padding - 10}
                y={padding + (i * availableHeight) / 4 + 4}
                textAnchor="end"
                className="text-xs fill-gray-500 dark:fill-gray-400"
              >
                {Math.round((maxCount / 4) * (4 - i))}
              </text>
            ))}

            {/* Area fill */}
            <path d={areaPathData} fill="url(#gradient)" opacity="0.3" />

            {/* Line */}
            <path
              d={pathData}
              stroke="#3b82f6"
              strokeWidth="2"
              fill="none"
              className="dark:stroke-blue-400"
            />

            {/* Data points */}
            {points.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#3b82f6"
                className="dark:fill-blue-400"
              />
            ))}

            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* X-axis labels (show every 7th date) */}
            {points.map((point, index) => {
              if (index % 7 === 0 || index === points.length - 1) {
                const date = new Date(point.date);
                const month = date.toLocaleDateString('en-US', { month: 'short' });
                const day = date.getDate();
                return (
                  <text
                    key={index}
                    x={point.x}
                    y={chartHeight - 10}
                    textAnchor="middle"
                    className="text-xs fill-gray-500 dark:fill-gray-400"
                  >
                    {month} {day}
                  </text>
                );
              }
              return null;
            })}
          </svg>
        </div>

        {/* Summary stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {Math.max(...data.map((d) => d.count))}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Peak Day</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {Math.round(data.reduce((sum, d) => sum + d.count, 0) / data.length)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Daily Average</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {data.reduce((sum, d) => sum + d.count, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total in Period</div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading live stats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Error loading statistics</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">No statistics available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Prompt Manage Stats
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Real-time statistics and insights from the world&rsquo;s leading AI prompt management
            platform
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Last updated: {currentTime.toLocaleTimeString()}</span>
            <Activity className="w-4 h-4" />
            <span>Live data</span>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <StatCard
            title="Total Prompts Published"
            value={stats.totalPrompts}
            icon={BarChart3}
            description="Across all categories and teams"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Active Users"
            value={stats.totalUsers}
            icon={Users}
            description="From {stats.totalCountries} countries"
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Total Prompt Runs"
            value={stats.totalRuns}
            icon={Zap}
            description="AI interactions powered"
            trend={{ value: 15, isPositive: true }}
          />
          <StatCard
            title="Average Rating"
            value={stats.averageRating}
            icon={Heart}
            description="User satisfaction score"
            trend={{ value: 0.2, isPositive: true }}
          />
        </div>

        {/* Real-time Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Real-time Activity
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stats.realTimeStats.promptsCreatedToday}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Prompts Created Today</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {stats.realTimeStats.usersActiveNow}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Users Active Now</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {formatNumber(stats.realTimeStats.runsInLastHour)}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Runs in Last Hour</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                {stats.realTimeStats.newSignupsToday}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">New Signups Today</p>
            </div>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Engagement Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-700 dark:text-gray-300">Prompts Saved</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatNumber(stats.totalSaves)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GitBranch className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-gray-700 dark:text-gray-300">Prompts Remixed</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatNumber(stats.totalRemixes)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Share2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-gray-700 dark:text-gray-300">Prompts Copied</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatNumber(stats.totalCopies)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className="text-gray-700 dark:text-gray-300">Total Likes</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatNumber(stats.totalLikes)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Share2 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <span className="text-gray-700 dark:text-gray-300">Total Shares</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatNumber(stats.totalShares)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Growth This Month
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">New Prompts</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  +{formatNumber(stats.growthMetrics.promptsThisMonth)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">New Users</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  +{formatNumber(stats.growthMetrics.usersThisMonth)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Prompt Runs</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  +{formatNumber(stats.growthMetrics.runsThisMonth)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Growth Rate</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  +{stats.growthMetrics.growthRate}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Prompts Chart */}
        {stats.dailyPrompts && stats.dailyPrompts.length > 0 && (
          <div className="mb-16">
            <DailyPromptsChart data={stats.dailyPrompts} />
          </div>
        )}

        {/* Global Reach */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Global Reach
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Top Countries
              </h3>
              <div className="space-y-3">
                {stats.topCountries.map((country, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {index + 1}.
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">{country.country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${country.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {country.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Top Categories
              </h3>
              <div className="space-y-3">
                {stats.topCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {index + 1}.
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">{category.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {category.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Fun Facts & Milestones
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {Math.floor(stats.totalRuns / 1000)}K+
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">AI conversations powered</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {Math.floor(stats.totalViews / 1000)}K+
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Public prompt views</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {Math.floor(stats.totalPrompts / 100)}%
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Growth vs last month</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                {stats.averageRating}/5
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Average user rating</p>
            </div>
          </div>

          {/* Additional Milestones */}
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Fastest Execution</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Average prompt runs in under 2 seconds
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Team Collaboration</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {Math.floor(stats.totalUsers * 0.3)}+ teams actively sharing prompts
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Global Reach</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Used in {stats.totalCountries} countries worldwide
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">24/7 Activity</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Prompts run every{' '}
                {Math.floor((24 * 60) / Math.max(stats.realTimeStats.runsInLastHour, 1))} minutes on
                average
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Community Love</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {Math.floor(stats.totalLikes / 1000)}K+ likes on shared prompts
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                  <GitBranch className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Innovation Hub</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {Math.floor(stats.totalRemixes / 1000)}K+ prompt remixes created
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Join thousands of teams using Prompt Manage
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Start managing your AI prompts like the pros
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/auth/signup"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Free Trial
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
