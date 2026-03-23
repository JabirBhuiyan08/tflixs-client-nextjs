// ─── Crop Types ────────────────────────────────────────────────────────────
export interface CropNPK {
  n: number;
  p: number;
  k: number;
}

export interface Crop {
  id:          string;
  name:        string;
  fullName:    string;
  icon:        string;
  slug:        string;
  npk:         CropNPK;
  season:      string;
  source:      string;
  yield:       string;
  description: string;
  keywords:    string[];
  category?:   string;
}

// ─── Calculator Types ───────────────────────────────────────────────────────
export interface FertilizerRecommendation {
  fertilizer: string;
  requiredKg: number;
  costUSD:    number;
  perHa:      number;
  nutrients?: { n: number; p: number; k: number };
}

export interface ApplicationSchedule {
  timing: string;
  share:  string;
  notes?: string;
}

export interface CalculatorResult {
  crop:                string;
  area:                number;
  areaUnit:            string;
  source:              string;
  yieldTarget:         string;
  requiredNPK:         { n: number; p: number; k: number };
  soilDeductions?:     { n: number; p: number; k: number };
  recommendations:     FertilizerRecommendation[];
  totalCostUSD:        number;
  priceNote?:          string;
  applicationSchedule: ApplicationSchedule[];
  disclaimer:          string;
}

// ─── Blog Types ─────────────────────────────────────────────────────────────
export interface BlogPost {
  _id:             string;
  title:           string;
  slug:            string;
  excerpt:         string;
  content:         string;
  category:        string;
  tags:            string[];
  featuredImage?:  string;
  published:       boolean;
  author:          string;
  views:           number;
  createdAt:       string;
  updatedAt:       string;
  metaTitle?:      string;
  metaDescription?:string;
  metaKeywords?:   string;
  canonicalUrl?:   string;
  ogImage?:        string;
}

// ─── Locale Types ───────────────────────────────────────────────────────────
export interface LocaleData {
  country:      string;
  countryName:  string;
  currency:     string;
  symbol:       string;
  language:     string;
  languageName: string;
  locale:       string;
}

export interface LocaleContextType {
  locale:          LocaleData;
  rates:           Record<string, number>;
  convertPrice:    (usd: number) => number;
  formatPrice:     (usd: number) => string;
  t:               (key: string, vars?: Record<string, string | number>) => string;
  setManualLocale: (code: string) => void;
  resetLocale:     () => void;
  LOCALE_MAP:      Record<string, Omit<LocaleData, 'country' | 'countryName'>>;
  isRTL:           boolean;
}

// ─── Auth Types ─────────────────────────────────────────────────────────────
export interface Admin {
  name:  string;
  email: string;
  role:  string;
}

export interface AuthContextType {
  admin:           Admin | null;
  loading:         boolean;
  isAuthenticated: boolean;
  login:           (email: string, password: string) => Promise<void>;
  logout:          () => Promise<void>;
  changePassword:  (current: string, next: string) => Promise<void>;
}

// ─── Seed Calculator Types ──────────────────────────────────────────────────
export interface SeedCropData {
  name:           string;
  icon:           string;
  category:       string;
  seedsPerKg:     number | null;
  seedsPerLb?:    number;
  targetPop:      number;
  seedWeightG?:   number;
  germDefault:    number;
  nurseryFactor?: number;
  notes:          string;
  source:         string;
  notApplicable?: boolean;
  unit?:          string;
}

export interface SeedResult {
  crop:           string;
  areaHa:         string;
  areaAcre:       string;
  targetPopHa:    string;
  targetPopAcre:  string;
  basicRateKgHa:  string;
  basicRateLbAc:  string;
  adjRateKgHa:    string;
  adjRateLbAc:    string;
  totalKg:        string;
  totalLb:        string;
  totalBags50kg:  number;
  totalBags20kg:  number;
  plsAdjust:      string;
  wasteBuffer:    boolean;
  nurseryFactor:  number;
  isAdvanced:     boolean;
  seedsPerKg:     number;
  source:         string;
  notes:          string;
}

// ─── AdSense Types ──────────────────────────────────────────────────────────
export interface AdUnit {
  enabled: boolean;
  adSlot:  string;
}

export interface AdsenseConfig {
  enabled:     boolean;
  publisherId: string;
  adUnits:     Record<string, AdUnit>;
}

export interface AdsenseContextType {
  config: AdsenseConfig | null;
}
