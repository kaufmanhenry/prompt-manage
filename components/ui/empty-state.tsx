import { Search } from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  actions?: React.ReactNode[]
}

export function EmptyState({ icon, title, description, actions }: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-12 text-center dark:border-gray-800 dark:bg-gray-900">
      {icon && <div className="mb-4 text-gray-400 dark:text-gray-600">{icon}</div>}
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-gray-600 dark:text-gray-400">{description}</p>
      {actions && actions.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3">
          {actions.map((action, i) => (
            <div key={i}>{action}</div>
          ))}
        </div>
      )}
    </div>
  )
}

// Preset empty states
export function NoResultsFound({
  onClearFilters,
  onShowPopular,
}: {
  onClearFilters?: () => void
  onShowPopular?: () => void
}) {
  return (
    <EmptyState
      icon={<Search className="h-12 w-12" />}
      title="No tools found"
      description="Try adjusting your filters or search for something else"
      actions={[
        onClearFilters && (
          <button
            onClick={onClearFilters}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Clear Filters
          </button>
        ),
        onShowPopular && (
          <button
            onClick={onShowPopular}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Show Popular
          </button>
        ),
      ].filter(Boolean)}
    />
  )
}
