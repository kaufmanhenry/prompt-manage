import { PromptsTable } from '@/components/PromptsTable'
import { CommandPalette } from '@/components/CommandPalette'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Prompts</h1>
        <CommandPalette />
      </div>
      <PromptsTable />
    </div>
  )
} 