import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';

const LEGAL_DIR = path.join(process.cwd(), 'legal');

export async function generateStaticParams() {
  const files = fs.readdirSync(LEGAL_DIR);
  return files.filter(f => f.endsWith('.md')).map(f => ({ slug: f.replace(/\.md$/, '') }));
}

export default async function LegalDocPage({ params }: { params: { slug: string } }) {
  const filePath = path.join(LEGAL_DIR, `${params.slug}.md`);
  if (!fs.existsSync(filePath)) return notFound();
  const file = fs.readFileSync(filePath, 'utf8');
  const { content } = matter(file);

  // Extract last updated from markdown if present
  const lastUpdatedMatch = content.match(/_Last updated: ([^_]+)_/);
  const lastUpdated = lastUpdatedMatch ? lastUpdatedMatch[1].trim() : null;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 md:flex gap-8">
      <aside className="hidden md:block w-64 shrink-0">
        <ScrollArea className="h-[calc(100vh-8rem)] pr-2">
          <nav className="space-y-2 text-sm">
            <Link href="/legal/legal-index" className="block font-semibold mb-2">Legal Overview</Link>
            <ul className="space-y-1">
              {fs.readdirSync(LEGAL_DIR).filter(f => f.endsWith('.md')).map(f => (
                <li key={f}>
                  <Link href={`/legal/${f.replace(/\.md$/, '')}`} className="hover:underline text-blue-700 dark:text-blue-300">
                    {f.replace(/-/g, ' ').replace(/\.md$/, '').replace(/\b\w/g, l => l.toUpperCase())}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </ScrollArea>
      </aside>
      <main className="flex-1 min-w-0">
        <h1 className="mb-4 text-2xl font-bold">{params.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h1>
        {lastUpdated && <p className="mb-2 text-xs text-gray-500">Last updated: {lastUpdated}</p>}
        <article className="prose prose-blue dark:prose-invert max-w-none">
          <MDXRemote source={content} />
        </article>
        <div className="mt-8">
          <Link href="/legal/legal-index" className="text-blue-700 dark:text-blue-300 underline">← Back to Legal Overview</Link>
        </div>
      </main>
    </div>
  )
}