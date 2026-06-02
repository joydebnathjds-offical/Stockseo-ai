import { AIEngine, GeneratedMeta, TitleLength, DescLength, TagCount } from "../store/useAppStore";

/* ─── STOCK MARKETPLACE CATEGORIES ──────────────────────────────────────── */
const CATEGORIES = [
  "Nature & Wildlife", "Business & Finance", "Technology", "Travel & Tourism",
  "Food & Beverage", "People & Lifestyle", "Architecture", "Abstract & Patterns",
  "Health & Wellness", "Sports & Fitness", "Arts & Entertainment", "Education",
  "Fashion & Beauty", "Science & Research", "Transportation",
];

const SUB_CATEGORIES: Record<string, string[]> = {
  "Nature & Wildlife": ["Landscapes", "Animals", "Plants & Flowers", "Weather", "Oceans & Water"],
  "Business & Finance": ["Corporate", "Teamwork", "Finance Charts", "Remote Work", "Startups"],
  "Technology": ["AI & Robotics", "Software Development", "Cybersecurity", "IoT Devices", "Cloud Computing"],
  "Travel & Tourism": ["City Skylines", "Airports", "Cultural Heritage", "Adventure", "Hotels & Resorts"],
  "Food & Beverage": ["Restaurant", "Healthy Eating", "Street Food", "Beverages", "Cooking"],
  "People & Lifestyle": ["Family", "Millennials", "Seniors", "Diversity", "Emotions"],
  "Architecture": ["Modern Buildings", "Interior Design", "Urban Spaces", "Historic Structures", "Bridges"],
  "Abstract & Patterns": ["Geometric", "Textures", "Digital Art", "Gradients", "3D Renders"],
  "Health & Wellness": ["Medical", "Mental Health", "Fitness", "Nutrition", "Meditation"],
  "Sports & Fitness": ["Team Sports", "Individual Sports", "Gym", "Outdoor Sports", "Extreme Sports"],
};

/* ─── KEYWORD BANKS BY CATEGORY ─────────────────────────────────────────── */
const KEYWORD_BANKS: Record<string, string[]> = {
  "Nature & Wildlife": [
    "natural", "wildlife", "outdoor", "scenic", "serene", "wilderness", "ecosystem",
    "biodiversity", "habitat", "conservation", "breathtaking", "pristine", "untouched",
    "majestic", "panoramic", "dramatic", "vibrant", "lush", "verdant", "tranquil",
    "sunlight", "golden hour", "misty", "foggy", "clear sky", "horizon", "vast",
    "picturesque", "stunning", "idyllic", "remote", "exploration", "adventure", "raw beauty",
    "natural light", "shadows", "textures", "colors", "seasons", "macro photography",
    "aerial view", "wide angle", "bokeh", "depth of field",
  ],
  "Technology": [
    "digital", "innovation", "futuristic", "cutting-edge", "modern", "tech", "smart",
    "connected", "network", "data", "algorithm", "artificial intelligence", "machine learning",
    "neural network", "automation", "cloud", "software", "hardware", "circuit", "chip",
    "binary", "code", "programming", "developer", "startup", "disruption", "scalable",
    "agile", "DevOps", "API", "integration", "platform", "solution", "enterprise",
    "cybersecurity", "encryption", "blockchain", "IoT", "5G", "quantum", "edge computing",
    "SaaS", "microservices", "containerization", "serverless",
  ],
  "Business & Finance": [
    "professional", "corporate", "executive", "management", "strategy", "growth",
    "success", "achievement", "leadership", "teamwork", "collaboration", "meeting",
    "office", "workplace", "entrepreneur", "investment", "financial", "market",
    "economy", "revenue", "profit", "analysis", "statistics", "dashboard",
    "planning", "workflow", "productivity", "efficiency", "innovation", "disruption",
    "global", "multinational", "B2B", "enterprise", "SMB", "startup culture",
    "remote work", "hybrid", "agile", "KPI", "ROI", "scalability",
  ],
  "default": [
    "high quality", "professional", "creative", "modern", "contemporary", "unique",
    "versatile", "commercial use", "editorial", "royalty-free", "stock photo",
    "photography", "visual", "composition", "lighting", "focus", "sharp",
    "detailed", "high resolution", "4K", "isolated", "background", "concept",
    "design", "artistic", "aesthetic", "minimalist", "clean", "fresh",
    "dynamic", "energetic", "premium", "exclusive", "trending", "popular",
    "download", "template", "mockup", "branding", "marketing", "advertising",
    "social media", "web design", "print", "digital marketing",
  ],
};

/* ─── TITLE TEMPLATES ────────────────────────────────────────────────────── */
const generateTitle = (filename: string, category: string, length: TitleLength): string => {
  const cleanName = filename.replace(/\.(jpg|jpeg|png|webp|tiff?)$/i, "").replace(/[-_]/g, " ");
  const templates = [
    `Professional ${category} Stock Photography — Premium High-Resolution Commercial Image`,
    `${cleanName} — ${category} Concept Visual for Creative Projects`,
    `High-Quality ${category} Stock Photo: Perfect for Business, Marketing & Digital Media`,
    `Stunning ${category} Photography — Royalty-Free Commercial License Available`,
    `${cleanName}: Premium Stock Image for ${category} Themed Design Projects`,
  ];
  const base = templates[Math.floor(Math.random() * templates.length)];
  return base.slice(0, length);
};

/* ─── DESCRIPTION TEMPLATES ──────────────────────────────────────────────── */
const generateDescription = (filename: string, category: string, subCat: string, length: DescLength): string => {
  const cleanName = filename.replace(/\.(jpg|jpeg|png|webp|tiff?)$/i, "").replace(/[-_]/g, " ");
  const desc = `This premium ${category.toLowerCase()} stock photograph captures the essence of ${subCat.toLowerCase()} with exceptional detail and professional lighting. Perfect for commercial projects, digital marketing campaigns, website design, and editorial use. The high-resolution image (available in multiple formats) delivers outstanding clarity and vibrant color accuracy that meets the strict quality standards of Shutterstock, Adobe Stock, Freepik, iStock, Dreamstime, and Alamy. Ideal for creative professionals seeking a versatile, royalty-free visual asset that elevates brand storytelling and communicates concepts effectively across print and digital media channels. This exclusive ${cleanName.toLowerCase()} themed photograph offers unparalleled composition with natural lighting and dynamic depth that makes it stand out in competitive stock marketplaces. Licensed for commercial and editorial use, this image supports a wide range of creative applications including presentations, social media campaigns, UI mockups, and marketing collateral.`;
  return desc.slice(0, length);
};

/* ─── TAG GENERATOR ──────────────────────────────────────────────────────── */
const generateTags = (category: string, filename: string, count: TagCount): string[] => {
  const cleanName = filename.replace(/\.(jpg|jpeg|png|webp|tiff?)$/i, "").replace(/[-_]/g, " ");
  const words = cleanName.split(" ").filter(w => w.length > 2);

  const bankKey = Object.keys(KEYWORD_BANKS).find(k => k.toLowerCase() === category.toLowerCase()) || "default";
  const bankTags = [...KEYWORD_BANKS[bankKey], ...KEYWORD_BANKS["default"]];
  const fileTags = words.slice(0, 5);
  const categoryWords = category.toLowerCase().split(" ");

  const combined = [...new Set([...fileTags, ...categoryWords, ...bankTags])];
  const shuffled = combined.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(t => t.toLowerCase().trim());
};

/* ─── SEO SCORE CALCULATOR ───────────────────────────────────────────────── */
const calculateSEOScore = (title: string, description: string, tags: string[]): GeneratedMeta => {
  const titleScore = Math.min(100, (title.length / 100) * 30 + (title.split(" ").length > 5 ? 20 : 10));
  const descScore = Math.min(100, (description.length / 300) * 30 + (description.split(" ").length > 20 ? 20 : 10));
  const tagScore = Math.min(100, (tags.length / 50) * 30 + (tags.length >= 30 ? 20 : 10));

  const readabilityScore = Math.round(60 + Math.random() * 35);
  const tagDensity = Math.round(tags.length * 1.8);
  const marketplaceCompliance = Math.round(75 + Math.random() * 20);
  const seoScore = Math.round((titleScore * 0.3 + descScore * 0.35 + tagScore * 0.35) * 0.7 + readabilityScore * 0.3);

  return {
    title,
    description,
    tags,
    categories: [],
    subCategories: [],
    seoScore: Math.min(98, seoScore),
    readabilityScore,
    tagDensity,
    marketplaceCompliance,
  };
};

/* ─── MAIN AI GENERATION FUNCTION ────────────────────────────────────────── */
export async function generateMetadata(
  filename: string,
  engine: AIEngine,
  titleLength: TitleLength,
  descLength: DescLength,
  tagCount: TagCount,
  _apiKey?: string
): Promise<GeneratedMeta> {
  // Simulate API processing time based on engine
  const delays: Record<AIEngine, number> = {
    "gemini-2.5-pro": 3200,
    "gemini-2.5-flash": 1800,
    "gpt-4o": 2800,
    "gpt-5": 3500,
    "grok-4": 3000,
    "grok-fast": 1600,
  };

  await new Promise((r) => setTimeout(r, delays[engine] + Math.random() * 500));

  // Detect category from filename
  const filenameLC = filename.toLowerCase();
  let category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  if (filenameLC.includes("nature") || filenameLC.includes("forest") || filenameLC.includes("tree")) category = "Nature & Wildlife";
  if (filenameLC.includes("tech") || filenameLC.includes("code") || filenameLC.includes("computer")) category = "Technology";
  if (filenameLC.includes("biz") || filenameLC.includes("office") || filenameLC.includes("work")) category = "Business & Finance";
  if (filenameLC.includes("food") || filenameLC.includes("eat") || filenameLC.includes("cook")) category = "Food & Beverage";
  if (filenameLC.includes("travel") || filenameLC.includes("city") || filenameLC.includes("sky")) category = "Travel & Tourism";

  const subCatList = SUB_CATEGORIES[category] || ["General", "Premium", "Commercial"];
  const subCategory = subCatList[Math.floor(Math.random() * subCatList.length)];
  const subCategory2 = subCatList[Math.floor(Math.random() * subCatList.length)];

  const title = generateTitle(filename, category, titleLength);
  const description = generateDescription(filename, category, subCategory, descLength);
  const tags = generateTags(category, filename, tagCount);
  const result = calculateSEOScore(title, description, tags);

  return {
    ...result,
    categories: [category, CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]],
    subCategories: [subCategory, subCategory2],
  };
}

/* ─── REGENERATE SINGLE FIELD ────────────────────────────────────────────── */
export async function regenerateField(
  field: "title" | "description" | "tags",
  filename: string,
  _engine: AIEngine,
  titleLength: TitleLength,
  descLength: DescLength,
  tagCount: TagCount,
  currentMeta: GeneratedMeta
): Promise<Partial<GeneratedMeta>> {
  const delay = 1200 + Math.random() * 800;
  await new Promise((r) => setTimeout(r, delay));

  const category = currentMeta.categories[0] || "Nature & Wildlife";
  const subCat = currentMeta.subCategories[0] || "General";

  if (field === "title") {
    const title = generateTitle(filename, category, titleLength);
    const score = calculateSEOScore(title, currentMeta.description, currentMeta.tags);
    return { title, seoScore: score.seoScore };
  }
  if (field === "description") {
    const description = generateDescription(filename, category, subCat, descLength);
    const score = calculateSEOScore(currentMeta.title, description, currentMeta.tags);
    return { description, seoScore: score.seoScore };
  }
  if (field === "tags") {
    const tags = generateTags(category, filename, tagCount);
    const score = calculateSEOScore(currentMeta.title, currentMeta.description, tags);
    return { tags, seoScore: score.seoScore, tagDensity: Math.round(tags.length * 1.8) };
  }
  return {};
}

export const ENGINE_LABELS: Record<AIEngine, { name: string; badge: string; color: string }> = {
  "gemini-2.5-pro": { name: "Gemini 2.5 Pro", badge: "GOOGLE", color: "#4285F4" },
  "gemini-2.5-flash": { name: "Gemini 2.5 Flash", badge: "GOOGLE", color: "#34A853" },
  "gpt-4o": { name: "GPT-4o", badge: "OPENAI", color: "#10a37f" },
  "gpt-5": { name: "GPT-5", badge: "OPENAI", color: "#19c37d" },
  "grok-4": { name: "Grok 4", badge: "xAI", color: "#FF4EAD" },
  "grok-fast": { name: "Grok Fast", badge: "xAI", color: "#8B5CF6" },
};
