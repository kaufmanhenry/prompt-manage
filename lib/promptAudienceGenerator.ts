/**
 * Prompt Audience Generator
 *
 * Generates accurate, tag-based "Who is this for?" descriptions
 * for public prompt pages. Directly maps tags to specific audiences
 * to ensure accuracy.
 */

interface PromptContext {
  name: string
  description?: string | null
  tags?: string[]
  model?: string | null
  promptText?: string
}

interface AudienceDescription {
  primary: string // Main "Who is this for?" text
  secondary?: string // Optional additional context
  personas: string[] // Specific user types (for badges)
  keywords: string[] // SEO keywords to emphasize
}

/**
 * Tag-to-Audience Mapping
 * Each tag maps to specific user personas and descriptions
 */
const TAG_AUDIENCE_MAP: Record<
  string,
  {
    personas: string[]
    description: string
    secondary?: string
  }
> = {
  // Design & Creative
  design: {
    personas: ['UX/UI Designers', 'Graphic Designers', 'Product Designers'],
    description:
      'Perfect for designers looking to streamline their creative workflow and generate professional design assets',
  },
  ui: {
    personas: ['UX/UI Designers', 'Frontend Developers'],
    description: 'Built for UI designers and developers creating intuitive, user-friendly interfaces',
  },
  ux: {
    personas: ['UX/UI Designers', 'Product Managers'],
    description:
      'Ideal for UX professionals focused on user research, testing, and experience optimization',
  },
  figma: {
    personas: ['UX/UI Designers', 'Product Designers'],
    description:
      'Essential for Figma users streamlining their design process and collaboration workflows',
  },

  // Development & Coding
  coding: {
    personas: ['Software Developers', 'Engineers'],
    description: 'Designed for developers and engineers writing cleaner, more efficient code',
  },
  code: {
    personas: ['Software Developers', 'Programmers'],
    description: 'Perfect for programmers looking to improve code quality and development speed',
  },
  debugging: {
    personas: ['Software Developers', 'QA Engineers'],
    description: 'Built for developers debugging complex issues and improving code reliability',
  },
  api: {
    personas: ['Backend Developers', 'API Developers'],
    description: 'Ideal for developers building, documenting, and testing APIs',
  },

  // Marketing & Content
  marketing: {
    personas: ['Marketing Professionals', 'Growth Marketers'],
    description: 'Essential for marketers developing campaigns, strategies, and growth initiatives',
  },
  content: {
    personas: ['Content Creators', 'Content Marketers'],
    description: 'Perfect for content creators producing engaging, high-quality material at scale',
  },
  seo: {
    personas: ['SEO Specialists', 'Content Marketers'],
    description:
      'Built for SEO professionals optimizing content for search rankings and organic traffic',
  },
  copywriting: {
    personas: ['Copywriters', 'Marketing Professionals'],
    description: 'Ideal for copywriters crafting persuasive, conversion-focused copy',
  },
  'social media': {
    personas: ['Social Media Managers', 'Community Managers'],
    description:
      'Designed for social media professionals managing content and audience engagement',
  },

  // Business & Strategy
  business: {
    personas: ['Entrepreneurs', 'Business Owners'],
    description: 'Perfect for entrepreneurs and executives developing business strategies and plans',
  },
  strategy: {
    personas: ['Strategists', 'Consultants'],
    description:
      'Built for strategists and consultants creating frameworks and actionable recommendations',
  },
  analytics: {
    personas: ['Data Analysts', 'Business Analysts'],
    description: 'Essential for analysts extracting insights and making data-driven decisions',
  },

  // Sales & Communication
  sales: {
    personas: ['Sales Professionals', 'Account Executives'],
    description: 'Designed for sales teams crafting pitches, proposals, and closing deals',
  },
  email: {
    personas: ['Email Marketers', 'Sales Professionals'],
    description: 'Perfect for professionals writing effective, high-converting email communications',
  },

  // Product & Project Management
  product: {
    personas: ['Product Managers', 'Product Owners'],
    description: 'Built for product managers defining roadmaps, features, and user stories',
  },
  project: {
    personas: ['Project Managers', 'Team Leads'],
    description: 'Ideal for project managers organizing timelines, stakeholders, and deliverables',
  },

  // Writing & Creative
  writing: {
    personas: ['Writers', 'Content Creators'],
    description: 'Essential for writers creating compelling, well-structured content',
  },
  blog: {
    personas: ['Bloggers', 'Content Writers'],
    description: 'Perfect for bloggers publishing engaging, SEO-optimized articles',
  },

  // Support & Education
  education: {
    personas: ['Educators', 'Teachers'],
    description: 'Designed for educators creating lesson plans and learning materials',
  },
  support: {
    personas: ['Customer Support', 'Service Teams'],
    description: 'Built for support teams resolving issues and improving customer satisfaction',
  },

  // Development Tools & IDEs
  cursor: {
    personas: ['Software Developers', 'AI-Assisted Coders'],
    description: 'Perfect for developers using Cursor IDE and AI-powered coding assistants',
  },
  vscode: {
    personas: ['Software Developers', 'Programmers'],
    description: 'Built for VS Code users optimizing their development workflow',
  },

  // Creative Writing & Fiction
  romance: {
    personas: ['Romance Writers', 'Fiction Authors'],
    description: 'Designed for romance authors crafting compelling love stories and character relationships',
  },
  erotica: {
    personas: ['Erotica Writers', 'Adult Fiction Authors'],
    description: 'Built for writers creating adult-oriented fiction and romantic content',
  },
  fiction: {
    personas: ['Fiction Writers', 'Novelists'],
    description: 'Perfect for fiction authors developing stories, characters, and narratives',
  },
  'creative writing': {
    personas: ['Creative Writers', 'Authors'],
    description: 'Ideal for creative writers exploring storytelling, poetry, and literary expression',
  },
  novel: {
    personas: ['Novelists', 'Book Authors'],
    description: 'Essential for novelists planning, writing, and editing long-form fiction',
  },

  // Specialized Content
  poetry: {
    personas: ['Poets', 'Creative Writers'],
    description: 'Perfect for poets crafting verses, exploring themes, and experimenting with form',
  },
  screenplay: {
    personas: ['Screenwriters', 'Script Writers'],
    description: 'Built for screenwriters developing scripts for film, TV, and web series',
  },

  // Research & Academic
  research: {
    personas: ['Researchers', 'Academics'],
    description: 'Designed for researchers conducting studies, analyzing data, and publishing findings',
  },
  academic: {
    personas: ['Academics', 'Scholars'],
    description: 'Ideal for academics writing papers, proposals, and scholarly content',
  },

  // Specialized Business
  legal: {
    personas: ['Legal Professionals', 'Lawyers'],
    description: 'Built for legal professionals drafting documents, contracts, and legal communications',
  },
  healthcare: {
    personas: ['Healthcare Professionals', 'Medical Writers'],
    description: 'Perfect for healthcare professionals creating patient communications and medical content',
  },
  finance: {
    personas: ['Finance Professionals', 'Financial Analysts'],
    description: 'Designed for finance professionals analyzing markets, creating reports, and forecasting',
  },

  // E-commerce & Retail
  ecommerce: {
    personas: ['E-commerce Sellers', 'Online Retailers'],
    description: 'Essential for e-commerce sellers optimizing product listings and store content',
  },
  shopify: {
    personas: ['Shopify Store Owners', 'E-commerce Managers'],
    description: 'Perfect for Shopify merchants managing their online stores and product catalogs',
  },

  // Gaming & Entertainment
  gaming: {
    personas: ['Game Designers', 'Gaming Content Creators'],
    description: 'Built for gaming professionals creating content, guides, and game narratives',
  },
  twitch: {
    personas: ['Streamers', 'Content Creators'],
    description: 'Designed for Twitch streamers and content creators engaging their audience',
  },

  // Adult Content & Mature Writing
  sex: {
    personas: ['Adult Content Writers', 'Sex Educators'],
    description: 'Designed for adult content creators and sex educators producing mature, educational content',
  },
  nsfw: {
    personas: ['Adult Content Creators', 'Mature Content Writers'],
    description: 'Built for creators developing adult and mature-themed content',
  },
  'adult fiction': {
    personas: ['Adult Fiction Authors', 'Romance Writers'],
    description: 'Perfect for authors writing adult-oriented fiction and mature romantic content',
  },

  // Programming Languages
  python: {
    personas: ['Python Developers', 'Data Scientists'],
    description: 'Perfect for Python developers building applications, scripts, and data pipelines',
  },
  javascript: {
    personas: ['JavaScript Developers', 'Web Developers'],
    description: 'Built for JavaScript developers creating web applications and interactive experiences',
  },
  typescript: {
    personas: ['TypeScript Developers', 'Frontend Engineers'],
    description: 'Designed for TypeScript developers building type-safe applications',
  },
  react: {
    personas: ['React Developers', 'Frontend Engineers'],
    description: 'Essential for React developers building modern user interfaces',
  },
  nextjs: {
    personas: ['Next.js Developers', 'Full-Stack Engineers'],
    description: 'Perfect for Next.js developers building performant web applications',
  },
  'next.js': {
    personas: ['Next.js Developers', 'Full-Stack Engineers'],
    description: 'Perfect for Next.js developers building performant web applications',
  },
  vue: {
    personas: ['Vue.js Developers', 'Frontend Engineers'],
    description: 'Built for Vue.js developers creating reactive web applications',
  },
  angular: {
    personas: ['Angular Developers', 'Enterprise Developers'],
    description: 'Designed for Angular developers building enterprise-scale applications',
  },
  node: {
    personas: ['Node.js Developers', 'Backend Engineers'],
    description: 'Ideal for Node.js developers building server-side applications and APIs',
  },
  'node.js': {
    personas: ['Node.js Developers', 'Backend Engineers'],
    description: 'Ideal for Node.js developers building server-side applications and APIs',
  },
  golang: {
    personas: ['Go Developers', 'Backend Engineers'],
    description: 'Perfect for Go developers building high-performance backend systems',
  },
  go: {
    personas: ['Go Developers', 'System Programmers'],
    description: 'Built for Go developers creating efficient, concurrent applications',
  },
  rust: {
    personas: ['Rust Developers', 'Systems Programmers'],
    description: 'Designed for Rust developers building safe, high-performance systems',
  },
  java: {
    personas: ['Java Developers', 'Enterprise Engineers'],
    description: 'Essential for Java developers building enterprise applications',
  },
  'c++': {
    personas: ['C++ Developers', 'Systems Programmers'],
    description: 'Perfect for C++ developers working on performance-critical applications',
  },
  csharp: {
    personas: ['C# Developers', '.NET Engineers'],
    description: 'Built for C# developers creating .NET applications and services',
  },
  'c#': {
    personas: ['C# Developers', '.NET Engineers'],
    description: 'Built for C# developers creating .NET applications and services',
  },
  ruby: {
    personas: ['Ruby Developers', 'Web Developers'],
    description: 'Designed for Ruby developers building web applications with Rails and beyond',
  },
  php: {
    personas: ['PHP Developers', 'Web Developers'],
    description: 'Perfect for PHP developers creating dynamic web applications',
  },
  swift: {
    personas: ['iOS Developers', 'Swift Programmers'],
    description: 'Built for Swift developers creating iOS and macOS applications',
  },
  kotlin: {
    personas: ['Android Developers', 'Kotlin Programmers'],
    description: 'Ideal for Kotlin developers building Android applications',
  },
  sql: {
    personas: ['Database Developers', 'Data Analysts'],
    description: 'Essential for database professionals writing queries and managing data',
  },

  // Frameworks & Tools
  django: {
    personas: ['Django Developers', 'Python Web Developers'],
    description: 'Perfect for Django developers building web applications with Python',
  },
  flask: {
    personas: ['Flask Developers', 'Python Developers'],
    description: 'Built for Flask developers creating lightweight web applications',
  },
  laravel: {
    personas: ['Laravel Developers', 'PHP Web Developers'],
    description: 'Designed for Laravel developers building elegant web applications',
  },
  rails: {
    personas: ['Rails Developers', 'Ruby Web Developers'],
    description: 'Ideal for Rails developers creating web applications with Ruby',
  },
  express: {
    personas: ['Express.js Developers', 'Node.js Engineers'],
    description: 'Perfect for Express.js developers building web servers and APIs',
  },
  fastapi: {
    personas: ['FastAPI Developers', 'Python API Developers'],
    description: 'Built for FastAPI developers creating high-performance Python APIs',
  },
  tailwind: {
    personas: ['Frontend Developers', 'UI Developers'],
    description: 'Essential for developers using Tailwind CSS to style applications',
  },
  bootstrap: {
    personas: ['Web Developers', 'Frontend Designers'],
    description: 'Perfect for developers using Bootstrap to build responsive websites',
  },

  // Data & AI
  'machine learning': {
    personas: ['ML Engineers', 'Data Scientists'],
    description: 'Designed for machine learning engineers building and training models',
  },
  ml: {
    personas: ['ML Engineers', 'Data Scientists'],
    description: 'Built for ML engineers developing machine learning solutions',
  },
  ai: {
    personas: ['AI Engineers', 'Researchers'],
    description: 'Perfect for AI professionals developing intelligent systems and applications',
  },
  'data science': {
    personas: ['Data Scientists', 'Analysts'],
    description: 'Essential for data scientists analyzing data and building predictive models',
  },
  tensorflow: {
    personas: ['ML Engineers', 'Deep Learning Specialists'],
    description: 'Built for TensorFlow users building neural networks and ML models',
  },
  pytorch: {
    personas: ['ML Researchers', 'Deep Learning Engineers'],
    description: 'Designed for PyTorch developers creating deep learning models',
  },
  pandas: {
    personas: ['Data Analysts', 'Python Data Scientists'],
    description: 'Perfect for data professionals using Pandas for data analysis',
  },

  // Cloud & DevOps
  aws: {
    personas: ['Cloud Engineers', 'DevOps Professionals'],
    description: 'Essential for AWS engineers deploying and managing cloud infrastructure',
  },
  azure: {
    personas: ['Azure Engineers', 'Cloud Architects'],
    description: 'Built for Azure professionals building cloud solutions on Microsoft Azure',
  },
  gcp: {
    personas: ['GCP Engineers', 'Cloud Developers'],
    description: 'Designed for Google Cloud Platform engineers managing cloud services',
  },
  docker: {
    personas: ['DevOps Engineers', 'Container Specialists'],
    description: 'Perfect for DevOps professionals containerizing and deploying applications',
  },
  kubernetes: {
    personas: ['DevOps Engineers', 'Infrastructure Engineers'],
    description: 'Built for Kubernetes administrators orchestrating containerized applications',
  },
  terraform: {
    personas: ['Infrastructure Engineers', 'DevOps Professionals'],
    description: 'Essential for infrastructure engineers managing cloud infrastructure as code',
  },
  ansible: {
    personas: ['DevOps Engineers', 'System Administrators'],
    description: 'Designed for DevOps teams automating infrastructure and deployments',
  },
  jenkins: {
    personas: ['DevOps Engineers', 'CI/CD Specialists'],
    description: 'Perfect for DevOps professionals setting up continuous integration pipelines',
  },

  // Social Media Platforms
  youtube: {
    personas: ['YouTubers', 'Video Creators'],
    description: 'Built for YouTube creators producing and optimizing video content',
  },
  tiktok: {
    personas: ['TikTok Creators', 'Short-Form Content Creators'],
    description: 'Designed for TikTok creators making viral short-form videos',
  },
  instagram: {
    personas: ['Instagram Creators', 'Influencers'],
    description: 'Perfect for Instagram creators and influencers building their presence',
  },
  twitter: {
    personas: ['Twitter Users', 'Social Media Managers'],
    description: 'Essential for Twitter users crafting engaging tweets and threads',
  },
  linkedin: {
    personas: ['LinkedIn Professionals', 'Business Networkers'],
    description: 'Built for LinkedIn users building professional networks and thought leadership',
  },
  facebook: {
    personas: ['Social Media Marketers', 'Community Managers'],
    description: 'Designed for Facebook marketers managing pages and ad campaigns',
  },
  reddit: {
    personas: ['Reddit Users', 'Community Builders'],
    description: 'Perfect for Reddit users engaging with communities and discussions',
  },
  pinterest: {
    personas: ['Pinterest Creators', 'Visual Marketers'],
    description: 'Built for Pinterest creators curating and sharing visual content',
  },

  // Industry-Specific
  real estate: {
    personas: ['Real Estate Agents', 'Property Managers'],
    description: 'Designed for real estate professionals marketing properties and serving clients',
  },
  'real-estate': {
    personas: ['Real Estate Agents', 'Property Managers'],
    description: 'Designed for real estate professionals marketing properties and serving clients',
  },
  crypto: {
    personas: ['Crypto Traders', 'Blockchain Developers'],
    description: 'Perfect for cryptocurrency professionals and blockchain enthusiasts',
  },
  blockchain: {
    personas: ['Blockchain Developers', 'Web3 Engineers'],
    description: 'Built for blockchain developers creating decentralized applications',
  },
  web3: {
    personas: ['Web3 Developers', 'Blockchain Engineers'],
    description: 'Essential for Web3 developers building the decentralized internet',
  },
  nft: {
    personas: ['NFT Creators', 'Digital Artists'],
    description: 'Designed for NFT creators and collectors in the digital art space',
  },
  fitness: {
    personas: ['Fitness Coaches', 'Personal Trainers'],
    description: 'Perfect for fitness professionals creating workout plans and coaching content',
  },
  nutrition: {
    personas: ['Nutritionists', 'Diet Coaches'],
    description: 'Built for nutrition professionals providing dietary guidance and meal plans',
  },
  travel: {
    personas: ['Travel Bloggers', 'Travel Agents'],
    description: 'Designed for travel professionals creating itineraries and travel content',
  },
  photography: {
    personas: ['Photographers', 'Visual Artists'],
    description: 'Perfect for photographers editing, marketing, and showcasing their work',
  },
  music: {
    personas: ['Musicians', 'Music Producers'],
    description: 'Built for musicians and producers creating, promoting, and distributing music',
  },

  // Communication & Writing Styles
  newsletter: {
    personas: ['Newsletter Writers', 'Content Creators'],
    description: 'Essential for newsletter writers building engaged subscriber audiences',
  },
  press: {
    personas: ['PR Professionals', 'Journalists'],
    description: 'Designed for PR professionals and journalists crafting press materials',
  },
  'press release': {
    personas: ['PR Specialists', 'Communications Professionals'],
    description: 'Perfect for PR teams writing and distributing press releases',
  },
  proposal: {
    personas: ['Business Developers', 'Consultants'],
    description: 'Built for professionals writing compelling business proposals',
  },
  presentation: {
    personas: ['Presenters', 'Business Professionals'],
    description: 'Ideal for professionals creating impactful presentations and pitches',
  },
  resume: {
    personas: ['Job Seekers', 'Career Coaches'],
    description: 'Essential for job seekers and career coaches crafting standout resumes',
  },
  'cover letter': {
    personas: ['Job Applicants', 'Career Professionals'],
    description: 'Perfect for job applicants writing persuasive cover letters',
  },

  // E-learning & Courses
  course: {
    personas: ['Course Creators', 'Online Educators'],
    description: 'Designed for course creators developing online learning programs',
  },
  tutorial: {
    personas: ['Educators', 'Technical Writers'],
    description: 'Built for educators creating step-by-step tutorials and guides',
  },
  onboarding: {
    personas: ['HR Professionals', 'Training Specialists'],
    description: 'Perfect for HR teams developing employee onboarding programs',
  },
  training: {
    personas: ['Training Professionals', 'Corporate Trainers'],
    description: 'Essential for training specialists creating educational materials',
  },
}


/**
 * Generates accurate, tag-based audience description
 */
export function generateAudienceDescription(prompt: PromptContext): AudienceDescription {
  const tags = (prompt.tags || []).map((t) => t.toLowerCase())

  // Find matching audiences from tags
  const allPersonas = new Set<string>()
  let bestMatch: { description: string; secondary?: string } | null = null

  // Check each tag against our mapping
  for (const tag of tags) {
    const match = TAG_AUDIENCE_MAP[tag]
    if (match) {
      // Add personas
      match.personas.forEach((p) => allPersonas.add(p))
      // Use first match as best match
      if (!bestMatch) {
        bestMatch = { description: match.description, secondary: match.secondary }
      }
    }
  }

  // If no matches found, create generic but accurate description based on prompt name
  if (allPersonas.size === 0) {
    const genericPersonas = inferPersonasFromName(prompt.name, tags)
    genericPersonas.forEach((p) => allPersonas.add(p))

    // Generic description
    bestMatch = {
      description: `Designed for ${formatPersonaList(Array.from(allPersonas))} looking to ${extractActionFromName(prompt.name)}`,
    }
  }

  const personas = Array.from(allPersonas).slice(0, 5)

  return {
    primary: bestMatch?.description || `Perfect for professionals using ${prompt.name.toLowerCase()}`,
    secondary: bestMatch?.secondary,
    personas,
    keywords: tags.slice(0, 5),
  }
}

/**
 * Infer personas from prompt name when no tag matches
 */
function inferPersonasFromName(name: string, tags: string[]): string[] {
  const nameLower = name.toLowerCase()
  const combined = `${nameLower} ${tags.join(' ')}`

  // Check for common patterns
  if (combined.match(/\b(write|writing|content|blog|article)\b/)) {
    return ['Content Creators', 'Writers']
  }
  if (combined.match(/\b(code|coding|developer|debug|api)\b/)) {
    return ['Software Developers']
  }
  if (combined.match(/\b(market|campaign|seo|social)\b/)) {
    return ['Marketing Professionals']
  }
  if (combined.match(/\b(design|ui|ux|figma)\b/)) {
    return ['UX/UI Designers']
  }
  if (combined.match(/\b(sales|pitch|proposal|email)\b/)) {
    return ['Sales Professionals']
  }
  if (combined.match(/\b(business|strategy|plan)\b/)) {
    return ['Business Professionals', 'Entrepreneurs']
  }
  if (combined.match(/\b(analyze|data|analytics)\b/)) {
    return ['Data Analysts']
  }
  if (combined.match(/\b(product|feature|roadmap)\b/)) {
    return ['Product Managers']
  }

  return ['Professionals']
}

/**
 * Extract action from prompt name
 */
function extractActionFromName(name: string): string {
  const nameLower = name.toLowerCase()

  // Extract verb and object
  const match = nameLower.match(/^(create|generate|write|build|design|develop|analyze|optimize|improve)\s+(.+)/)
  if (match) {
    const [, verb, object] = match
    return `${verb} ${object.split(' ').slice(0, 3).join(' ')}`
  }

  return nameLower
}

/**
 * Format persona list for natural language
 */
function formatPersonaList(personas: string[]): string {
  if (personas.length === 0) return 'professionals'
  if (personas.length === 1) return personas[0].toLowerCase()
  if (personas.length === 2) return `${personas[0].toLowerCase()} and ${personas[1].toLowerCase()}`

  const last = personas[personas.length - 1]
  const others = personas.slice(0, -1)
  return `${others.map((p) => p.toLowerCase()).join(', ')}, and ${last.toLowerCase()}`
}

/**
 * Generates a compelling Call-to-Action based on tags
 */
export function generateCTA(prompt: PromptContext): { text: string; emphasis?: string } {
  const tags = (prompt.tags || []).map((t) => t.toLowerCase())

  // Match CTA to primary tag category
  if (tags.some((t) => ['business', 'strategy', 'startup'].includes(t))) {
    return {
      text: 'Start building your business with AI today.',
      emphasis: 'Clone this prompt and customize it for your unique needs.',
    }
  }

  if (tags.some((t) => ['marketing', 'seo', 'content'].includes(t))) {
    return {
      text: 'Take your marketing to the next level.',
      emphasis: 'Use this prompt in your next campaign to save hours and boost results.',
    }
  }

  if (tags.some((t) => ['coding', 'code', 'api', 'debugging'].includes(t))) {
    return {
      text: 'Accelerate your development workflow.',
      emphasis: 'Integrate this prompt into your coding process for faster, cleaner results.',
    }
  }

  if (tags.some((t) => ['writing', 'blog', 'copywriting'].includes(t))) {
    return {
      text: 'Create content that resonates.',
      emphasis: 'Try this prompt in your content workflow and watch your productivity soar.',
    }
  }

  if (tags.some((t) => ['sales', 'email'].includes(t))) {
    return {
      text: 'Close more deals with better communication.',
      emphasis: 'Use this prompt to craft personalized, high-converting messages.',
    }
  }

  return {
    text: 'Get started with this prompt today.',
    emphasis: 'Clone it, customize it, and make it your own.',
  }
}
