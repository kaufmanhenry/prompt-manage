import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limit'

// Initialize OpenAI client only when needed
function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured')
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

interface PromptAnalysis {
  score: number
  suggestions: string[]
  strengths: string[]
  improvements: string[]
  optimizedPrompt?: string
  // Advanced analysis
  sentiment: 'positive' | 'neutral' | 'negative'
  complexity: 'simple' | 'moderate' | 'complex'
  specificity: number
  clarity: number
  contextScore: number
  formatScore: number
  examplesScore: number
  audienceScore: number
  actionWords: string[]
  vagueWords: string[]
  missingElements: string[]
  templateSuggestions: string[]
  abTestVariations?: string[]
}

function analyzePromptStructure(prompt: string): PromptAnalysis {
  const analysis: PromptAnalysis = {
    score: 0,
    suggestions: [],
    strengths: [],
    improvements: [],
    sentiment: 'neutral',
    complexity: 'moderate',
    specificity: 0,
    clarity: 0,
    contextScore: 0,
    formatScore: 0,
    examplesScore: 0,
    audienceScore: 0,
    actionWords: [],
    vagueWords: [],
    missingElements: [],
    templateSuggestions: []
  }

  // Length analysis
  if (prompt.length < 50) {
    analysis.score -= 20
    analysis.improvements.push('Prompt is too short - add more context and specificity')
  } else if (prompt.length > 2000) {
    analysis.score -= 10
    analysis.improvements.push('Prompt is very long - consider breaking into smaller, focused parts')
  } else if (prompt.length > 100) {
    analysis.score += 10
    analysis.strengths.push('Good length - provides sufficient context')
  }

  // Optimized Action Words Analysis - using smaller, more focused patterns
  const actionWords = [
    'create', 'generate', 'write', 'build', 'develop', 'design', 'implement', 'analyze', 'explain',
    'describe', 'define', 'evaluate', 'assess', 'review', 'improve', 'optimize', 'enhance', 'refine',
    'provide', 'give', 'offer', 'present', 'show', 'demonstrate', 'illustrate', 'clarify', 'specify',
    'identify', 'recognize', 'determine', 'establish', 'configure', 'customize', 'adapt', 'modify',
    'adjust', 'complete', 'finish', 'conclude', 'emphasize', 'highlight', 'focus', 'target', 'aim',
    'guide', 'lead', 'help', 'assist', 'support', 'recommend', 'suggest', 'advise', 'teach', 'instruct',
    'inform', 'notify', 'alert', 'warn', 'start', 'begin', 'launch', 'introduce', 'reveal', 'discover',
    'find', 'search', 'investigate', 'explore', 'examine', 'study', 'research', 'measure', 'calculate',
    'process', 'handle', 'manage', 'control', 'monitor', 'track', 'organize', 'arrange', 'sort',
    'categorize', 'classify', 'group', 'compare', 'contrast', 'match', 'align', 'integrate', 'combine',
    'merge', 'connect', 'link', 'associate', 'relate', 'map', 'translate', 'convert', 'transform',
    'change', 'update', 'revise', 'edit', 'correct', 'fix', 'repair', 'restore', 'enhance', 'upgrade',
    'advance', 'progress', 'develop', 'grow', 'expand', 'scale', 'strengthen', 'reinforce', 'secure',
    'protect', 'defend', 'achieve', 'accomplish', 'attain', 'reach', 'succeed', 'overcome', 'master',
    'dominate', 'control', 'govern', 'lead', 'command', 'direct', 'navigate', 'operate', 'run',
    'administer', 'supervise', 'oversee', 'inspect', 'check', 'verify', 'validate', 'confirm',
    'approve', 'endorse', 'back', 'sponsor', 'fund', 'invest', 'contribute', 'donate', 'deliver',
    'distribute', 'share', 'spread', 'circulate', 'broadcast', 'announce', 'declare', 'state',
    'say', 'tell', 'speak', 'talk', 'discuss', 'debate', 'argue', 'negotiate', 'trade', 'exchange',
    'replace', 'alternate', 'rotate', 'repeat', 'return', 'revert', 'restore', 'recover', 'retrieve',
    'reclaim', 'regain', 'compensate', 'balance', 'equalize', 'level', 'smooth', 'straighten',
    'adjust', 'calibrate', 'tune', 'optimize', 'maximize', 'minimize', 'reduce', 'decrease',
    'lower', 'cut', 'trim', 'slice', 'chop', 'grind', 'crush', 'break', 'split', 'crack',
    'destroy', 'damage', 'harm', 'hurt', 'injure', 'wound', 'pierce', 'penetrate', 'drill',
    'dig', 'extract', 'remove', 'drain', 'empty', 'clear', 'clean', 'wash', 'rinse', 'scrub',
    'wipe', 'dust', 'sweep', 'polish', 'shine', 'smooth', 'soften', 'harden', 'strengthen',
    'toughen', 'reinforce', 'fortify', 'secure', 'fasten', 'attach', 'connect', 'join', 'link',
    'bind', 'tie', 'wrap', 'cover', 'hide', 'disguise', 'mask', 'blend', 'merge', 'fuse',
    'combine', 'mix', 'stir', 'shake', 'throw', 'launch', 'fire', 'shoot', 'aim', 'target',
    'focus', 'concentrate', 'center', 'position', 'place', 'put', 'set', 'lay', 'rest',
    'stand', 'sit', 'lie', 'hang', 'suspend', 'float', 'drift', 'flow', 'stream', 'pour',
    'spill', 'leak', 'drip', 'drop', 'fall', 'descend', 'sink', 'dive', 'plunge', 'dip',
    'bend', 'stoop', 'crouch', 'squat', 'kneel', 'crawl', 'creep', 'slide', 'glide', 'skim',
    'brush', 'graze', 'touch', 'contact', 'meet', 'encounter', 'face', 'confront', 'challenge',
    'dare', 'defy', 'resist', 'oppose', 'fight', 'battle', 'struggle', 'compete', 'contend',
    'rival', 'match', 'equal', 'parallel', 'mirror', 'reflect', 'echo', 'resonate', 'vibrate',
    'pulse', 'beat', 'throb', 'pound', 'hammer', 'strike', 'hit', 'slap', 'punch', 'kick',
    'push', 'pull', 'drag', 'haul', 'carry', 'lift', 'raise', 'elevate', 'boost', 'hoist',
    'heave'
  ]
  
  const actionWordsRegex = new RegExp(`\\b(${actionWords.join('|')})\\b`, 'gi')
  const foundActionWords = prompt.match(actionWordsRegex) || []
  analysis.actionWords = Array.from(new Set(foundActionWords.map(word => word.toLowerCase())))
  
  if (foundActionWords.length > 0) {
    analysis.score += Math.min(15, foundActionWords.length * 2)
    analysis.strengths.push(`Contains ${foundActionWords.length} action words`)
    analysis.specificity += foundActionWords.length * 10
  } else {
    analysis.score -= 15
    analysis.improvements.push('Add specific action words (write, create, analyze, etc.)')
    analysis.missingElements.push('Action words')
  }

  // Advanced Context Analysis
  const contextWords = /\b(context|background|situation|scenario|for|about|regarding|concerning|pertaining to|related to|in the context of|given that|considering|taking into account|with respect to|in terms of|from the perspective of|as a|being a|as someone who|if you are|assuming|suppose|imagine|picture|envision|visualize|think of|consider|regard|view|see|perceive|understand|know|realize|recognize|acknowledge|accept|admit|concede|grant|allow|permit|enable|facilitate|support|help|assist|aid|guide|direct|lead|steer|navigate|pilot|drive|operate|run|manage|administer|supervise|oversee|monitor|watch|observe|inspect|examine|check|verify|validate|confirm|approve|endorse|support|back|sponsor|fund|finance|invest|contribute|donate|give|provide|supply|deliver|distribute|share|spread|circulate|disseminate|broadcast|announce|declare|proclaim|state|say|tell|speak|talk|discuss|debate|argue|negotiate|bargain|deal|trade|exchange|swap|substitute|replace|substitute|alternate|rotate|cycle|repeat|recur|return|come back|go back|revert|restore|recover|retrieve|reclaim|regain|repossess|take back|get back|win back|earn back|make up for|compensate|offset|balance|equalize|level|even|smooth|flatten|straighten|align|adjust|calibrate|tune|fine-tune|optimize|maximize|minimize|reduce|decrease|lower|cut|trim|shave|slice|chop|dice|mince|grind|crush|smash|break|split|crack|fracture|shatter|destroy|demolish|ruin|damage|harm|hurt|injure|wound|cut|slash|stab|pierce|penetrate|puncture|drill|bore|dig|excavate|mine|extract|remove|take out|pull out|draw out|suck out|drain|empty|clear|clean|wash|rinse|scrub|brush|wipe|dust|sweep|mop|vacuum|polish|shine|buff|smooth|soften|harden|strengthen|toughen|reinforce|fortify|secure|fasten|attach|connect|join|link|bind|tie|knot|wrap|cover|conceal|hide|disguise|mask|camouflage|blend|merge|fuse|combine|mix|stir|shake|toss|throw|fling|hurl|launch|fire|shoot|aim|target|focus|concentrate|center|centralize|localize|position|place|put|set|lay|rest|stand|sit|lie|hang|suspend|float|drift|flow|stream|pour|spill|leak|drip|drop|fall|descend|sink|dive|plunge|dip|duck|bend|stoop|crouch|squat|kneel|crawl|creep|slither|slide|glide|skim|skim|brush|graze|touch|contact|meet|encounter|face|confront|challenge|dare|defy|resist|oppose|fight|battle|struggle|compete|contend|vie|rival|match|equal|parallel|mirror|reflect|echo|resonate|vibrate|pulse|beat|throb|pound|hammer|strike|hit|slap|punch|kick|push|pull|drag|haul|carry|lift|raise|elevate|boost|hoist|heave|toss|throw|fling|hurl|launch|fire|shoot|aim|target|focus|concentrate|center|centralize|localize|position|place|put|set|lay|rest|stand|sit|lie|hang|suspend|float|drift|flow|stream|pour|spill|leak|drip|drop|fall|descend|sink|dive|plunge|dip|duck|bend|stoop|crouch|squat|kneel|crawl|creep|slither|slide|glide|skim|skim|brush|graze|touch|contact|meet|encounter|face|confront|challenge|dare|defy|resist|oppose|fight|battle|struggle|compete|contend|vie|rival|match|equal|parallel|mirror|reflect|echo|resonate|vibrate|pulse|beat|throb|pound|hammer|strike|hit|slap|punch|kick|push|pull|drag|haul|carry|lift|raise|elevate|boost|hoist|heave)\b/gi
  const contextMatches = prompt.match(contextWords) || []
  analysis.contextScore = Math.min(100, contextMatches.length * 20)
  
  if (contextMatches.length > 0) {
    analysis.score += 10
    analysis.strengths.push('Provides context')
    analysis.clarity += 15
  } else {
    analysis.score -= 10
    analysis.improvements.push('Add context or background information')
    analysis.missingElements.push('Context')
  }

  // Format/Structure checks
  const hasFormatting = /\b(format|structure|style|tone|length|bullet|list|paragraph|section)\b/i.test(prompt)
  if (hasFormatting) {
    analysis.score += 10
    analysis.strengths.push('Specifies desired format or structure')
  } else {
    analysis.score -= 5
    analysis.improvements.push('Specify desired format or structure')
  }

  // Examples checks
  const hasExamples = /\b(example|for instance|such as|like|e\.g\.)\b/i.test(prompt)
  if (hasExamples) {
    analysis.score += 15
    analysis.strengths.push('Includes examples')
  } else {
    analysis.score -= 5
    analysis.improvements.push('Consider adding examples')
  }

  // Audience checks
  const hasAudience = /\b(audience|reader|user|for|target|intended)\b/i.test(prompt)
  if (hasAudience) {
    analysis.score += 10
    analysis.strengths.push('Specifies target audience')
  } else {
    analysis.score -= 5
    analysis.improvements.push('Specify your target audience')
  }

  // Clarity checks
  const questionMarks = (prompt.match(/\?/g) || []).length
  if (questionMarks > 3) {
    analysis.score -= 10
    analysis.improvements.push('Too many questions - focus on one main request')
  } else if (questionMarks === 1) {
    analysis.score += 5
    analysis.strengths.push('Clear single question')
  }

  // Optimized Vague Words Check - using smaller, more focused patterns
  const vagueWords = [
    'good', 'bad', 'better', 'nice', 'interesting', 'cool', 'amazing', 'great', 'awesome',
    'wonderful', 'fantastic', 'terrible', 'awful', 'horrible', 'excellent', 'perfect', 'best',
    'worst', 'okay', 'fine', 'decent', 'average', 'mediocre', 'so-so', 'meh', 'whatever',
    'stuff', 'things', 'items', 'objects', 'elements', 'pieces', 'parts', 'components',
    'aspects', 'factors', 'considerations', 'points', 'issues', 'problems', 'concerns',
    'matters', 'topics', 'subjects', 'areas', 'fields', 'domains', 'realms', 'spheres',
    'worlds', 'universes', 'environments', 'settings', 'contexts', 'situations',
    'circumstances', 'conditions', 'states', 'modes', 'phases', 'stages', 'levels',
    'degrees', 'extents', 'amounts', 'quantities', 'numbers', 'figures', 'statistics',
    'data', 'information', 'details', 'facts', 'truths', 'realities', 'possibilities',
    'opportunities', 'challenges', 'difficulties', 'obstacles', 'barriers', 'limitations',
    'restrictions', 'constraints', 'requirements', 'needs', 'wants', 'desires', 'goals',
    'objectives', 'aims', 'targets', 'purposes', 'intentions', 'motivations', 'reasons',
    'causes', 'effects', 'impacts', 'influences', 'consequences', 'results', 'outcomes',
    'outputs', 'products', 'deliverables', 'solutions', 'answers', 'responses', 'replies',
    'feedback', 'input', 'output', 'process', 'procedure', 'method', 'approach', 'strategy',
    'technique', 'tactic', 'tool', 'resource', 'asset', 'advantage', 'benefit', 'value',
    'worth', 'importance', 'significance', 'relevance', 'applicability', 'usefulness',
    'effectiveness', 'efficiency', 'quality', 'standard', 'criterion', 'measure', 'metric',
    'indicator', 'signal', 'sign', 'mark', 'trace', 'evidence', 'proof', 'confirmation',
    'validation', 'verification', 'authentication', 'authorization', 'approval', 'endorsement',
    'support', 'backing', 'sponsorship', 'funding', 'investment', 'contribution', 'donation',
    'gift', 'present', 'offering', 'provision', 'supply', 'delivery', 'distribution', 'sharing',
    'circulation', 'dissemination', 'broadcasting', 'announcement', 'declaration', 'proclamation',
    'statement', 'saying', 'telling', 'speaking', 'talking', 'discussing', 'debating', 'arguing',
    'negotiating', 'bargaining', 'dealing', 'trading', 'exchanging', 'swapping', 'substituting',
    'replacing', 'alternating', 'rotating', 'cycling', 'repeating', 'recurring', 'returning',
    'coming back', 'going back', 'reverting', 'restoring', 'recovering', 'retrieving',
    'reclaiming', 'regaining', 'repossessing', 'taking back', 'getting back', 'winning back',
    'earning back', 'making up for', 'compensating', 'offsetting', 'balancing', 'equalizing',
    'leveling', 'evening', 'smoothing', 'flattening', 'straightening', 'aligning', 'adjusting',
    'calibrating', 'tuning', 'fine-tuning', 'optimizing', 'maximizing', 'minimizing', 'reducing',
    'decreasing', 'lowering', 'cutting', 'trimming', 'shaving', 'slicing', 'chopping', 'dicing',
    'mincing', 'grinding', 'crushing', 'smashing', 'breaking', 'splitting', 'cracking',
    'fracturing', 'shattering', 'destroying', 'demolishing', 'ruining', 'damaging', 'harming',
    'hurting', 'injuring', 'wounding', 'cutting', 'slashing', 'stabbing', 'piercing',
    'penetrating', 'puncturing', 'drilling', 'boring', 'digging', 'excavating', 'mining',
    'extracting', 'removing', 'taking out', 'pulling out', 'drawing out', 'sucking out',
    'draining', 'emptying', 'clearing', 'cleaning', 'washing', 'rinsing', 'scrubbing',
    'brushing', 'wiping', 'dusting', 'sweeping', 'mopping', 'vacuuming', 'polishing',
    'shining', 'buffing', 'smoothing', 'softening', 'hardening', 'strengthening', 'toughening',
    'reinforcing', 'fortifying', 'securing', 'fastening', 'attaching', 'connecting', 'joining',
    'linking', 'binding', 'tying', 'knotting', 'wrapping', 'covering', 'concealing', 'hiding',
    'disguising', 'masking', 'camouflaging', 'blending', 'merging', 'fusing', 'combining',
    'mixing', 'stirring', 'shaking', 'tossing', 'throwing', 'flinging', 'hurling', 'launching',
    'firing', 'shooting', 'aiming', 'targeting', 'focusing', 'concentrating', 'centering',
    'centralizing', 'localizing', 'positioning', 'placing', 'putting', 'setting', 'laying',
    'resting', 'standing', 'sitting', 'lying', 'hanging', 'suspending', 'floating', 'drifting',
    'flowing', 'streaming', 'pouring', 'spilling', 'leaking', 'dripping', 'dropping', 'falling',
    'descending', 'sinking', 'diving', 'plunging', 'dipping', 'ducking', 'bending', 'stooping',
    'crouching', 'squatting', 'kneeling', 'crawling', 'creeping', 'slithering', 'sliding',
    'gliding', 'skimming', 'brushing', 'grazing', 'touching', 'contacting', 'meeting',
    'encountering', 'facing', 'confronting', 'challenging', 'daring', 'defying', 'resisting',
    'opposing', 'fighting', 'battling', 'struggling', 'competing', 'contending', 'vying',
    'rivaling', 'matching', 'equaling', 'paralleling', 'mirroring', 'reflecting', 'echoing',
    'resonating', 'vibrating', 'pulsing', 'beating', 'throbbing', 'pounding', 'hammering',
    'striking', 'hitting', 'slapping', 'punching', 'kicking', 'pushing', 'pulling', 'dragging',
    'hauling', 'carrying', 'lifting', 'raising', 'elevating', 'boosting', 'hoisting', 'heaving',
    'tossing', 'throwing', 'flinging', 'hurling', 'launching', 'firing', 'shooting', 'aiming',
    'targeting', 'focusing', 'concentrating', 'centering', 'centralizing', 'localizing',
    'positioning', 'placing', 'putting', 'setting', 'laying', 'resting', 'standing', 'sitting',
    'lying', 'hanging', 'suspending', 'floating', 'drifting', 'flowing', 'streaming', 'pouring',
    'spilling', 'leaking', 'dripping', 'dropping', 'falling', 'descending', 'sinking', 'diving',
    'plunging', 'dipping', 'ducking', 'bending', 'stooping', 'crouching', 'squatting', 'kneeling',
    'crawling', 'creeping', 'slithering', 'sliding', 'gliding', 'skimming', 'brushing', 'grazing',
    'touching', 'contacting', 'meeting', 'encountering', 'facing', 'confronting', 'challenging',
    'daring', 'defying', 'resisting', 'opposing', 'fighting', 'battling', 'struggling', 'competing',
    'contending', 'vying', 'rivaling', 'matching', 'equaling', 'paralleling', 'mirroring',
    'reflecting', 'echoing', 'resonating', 'vibrating', 'pulsing', 'beating', 'throbbing',
    'pounding', 'hammering', 'striking', 'hitting', 'slapping', 'punching', 'kicking', 'pushing',
    'pulling', 'dragging', 'hauling', 'carrying', 'lifting', 'raising', 'elevating', 'boosting',
    'hoisting', 'heaving'
  ]
  
  const vagueWordsRegex = new RegExp(`\\b(${vagueWords.join('|')})\\b`, 'gi')
  const foundVagueWords = prompt.match(vagueWordsRegex) || []
  analysis.vagueWords = Array.from(new Set(foundVagueWords.map(word => word.toLowerCase())))
  
  if (foundVagueWords.length > 0) {
    analysis.score -= Math.min(20, foundVagueWords.length * 3)
    analysis.improvements.push(`Replace vague words: ${foundVagueWords.slice(0, 3).join(', ')}`)
    analysis.clarity -= foundVagueWords.length * 5
  }

  // Template suggestions based on prompt content
  const templates = []
  if (prompt.toLowerCase().includes('write') || prompt.toLowerCase().includes('create')) {
    templates.push('Content Creation Template', 'Blog Post Template', 'Article Template')
  }
  if (prompt.toLowerCase().includes('analyze') || prompt.toLowerCase().includes('review')) {
    templates.push('Analysis Template', 'Review Template', 'Evaluation Template')
  }
  if (prompt.toLowerCase().includes('email') || prompt.toLowerCase().includes('message')) {
    templates.push('Email Template', 'Communication Template')
  }
  if (prompt.toLowerCase().includes('code') || prompt.toLowerCase().includes('programming')) {
    templates.push('Code Generation Template', 'Programming Template')
  }
  analysis.templateSuggestions = templates.slice(0, 3)

  // Sentiment analysis
  const positiveWords = /\b(good|great|excellent|amazing|wonderful|fantastic|awesome|perfect|best|outstanding|superb|brilliant|exceptional|remarkable|impressive|incredible|marvelous|splendid|magnificent|fabulous|terrific|super|top|premium|quality|professional|expert|skilled|talented|gifted|creative|innovative|cutting-edge|advanced|sophisticated|elegant|beautiful|attractive|appealing|engaging|compelling|persuasive|convincing|powerful|effective|efficient|productive|successful|profitable|valuable|beneficial|helpful|useful|practical|convenient|easy|simple|clear|obvious|straightforward|direct|focused|organized|structured|systematic|methodical|logical|rational|reasonable|sensible|wise|smart|intelligent|clever|sharp|quick|fast|rapid|swift|immediate|instant|urgent|important|critical|essential|vital|necessary|required|mandatory|compulsory|obligatory|expected|anticipated|desired|wanted|needed|demanded|requested|suggested|recommended|advised|counseled|guided|directed|led|managed|controlled|handled|processed|executed|performed|accomplished|achieved|attained|reached|obtained|gained|earned|won|succeeded|triumphed|prevailed|overcame|defeated|beat|conquered|mastered|dominated|ruled|governed|commanded|directed|guided|steered|navigated|piloted|drove|operated|ran|managed|administered|supervised|oversaw|monitored|watched|observed|inspected|examined|checked|verified|validated|confirmed|approved|endorsed|supported|backed|sponsored|funded|financed|invested|contributed|donated|gave|provided|supplied|delivered|distributed|shared|spread|circulated|disseminated|broadcast|announced|declared|proclaimed|stated|said|told|spoke|talked|discussed|debated|argued|negotiated|bargained|dealt|traded|exchanged|swapped|substituted|replaced|alternated|rotated|cycled|repeated|recurred|returned|came back|went back|reverted|restored|recovered|retrieved|reclaimed|regained|repossessed|took back|got back|won back|earned back|made up for|compensated|offset|balanced|equalized|leveled|evened|smoothed|flattened|straightened|aligned|adjusted|calibrated|tuned|fine-tuned|optimized|maximized|minimized|reduced|decreased|lowered|cut|trimmed|shaved|sliced|chopped|diced|minced|ground|crushed|smashed|broke|split|cracked|fractured|shattered|destroyed|demolished|ruined|damaged|harmed|hurt|injured|wounded|cut|slashed|stabbed|pierced|penetrated|punctured|drilled|bored|dug|excavated|mined|extracted|removed|took out|pulled out|drew out|sucked out|drained|emptied|cleared|cleaned|washed|rinsed|scrubbed|brushed|wiped|dusted|swept|mopped|vacuumed|polished|shined|buffed|smoothed|softened|hardened|strengthened|toughened|reinforced|fortified|secured|fastened|attached|connected|joined|linked|bound|tied|knotted|wrapped|covered|concealed|hid|disguised|masked|camouflaged|blended|merged|fused|combined|mixed|stirred|shook|tossed|threw|flung|hurled|launched|fired|shot|aimed|targeted|focused|concentrated|centered|centralized|localized|positioned|placed|put|set|laid|rested|stood|sat|lay|hung|suspended|floated|drifted|flowed|streamed|poured|spilled|leaked|dripped|dropped|fell|descended|sank|dove|plunged|dipped|ducked|bent|stooped|crouched|squatted|knelt|crawled|crept|slithered|slid|glided|skimmed|brushed|grazed|touched|contacted|met|encountered|faced|confronted|challenged|dared|defied|resisted|opposed|fought|battled|struggled|competed|contended|vied|rivaled|matched|equaled|paralleled|mirrored|reflected|echoed|resonated|vibrated|pulsed|beat|throbbed|pounded|hammered|struck|hit|slapped|punched|kicked|pushed|pulled|dragged|hauled|carried|lifted|raised|elevated|boosted|hoisted|heaved|tossed|threw|flung|hurled|launched|fired|shot|aimed|targeted|focused|concentrated|centered|centralized|localized|positioned|placed|put|set|laid|rested|stood|sat|lay|hung|suspended|floated|drifted|flowed|streamed|poured|spilled|leaked|dripped|dropped|fell|descended|sank|dove|plunged|dipped|ducked|bent|stooped|crouched|squatted|knelt|crawled|crept|slithered|slid|glided|skimmed|brushed|grazed|touched|contacted|met|encountered|faced|confronted|challenged|dared|defied|resisted|opposed|fought|battled|struggled|competed|contended|vied|rivaled|matched|equaled|paralleled|mirrored|reflected|echoed|resonated|vibrated|pulsed|beat|throbbed|pounded|hammered|struck|hit|slapped|punched|kicked|pushed|pulled|dragged|hauled|carried|lifted|raised|elevated|boosted|hoisted|heaved)\b/gi
  const negativeWords = /\b(bad|terrible|awful|horrible|worst|poor|mediocre|disappointing|frustrating|annoying|irritating|boring|dull|uninteresting|useless|pointless|meaningless|confusing|unclear|vague|ambiguous|contradictory|inconsistent|unreliable|untrustworthy|suspicious|doubtful|questionable|problematic|troublesome|difficult|hard|challenging|complex|complicated|confusing|overwhelming|stressful|anxious|worried|concerned|fearful|scared|afraid|nervous|tense|stressed|frustrated|angry|mad|upset|disappointed|discouraged|demotivated|unmotivated|lazy|slow|inefficient|ineffective|unproductive|unsuccessful|failed|broken|damaged|defective|flawed|imperfect|incomplete|insufficient|inadequate|limited|restricted|constrained|blocked|prevented|stopped|halted|delayed|postponed|cancelled|abandoned|rejected|denied|refused|ignored|overlooked|missed|lost|wasted|squandered|ruined|destroyed|demolished|broken|shattered|cracked|fractured|split|torn|ripped|cut|slashed|stabbed|pierced|penetrated|punctured|drilled|bored|dug|excavated|mined|extracted|removed|took out|pulled out|drew out|sucked out|drained|emptied|cleared|cleaned|washed|rinsed|scrubbed|brushed|wiped|dusted|swept|mopped|vacuumed|polished|shined|buffed|smoothed|softened|hardened|strengthened|toughened|reinforced|fortified|secured|fastened|attached|connected|joined|linked|bound|tied|knotted|wrapped|covered|concealed|hid|disguised|masked|camouflaged|blended|merged|fused|combined|mixed|stirred|shook|tossed|threw|flung|hurled|launched|fired|shot|aimed|targeted|focused|concentrated|centered|centralized|localized|positioned|placed|put|set|laid|rested|stood|sat|lay|hung|suspended|floated|drifted|flowed|streamed|poured|spilled|leaked|dripped|dropped|fell|descended|sank|dove|plunged|dipped|ducked|bent|stooped|crouched|squatted|knelt|crawled|crept|slithered|slid|glided|skimmed|brushed|grazed|touched|contacted|met|encountered|faced|confronted|challenged|dared|defied|resisted|opposed|fought|battled|struggled|competed|contended|vied|rivaled|matched|equaled|paralleled|mirrored|reflected|echoed|resonated|vibrated|pulsed|beat|throbbed|pounded|hammered|struck|hit|slapped|punched|kicked|pushed|pulled|dragged|hauled|carried|lifted|raised|elevated|boosted|hoisted|heaved|tossed|threw|flung|hurled|launched|fired|shot|aimed|targeted|focused|concentrated|centered|centralized|localized|positioned|placed|put|set|laid|rested|stood|sat|lay|hung|suspended|floated|drifted|flowed|streamed|poured|spilled|leaked|dripped|dropped|fell|descended|sank|dove|plunged|dipped|ducked|bent|stooped|crouched|squatted|knelt|crawled|crept|slithered|slid|glided|skimmed|brushed|grazed|touched|contacted|met|encountered|faced|confronted|challenged|dared|defied|resisted|opposed|fought|battled|struggled|competed|contended|vied|rivaled|matched|equaled|paralleled|mirrored|reflected|echoed|resonated|vibrated|pulsed|beat|throbbed|pounded|hammered|struck|hit|slapped|punched|kicked|pushed|pulled|dragged|hauled|carried|lifted|raised|elevated|boosted|hoisted|heaved)\b/gi
  
  const positiveCount = (prompt.match(positiveWords) || []).length
  const negativeCount = (prompt.match(negativeWords) || []).length
  
  if (positiveCount > negativeCount) {
    analysis.sentiment = 'positive'
  } else if (negativeCount > positiveCount) {
    analysis.sentiment = 'negative'
  } else {
    analysis.sentiment = 'neutral'
  }

  // Complexity analysis
  const wordCount = prompt.split(/\s+/).length
  const avgWordLength = prompt.split(/\s+/).reduce((sum, word) => sum + word.length, 0) / wordCount
  
  if (wordCount < 20 && avgWordLength < 5) {
    analysis.complexity = 'simple'
  } else if (wordCount > 50 || avgWordLength > 7) {
    analysis.complexity = 'complex'
  } else {
    analysis.complexity = 'moderate'
  }

  // Calculate final scores
  analysis.specificity = Math.min(100, analysis.specificity + (foundActionWords.length * 10))
  analysis.clarity = Math.min(100, analysis.clarity + (contextMatches.length * 15) - (foundVagueWords.length * 5))

  // Ensure score is between 0-100
  analysis.score = Math.max(0, Math.min(100, analysis.score))

  return analysis
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimit = checkRateLimit(clientId)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again later.',
          resetTime: rateLimit.resetTime
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetTime.toString()
          }
        }
      )
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again later.' },
        { status: 503 }
      )
    }

    const { prompt, generateOptimized = false } = await request.json()

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Input validation
    if (prompt.length > 10000) {
      return NextResponse.json(
        { error: 'Prompt is too long. Please keep it under 10,000 characters.' },
        { status: 400 }
      )
    }

    // Basic structure analysis
    const structureAnalysis = analyzePromptStructure(prompt)

    let optimizedPrompt = ''
    let aiSuggestions: string[] = []

    if (generateOptimized) {
      try {
        // Add timeout handling
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

        const openai = getOpenAIClient()
        const optimizationResponse = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an expert prompt engineer. Analyze the given prompt and provide:
1. Specific suggestions for improvement
2. An optimized version of the prompt

Focus on:
- Clarity and specificity
- Context and background
- Desired format/output
- Examples when helpful
- Target audience
- Action words

Be constructive and practical in your suggestions.`
            },
            {
              role: 'user',
              content: `Analyze and optimize this prompt:\n\n"${prompt}"\n\nProvide specific suggestions and an improved version.`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        }, {
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        const aiResponse = optimizationResponse.choices[0]?.message?.content || ''
        
        // Extract suggestions and optimized prompt from AI response
        const lines = aiResponse.split('\n').filter(line => line.trim())
        aiSuggestions = lines.filter(line => 
          line.includes('•') || 
          line.includes('-') || 
          line.includes('1.') || 
          line.includes('2.') || 
          line.includes('3.')
        ).slice(0, 5) // Limit to 5 suggestions

        // Try to extract optimized prompt (look for "Optimized prompt:" or similar)
        const optimizedMatch = aiResponse.match(/(?:optimized prompt|improved version|better prompt):\s*(.+)/i)
        if (optimizedMatch) {
          optimizedPrompt = optimizedMatch[1].trim()
        } else {
          // Fallback: use the last substantial paragraph
          const paragraphs = aiResponse.split('\n\n').filter(p => p.trim().length > 50)
          if (paragraphs.length > 0) {
            optimizedPrompt = paragraphs[paragraphs.length - 1].trim()
          }
        }
      } catch (aiError) {
        console.error('AI optimization error:', aiError)
        // Continue with structure analysis only
      }
    }

    const response: PromptAnalysis = {
      score: structureAnalysis.score || 0,
      suggestions: [
        ...(structureAnalysis.improvements || []),
        ...aiSuggestions
      ].slice(0, 8), // Limit total suggestions
      strengths: structureAnalysis.strengths || [],
      improvements: structureAnalysis.improvements || [],
      ...(optimizedPrompt && { optimizedPrompt }),
      sentiment: structureAnalysis.sentiment || 'neutral',
      complexity: structureAnalysis.complexity || 'moderate',
      specificity: structureAnalysis.specificity || 0,
      clarity: structureAnalysis.clarity || 0,
      contextScore: structureAnalysis.contextScore || 0,
      formatScore: structureAnalysis.formatScore || 0,
      examplesScore: structureAnalysis.examplesScore || 0,
      audienceScore: structureAnalysis.audienceScore || 0,
      actionWords: structureAnalysis.actionWords || [],
      vagueWords: structureAnalysis.vagueWords || [],
      missingElements: structureAnalysis.missingElements || [],
      templateSuggestions: structureAnalysis.templateSuggestions || []
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Prompt optimization error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze prompt' },
      { status: 500 }
    )
  }
}
