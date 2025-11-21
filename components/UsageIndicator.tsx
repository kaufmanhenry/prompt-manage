'use client'

import { AlertCircle, Check } from 'lucide-react'
import Link from 'next/link'

import { Progress } from '@/components/ui/progress'
import type { PlanType } from '@/lib/pricing'
import { PRICING_CONFIG } from '@/lib/pricing'

interface UsageIndicatorProps {
  plan: PlanType
  promptsUsed: number
  promptRunsUsed: number
  className?: string
}

export function UsageIndicator({
  plan,
  promptsUsed,
  promptRunsUsed,
  className = '',
}: UsageIndicatorProps) {
  const planConfig = PRICING_CONFIG[plan]

  // Calculate prompt storage usage
  const promptLimit =
    plan === 'free' ? planConfig.limits.maxPrompts : planConfig.limits.promptsPerMonth
  const promptUsagePercent =
    promptLimit === -1 ? 0 : Math.min((promptsUsed / promptLimit) * 100, 100)
  const promptsRemaining = promptLimit === -1 ? Infinity : Math.max(0, promptLimit - promptsUsed)

  // Calculate prompt runs usage
  const runLimit = planConfig.limits.promptRunsPerMonth
  const runUsagePercent = runLimit === -1 ? 0 : Math.min((promptRunsUsed / runLimit) * 100, 100)
  const runsRemaining = runLimit === -1 ? Infinity : Math.max(0, runLimit - promptRunsUsed)

  // Determine warning level
  const getWarningLevel = (percent: number) => {
    if (percent >= 100) return 'critical'
    if (percent >= 90) return 'danger'
    if (percent >= 80) return 'warning'
    return 'normal'
  }

  const promptWarning = getWarningLevel(promptUsagePercent)
  const runWarning = getWarningLevel(runUsagePercent)

  const getColorClass = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-500'
      case 'danger':
        return 'bg-orange-500'
      case 'warning':
        return 'bg-amber-500'
      default:
        return 'bg-emerald-500'
    }
  }

  const getTextColorClass = (level: string) => {
    switch (level) {
      case 'critical':
        return 'text-red-600 dark:text-red-400'
      case 'danger':
        return 'text-orange-600 dark:text-orange-400'
      case 'warning':
        return 'text-amber-600 dark:text-amber-400'
      default:
        return 'text-emerald-600 dark:text-emerald-400'
    }
  }

  return (
    <div className={`rounded-lg border border-border/50 bg-card p-4 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-foreground">Usage This Month</h3>
          <p className="text-xs text-foreground/60">{planConfig.name} Plan</p>
        </div>
        {(promptWarning === 'warning' ||
          promptWarning === 'danger' ||
          promptWarning === 'critical' ||
          runWarning === 'warning' ||
          runWarning === 'danger' ||
          runWarning === 'critical') && (
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        )}
      </div>

      {/* Prompt Storage Usage */}
      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs font-medium text-foreground/80">
            {plan === 'free' ? 'Prompts Stored' : 'Prompts Created'}
          </span>
          <span className={`text-xs font-medium ${getTextColorClass(promptWarning)}`}>
            {promptLimit === -1 ? (
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3" />
                Unlimited
              </span>
            ) : (
              `${promptsUsed} / ${promptLimit}`
            )}
          </span>
        </div>
        {promptLimit !== -1 && (
          <>
            <Progress
              value={promptUsagePercent}
              className="h-2"
              indicatorClassName={getColorClass(promptWarning)}
            />
            <p className="mt-1 text-xs text-foreground/60">
              {promptsRemaining === 0 ? (
                <span className="font-medium text-red-600 dark:text-red-400">
                  Limit reached. Upgrade to create more.
                </span>
              ) : (
                `${promptsRemaining} remaining`
              )}
            </p>
          </>
        )}
      </div>

      {/* Prompt Runs Usage */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs font-medium text-foreground/80">Prompt Runs</span>
          <span className={`text-xs font-medium ${getTextColorClass(runWarning)}`}>
            {runLimit === -1 ? (
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3" />
                Unlimited
              </span>
            ) : (
              `${promptRunsUsed} / ${runLimit}`
            )}
          </span>
        </div>
        {runLimit !== -1 && (
          <>
            <Progress
              value={runUsagePercent}
              className="h-2"
              indicatorClassName={getColorClass(runWarning)}
            />
            <p className="mt-1 text-xs text-foreground/60">
              {runsRemaining === 0 ? (
                <span className="font-medium text-red-600 dark:text-red-400">
                  Limit reached. Upgrade to run more.
                </span>
              ) : (
                `${runsRemaining} remaining`
              )}
            </p>
          </>
        )}
      </div>

      {/* Upgrade CTA */}
      {plan === 'free' && (promptWarning !== 'normal' || runWarning !== 'normal') && (
        <div className="mt-4 border-t border-border/30 pt-4">
          <Link
            href="/pricing"
            className="block rounded-md bg-emerald-600 px-3 py-2 text-center text-xs font-medium text-white transition-colors hover:bg-emerald-700"
          >
            Upgrade for Unlimited
          </Link>
        </div>
      )}
    </div>
  )
}
