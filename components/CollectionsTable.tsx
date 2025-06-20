'use client'

import { Button } from './ui/button'

export function CollectionsTable() {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Collections</h2>
        <Button>New Collection</Button>
      </div>
      <div className="text-center py-8">
        <p className="text-gray-500">You haven't created any collections yet.</p>
      </div>
    </div>
  )
} 