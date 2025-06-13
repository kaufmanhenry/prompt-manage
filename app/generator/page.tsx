import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function GeneratorPage() {
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('gpt-4');
  const [tone, setTone] = useState('neutral');

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-8">
      <h1 className="text-2xl font-bold mb-2">Prompt Generator</h1>
      <div className="space-y-4 bg-white dark:bg-gray-900 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-800">
        <Input
          placeholder="Prompt Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="text-lg font-semibold mb-2"
        />
        <Textarea
          placeholder="Write your prompt here..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          className="h-40 text-base mb-2"
        />
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium mb-1">Model</label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tone</label>
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
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-2">Preset Templates</h2>
          <div className="text-sm text-gray-700 dark:text-gray-300">(Coming soon: Choose from a library of prompt templates.)</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-2">Prompt Ideas & Suggestions</h2>
          <div className="text-sm text-gray-700 dark:text-gray-300">(Coming soon: Get AI-powered suggestions and inspiration.)</div>
        </div>
      </div>
    </div>
  );
} 