import { CheckCircle2, Lightbulb } from 'lucide-react'

interface ToolContextProps {
  toolName: string
  description: string
  keyFeatures: string[]
}

export function ToolContext({ toolName, description, keyFeatures }: ToolContextProps) {
  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-2">
      {/* Why Use Section */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Why use {toolName}?</h2>
        </div>
        <div className="prose prose-sm dark:prose-invert">
          <p className="text-gray-600 dark:text-gray-400">{description}</p>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {toolName} is designed to help users streamline their workflow and achieve better
            results with AI. Whether you're a professional or a hobbyist, this tool offers unique
            capabilities that set it apart in the {toolName} category.
          </p>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
        <div className="mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Key Features</h2>
        </div>
        <ul className="space-y-3">
          {keyFeatures && keyFeatures.length > 0 ? (
            keyFeatures.map((feature, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                {feature}
              </li>
            ))
          ) : (
            <li className="text-sm italic text-gray-500">No specific features listed yet.</li>
          )}
        </ul>
      </div>
    </div>
  )
}
