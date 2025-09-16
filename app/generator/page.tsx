'use client'
import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { supportedModels } from '@/lib/models'

export default function GeneratorPage() {
  const [title, setTitle] = useState('')
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState('gpt-4')
  const [tone, setTone] = useState('neutral')

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">Prompt Generator</h1>
      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-800 dark:bg-gray-900">
        <Input
          placeholder="Prompt Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-2 text-lg font-semibold"
        />
        <Textarea
          placeholder="Write your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="mb-2 h-40 text-base"
        />
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Model</label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {supportedModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Tone</label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button className="mt-4">Generate Prompt</Button>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-2 text-lg font-semibold">Preset Templates</h2>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            (Coming soon: Choose from a library of prompt templates.)
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-2 text-lg font-semibold">
            Prompt Ideas & Suggestions
          </h2>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            (Coming soon: Get AI-powered suggestions and inspiration.)
          </div>
        </div>
      </div>
    </div>
  )
}
