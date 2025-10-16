'use client'

import { AlertTriangle, X,XCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { BudgetWarningProps } from '@/lib/types/token-tracking'

/**
 * BudgetWarning Component
 * 
 * Displays alert banner when budget thresholds are reached.
 * Three severity levels: info (75%), warning (90%), critical (100%+).
 * Provides actions: view details, increase budget, dismiss.
 * 
 * @example
 * ```tsx
 * <BudgetWarning
 *   currentUsage={22.80}
 *   budgetLimit={30.00}
 *   level="warning"
 *   onDismiss={() => setAlert(null)}
 *   onViewDetails={() => router.push('/dashboard/usage')}
 *   onIncreaseBudget={() => openBudgetSettings()}
 * />
 * ```
 */
export function BudgetWarning({
  currentUsage,
  budgetLimit,
  level,
  onDismiss,
  onViewDetails,
  onIncreaseBudget,
}: BudgetWarningProps) {
  const percentage = (currentUsage / budgetLimit) * 100

  const styles = {
    info: {
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      borderColor: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-900 dark:text-blue-100',
      icon: <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      title: 'Budget Alert',
    },
    warning: {
      bgColor: 'bg-amber-50 dark:bg-amber-950',
      borderColor: 'border-amber-200 dark:border-amber-800',
      textColor: 'text-amber-900 dark:text-amber-100',
      icon: <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
      title: 'Budget Warning',
    },
    critical: {
      bgColor: 'bg-red-50 dark:bg-red-950',
      borderColor: 'border-red-200 dark:border-red-800',
      textColor: 'text-red-900 dark:text-red-100',
      icon: <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />,
      title: 'Budget Exceeded',
    },
  }

  const style = styles[level]

  return (
    <Card className={`${style.bgColor} ${style.borderColor} p-4`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        {style.icon}

        {/* Content */}
        <div className="flex-1">
          {/* Title */}
          <div className={`mb-1 text-sm font-semibold ${style.textColor}`}>{style.title}</div>

          {/* Message */}
          <div className="mb-3 text-sm text-gray-700 dark:text-gray-300">
            {level === 'critical' ? (
              <>
                Monthly budget exceeded: ${currentUsage.toFixed(2)} / ${budgetLimit.toFixed(2)}
                <br />
                <span className="text-xs">Further executions may be limited.</span>
              </>
            ) : (
              `You've used ${percentage.toFixed(0)}% of your monthly budget ($${currentUsage.toFixed(2)} / $${budgetLimit.toFixed(2)})`
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onViewDetails}>
              View Details
            </Button>
            {level === 'critical' && onIncreaseBudget && (
              <Button size="sm" onClick={onIncreaseBudget}>
                Increase Budget
              </Button>
            )}
          </div>
        </div>

        {/* Dismiss button */}
        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </Card>
  )
}

