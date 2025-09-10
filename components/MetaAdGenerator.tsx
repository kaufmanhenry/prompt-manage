'use client';

import { AlertCircle, CheckCircle2, Copy, Download, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type GeneratedAd = {
  variant: number;
  primaryText: string;
  headline: string;
  description: string;
  cta: string;
};

const RECOMMENDED_LIMITS = {
  primaryText: 125,
  headline: 40,
  description: 30,
};

const TONES = ['Confident', 'Friendly', 'Direct', 'Playful', 'Urgent'];
const CTAS = ['Shop Now', 'Learn More', 'Sign Up', 'Get Offer', 'Subscribe'];
const ANGLES = ['Discount', 'Social Proof', 'Urgency', 'Benefits', 'Problem/Solution'];

function clampToLimit(text: string, limit: number): string {
  if (text.length <= limit) return text;
  // Prefer trimming at last space before limit
  const slice = text.slice(0, limit);
  const lastSpace = slice.lastIndexOf(' ');
  return (lastSpace > 0 ? slice.slice(0, lastSpace) : slice).trim();
}

function charBadge(text: string, limit: number) {
  const remaining = limit - text.length;
  const isOk = remaining >= 0;
  return (
    <span
      className={cn(
        'px-1.5 py-0.5 rounded text-[10px]',
        isOk ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
      )}
    >
      {isOk ? `${remaining} left` : `${Math.abs(remaining)} over`}
    </span>
  );
}

function toCsv(rows: GeneratedAd[]): string {
  const headers = ['Variant', 'Primary Text', 'Headline', 'Description', 'CTA'];
  const lines = [headers.join(',')];
  for (const r of rows) {
    const cells = [r.variant, r.primaryText, r.headline, r.description, r.cta].map(
      (v) => '"' + String(v).replace(/"/g, '""') + '"'
    );
    lines.push(cells.join(','));
  }
  return lines.join('\n');
}

function download(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function MetaAdGenerator() {
  const [offer, setOffer] = useState('Prompt Manage – organize, test, and share prompts');
  const [audience, setAudience] = useState('Performance marketers running Meta ads at scale');
  const [benefit, setBenefit] = useState(
    'Ship high-performing ads faster with consistent, on-brand copy'
  );
  const [tone, setTone] = useState<string>('Confident');
  const [angles, setAngles] = useState<string[]>(['Benefits', 'Urgency']);
  const [cta, setCta] = useState<string>('Learn More');
  const [variants, setVariants] = useState<number>(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [rows, setRows] = useState<GeneratedAd[]>([]);

  function toggleAngle(a: string) {
    setAngles((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  }

  function buildPrimaryText(_i: number) {
    const pieces: string[] = [];
    pieces.push(offer);
    if (angles.includes('Benefits')) pieces.push(benefit);
    if (angles.includes('Social Proof')) pieces.push('Teams like Acme trust us to scale creative');
    if (angles.includes('Discount')) pieces.push('Limited-time pricing for growth teams');
    if (angles.includes('Urgency')) pieces.push('Launch faster—stop waiting on copy');
    if (angles.includes('Problem/Solution'))
      pieces.push('Stop ad fatigue: keep variants fresh without the chaos');
    const base = pieces.join('. ');
    const toned = tone === 'Urgent' ? base + ' Now.' : base;
    return clampToLimit(toned, RECOMMENDED_LIMITS.primaryText);
  }

  function buildHeadline(_i: number) {
    const patterns = [
      `Scale ${audience.split(' ')[0] || 'Meta'} Results`,
      `Ship High-ROAS Ads Faster`,
      `Consistent On-Brand Copy, Every Time`,
      `End Ad Fatigue with Better Variants`,
      `Your Team’s Prompt Library`,
    ];
    const chosen = patterns[_i % patterns.length];
    return clampToLimit(chosen, RECOMMENDED_LIMITS.headline);
  }

  function buildDescription(i: number) {
    const patterns = [
      'Organize, test, and share prompts',
      'Version, compare, and ship faster',
      'Keep brand voice consistent',
      'Launch with confidence',
    ];
    const chosen = patterns[i % patterns.length];
    return clampToLimit(chosen, RECOMMENDED_LIMITS.description);
  }

  async function handleGenerate() {
    setIsGenerating(true);
    try {
      const next: GeneratedAd[] = [];
      const count = Math.min(variants || 1, 10);
      for (let i = 0; i < count; i++) {
        next.push({
          variant: i + 1,
          primaryText: buildPrimaryText(i),
          headline: buildHeadline(i),
          description: buildDescription(i),
          cta,
        });
      }
      setRows(next);
    } finally {
      setIsGenerating(false);
    }
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  }

  const allValid = useMemo(
    () =>
      rows.length > 0 &&
      rows.every(
        (r) =>
          r.primaryText.length <= RECOMMENDED_LIMITS.primaryText &&
          r.headline.length <= RECOMMENDED_LIMITS.headline &&
          r.description.length <= RECOMMENDED_LIMITS.description
      ),
    [rows]
  );

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-emerald-200/50 dark:border-emerald-900/40 bg-white dark:bg-gray-900 p-5 shadow-sm ring-1 ring-emerald-500/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            Meta Ad Generator{' '}
            <Badge variant="outline" className="ml-1">
              For marketers
            </Badge>
          </span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Results follow Meta’s recommended limits
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-600 dark:text-gray-300">Offer</label>
          <Input
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            placeholder="Product/offer the ad is about"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600 dark:text-gray-300">Audience</label>
          <Input
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="Who is this for?"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600 dark:text-gray-300">Key Benefit</label>
          <Textarea
            value={benefit}
            onChange={(e) => setBenefit(e.target.value)}
            className="min-h-[60px]"
            placeholder="What outcome do they get?"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="text-xs text-gray-600 dark:text-gray-300">Tone</label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Tone" />
              </SelectTrigger>
              <SelectContent>
                {TONES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-600 dark:text-gray-300">CTA</label>
            <Select value={cta} onValueChange={setCta}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="CTA" />
              </SelectTrigger>
              <SelectContent>
                {CTAS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-[90px]">
            <label className="text-xs text-gray-600 dark:text-gray-300">Variants</label>
            <Input
              type="number"
              className="h-8"
              value={variants}
              min={1}
              max={10}
              onChange={(e) => setVariants(Number(e.target.value || 1))}
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-600 dark:text-gray-300 mb-1 block">Angles</label>
          <div className="flex flex-wrap gap-2">
            {ANGLES.map((a) => (
              <Button
                key={a}
                size="sm"
                variant={angles.includes(a) ? 'default' : 'outline'}
                onClick={() => toggleAngle(a)}
              >
                {a}
              </Button>
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 -mx-5 px-5 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-t border-gray-200 dark:border-gray-800 flex items-center gap-2">
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}{' '}
            Generate
          </Button>
          <Button
            variant="outline"
            disabled={rows.length === 0}
            onClick={() => download('meta_ads.csv', toCsv(rows))}
          >
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <div className="ml-auto text-xs text-gray-600 dark:text-gray-300 flex items-center gap-2">
            <span>Primary ≤ {RECOMMENDED_LIMITS.primaryText}</span>
            <span>Headline ≤ {RECOMMENDED_LIMITS.headline}</span>
            <span>Description ≤ {RECOMMENDED_LIMITS.description}</span>
          </div>
        </div>

        <div className="space-y-2">
          {rows.length > 0 && (
            <div className="rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[11px]">Var</TableHead>
                    <TableHead className="text-[11px]">Primary Text</TableHead>
                    <TableHead className="text-[11px]">Headline</TableHead>
                    <TableHead className="text-[11px]">Description</TableHead>
                    <TableHead className="text-[11px]">CTA</TableHead>
                    <TableHead className="text-[11px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.variant}>
                      <TableCell className="text-[11px]">{r.variant}</TableCell>
                      <TableCell className="text-[11px] align-top">
                        <div className="flex items-start justify-between gap-2">
                          <div className="whitespace-pre-wrap">{r.primaryText}</div>
                          {charBadge(r.primaryText, RECOMMENDED_LIMITS.primaryText)}
                        </div>
                      </TableCell>
                      <TableCell className="text-[11px] align-top">
                        <div className="flex items-start justify-between gap-2">
                          <div>{r.headline}</div>
                          {charBadge(r.headline, RECOMMENDED_LIMITS.headline)}
                        </div>
                      </TableCell>
                      <TableCell className="text-[11px] align-top">
                        <div className="flex items-start justify-between gap-2">
                          <div>{r.description}</div>
                          {charBadge(r.description, RECOMMENDED_LIMITS.description)}
                        </div>
                      </TableCell>
                      <TableCell className="text-[11px]">{r.cta}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            copyText(`${r.primaryText}\n${r.headline}\n${r.description}\n${r.cta}`)
                          }
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {rows.length > 0 && (
            <div
              className={cn(
                'text-xs flex items-center gap-2',
                allValid ? 'text-emerald-600' : 'text-red-600'
              )}
            >
              {allValid ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> All within recommended limits
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4" /> Some variants exceed limits—edit or trim
                  before launching
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
