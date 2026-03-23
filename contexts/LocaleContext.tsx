'use client';

import React, {
  createContext, useContext, useState, useEffect,
  useCallback, ReactNode,
} from 'react';
import type { LocaleData, LocaleContextType } from '@/types';

// ─── Locale Map ─────────────────────────────────────────────────────────────
type LocaleEntry = Omit<LocaleData, 'country' | 'countryName'>;

const LOCALE_MAP: Record<string, LocaleEntry> = {
  US: { currency: 'USD', symbol: '$',   language: 'en', languageName: 'English',    locale: 'en-US' },
  GB: { currency: 'GBP', symbol: '£',   language: 'en', languageName: 'English',    locale: 'en-GB' },
  AU: { currency: 'AUD', symbol: 'A$',  language: 'en', languageName: 'English',    locale: 'en-AU' },
  NG: { currency: 'NGN', symbol: '₦',   language: 'en', languageName: 'English',    locale: 'en-NG' },
  GH: { currency: 'GHS', symbol: '₵',   language: 'en', languageName: 'English',    locale: 'en-GH' },
  KE: { currency: 'KES', symbol: 'KSh', language: 'en', languageName: 'English',    locale: 'en-KE' },
  BD: { currency: 'BDT', symbol: '৳',   language: 'bn', languageName: 'বাংলা',      locale: 'bn-BD' },
  IN: { currency: 'INR', symbol: '₹',   language: 'hi', languageName: 'हिंदी',      locale: 'hi-IN' },
  PK: { currency: 'PKR', symbol: '₨',   language: 'ur', languageName: 'اردو',       locale: 'ur-PK' },
  NP: { currency: 'NPR', symbol: '₨',   language: 'ne', languageName: 'नेपाली',     locale: 'ne-NP' },
  ID: { currency: 'IDR', symbol: 'Rp',  language: 'id', languageName: 'Indonesia',  locale: 'id-ID' },
  PH: { currency: 'PHP', symbol: '₱',   language: 'fil',languageName: 'Filipino',   locale: 'fil-PH' },
  TH: { currency: 'THB', symbol: '฿',   language: 'th', languageName: 'ภาษาไทย',    locale: 'th-TH' },
  VN: { currency: 'VND', symbol: '₫',   language: 'vi', languageName: 'Tiếng Việt', locale: 'vi-VN' },
  MY: { currency: 'MYR', symbol: 'RM',  language: 'ms', languageName: 'Melayu',     locale: 'ms-MY' },
  CN: { currency: 'CNY', symbol: '¥',   language: 'zh', languageName: '中文',        locale: 'zh-CN' },
  JP: { currency: 'JPY', symbol: '¥',   language: 'ja', languageName: '日本語',      locale: 'ja-JP' },
  KR: { currency: 'KRW', symbol: '₩',   language: 'ko', languageName: '한국어',      locale: 'ko-KR' },
  EG: { currency: 'EGP', symbol: 'E£',  language: 'ar', languageName: 'العربية',    locale: 'ar-EG' },
  SA: { currency: 'SAR', symbol: '﷼',   language: 'ar', languageName: 'العربية',    locale: 'ar-SA' },
  BR: { currency: 'BRL', symbol: 'R$',  language: 'pt', languageName: 'Português',  locale: 'pt-BR' },
  MX: { currency: 'MXN', symbol: '$',   language: 'es', languageName: 'Español',    locale: 'es-MX' },
  DE: { currency: 'EUR', symbol: '€',   language: 'de', languageName: 'Deutsch',    locale: 'de-DE' },
  FR: { currency: 'EUR', symbol: '€',   language: 'fr', languageName: 'Français',   locale: 'fr-FR' },
};

// ─── Translations ───────────────────────────────────────────────────────────
type TranslationKey =
  | 'tryCalculator' | 'startCalculating' | 'readFarmingTips' | 'freeForFarmers'
  | 'heroTitle' | 'heroSubtitle' | 'heroDesc'
  | 'calculator' | 'blog' | 'about' | 'contact' | 'home'
  | 'selectCrop' | 'enterArea' | 'soilData' | 'results'
  | 'calculate' | 'calculating' | 'nextStep' | 'back'
  | 'estCost' | 'totalCost' | 'disclaimer'
  | 'sendMessage' | 'sending' | 'footerTagline' | 'copyright' | 'currencyNote';

type Translations = Record<TranslationKey, string>;

const TRANSLATIONS: Record<string, Translations> = {
  en: {
    tryCalculator: 'Try Calculator',   startCalculating: '🧮 Start Calculating',
    readFarmingTips: 'Read Farming Tips', freeForFarmers: 'Free for All Farmers',
    heroTitle: 'Smart Fertilizer Calculator', heroSubtitle: 'for Better Harvests',
    heroDesc: 'Get accurate NPK fertilizer recommendations for any crop. Input your soil data, land area, and crop type — receive a precise fertilizer plan in seconds.',
    calculator: 'Calculator', blog: 'Blog', about: 'About', contact: 'Contact', home: 'Home',
    selectCrop: 'Select Crop', enterArea: 'Enter Area', soilData: 'Soil Data', results: 'Results',
    calculate: '🧮 Calculate Now', calculating: '⏳ Calculating...', nextStep: 'Next', back: 'Back',
    estCost: 'Est. Cost', totalCost: 'Total Est. Cost',
    disclaimer: 'General recommendations based on FAO/ICAR research. Actual needs vary by soil, variety & climate.',
    sendMessage: '📤 Send Message', sending: '⏳ Sending...',
    footerTagline: 'Smart fertilizer recommendations for modern farmers.',
    copyright: '© {year} Tflixs. All rights reserved.',
    currencyNote: 'Prices in {currency}. Rates are approximate and may vary.',
  },
  bn: {
    tryCalculator: 'ক্যালকুলেটর ব্যবহার করুন', startCalculating: '🧮 হিসাব শুরু করুন',
    readFarmingTips: 'কৃষি টিপস পড়ুন', freeForFarmers: 'সকল কৃষকের জন্য বিনামূল্যে',
    heroTitle: 'স্মার্ট সার ক্যালকুলেটর', heroSubtitle: 'ভালো ফসলের জন্য',
    heroDesc: 'যেকোনো ফসলের জন্য সঠিক NPK সুপারিশ পান।',
    calculator: 'ক্যালকুলেটর', blog: 'ব্লগ', about: 'আমাদের সম্পর্কে', contact: 'যোগাযোগ', home: 'হোম',
    selectCrop: 'ফসল নির্বাচন করুন', enterArea: 'জমির পরিমাণ', soilData: 'মাটির তথ্য', results: 'ফলাফল',
    calculate: '🧮 হিসাব করুন', calculating: '⏳ হিসাব হচ্ছে...', nextStep: 'পরবর্তী', back: 'পিছনে',
    estCost: 'আনুমানিক খরচ', totalCost: 'মোট আনুমানিক খরচ',
    disclaimer: 'FAO/ICAR গবেষণার উপর ভিত্তি করে সাধারণ সুপারিশ।',
    sendMessage: '📤 বার্তা পাঠান', sending: '⏳ পাঠানো হচ্ছে...',
    footerTagline: 'আধুনিক কৃষকদের জন্য স্মার্ট সার সুপারিশ।',
    copyright: '© {year} Tflixs. সর্বস্বত্ব সংরক্ষিত।',
    currencyNote: 'মূল্য {currency}-তে। মূল্য পরিবর্তনশীল।',
  },
  hi: {
    tryCalculator: 'कैलकुलेटर आज़माएं', startCalculating: '🧮 गणना शुरू करें',
    readFarmingTips: 'खेती के टिप्स पढ़ें', freeForFarmers: 'सभी किसानों के लिए मुफ़्त',
    heroTitle: 'स्मार्ट उर्वरक कैलकुलेटर', heroSubtitle: 'बेहतर फसल के लिए',
    heroDesc: 'किसी भी फसल के लिए सटीक NPK अनुशंसा पाएं।',
    calculator: 'कैलकुलेटर', blog: 'ब्लॉग', about: 'हमारे बारे में', contact: 'संपर्क', home: 'होम',
    selectCrop: 'फसल चुनें', enterArea: 'क्षेत्र दर्ज करें', soilData: 'मिट्टी डेटा', results: 'परिणाम',
    calculate: '🧮 अभी गणना करें', calculating: '⏳ गणना हो रही है...', nextStep: 'अगला', back: 'वापस',
    estCost: 'अनुमानित लागत', totalCost: 'कुल अनुमानित लागत',
    disclaimer: 'FAO/ICAR दिशानिर्देशों पर आधारित सामान्य सिफारिशें।',
    sendMessage: '📤 संदेश भेजें', sending: '⏳ भेजा जा रहा है...',
    footerTagline: 'आधुनिक किसानों के लिए स्मार्ट उर्वरक सिफारिशें।',
    copyright: '© {year} Tflixs. सर्वाधिकार सुरक्षित।',
    currencyNote: 'कीमतें {currency} में। दरें अनुमानित हैं।',
  },
  ar: {
    tryCalculator: 'جرب الحاسبة', startCalculating: '🧮 ابدأ الحساب',
    readFarmingTips: 'اقرأ نصائح الزراعة', freeForFarmers: 'مجاني لجميع المزارعين',
    heroTitle: 'حاسبة الأسمدة الذكية', heroSubtitle: 'لمحاصيل أفضل',
    heroDesc: 'احصل على توصيات دقيقة لأسمدة NPK.',
    calculator: 'الحاسبة', blog: 'المدونة', about: 'من نحن', contact: 'اتصل بنا', home: 'الرئيسية',
    selectCrop: 'اختر المحصول', enterArea: 'أدخل المساحة', soilData: 'بيانات التربة', results: 'النتائج',
    calculate: '🧮 احسب الآن', calculating: '⏳ جاري الحساب...', nextStep: 'التالي', back: 'رجوع',
    estCost: 'التكلفة التقديرية', totalCost: 'إجمالي التكلفة',
    disclaimer: 'توصيات عامة بناءً على إرشادات FAO.',
    sendMessage: '📤 إرسال', sending: '⏳ جاري الإرسال...',
    footerTagline: 'توصيات أسمدة ذكية للمزارعين.',
    copyright: '© {year} Tflixs. جميع الحقوق محفوظة.',
    currencyNote: 'الأسعار بـ {currency}.',
  },
};

const tFn = (lang: string, key: string, vars: Record<string, string | number> = {}): string => {
  const dict = TRANSLATIONS[lang] ?? TRANSLATIONS.en;
  let str = (dict as Record<string, string>)[key] ?? (TRANSLATIONS.en as Record<string, string>)[key] ?? key;
  Object.entries(vars).forEach(([k, v]) => { str = str.replace(`{${k}}`, String(v)); });
  return str;
};

const FALLBACK_RATES: Record<string, number> = {
  USD:1, EUR:0.92, GBP:0.79, INR:83.5, BDT:110, PKR:278,
  IDR:15700, PHP:57, THB:35, VND:24500, MYR:4.7,
  CNY:7.2, JPY:149, KRW:1320, NGN:1550, GHS:14, KES:130,
  EGP:31, SAR:3.75, BRL:5.0, MXN:17, AUD:1.53,
};

const DEFAULT_LOCALE: LocaleData = {
  country: 'US', countryName: 'United States',
  currency: 'USD', symbol: '$',
  language: 'en', languageName: 'English', locale: 'en-US',
};

const DEFAULT_CONTEXT: LocaleContextType = {
  locale:          DEFAULT_LOCALE,
  rates:           FALLBACK_RATES,
  convertPrice:    (v) => v,
  formatPrice:     (v) => `$${v.toFixed(2)}`,
  t:               (key) => key,
  setManualLocale: () => {},
  resetLocale:     () => {},
  LOCALE_MAP,
  isRTL:           false,
};

// ─── Context ─────────────────────────────────────────────────────────────────
const LocaleContext = createContext<LocaleContextType>(DEFAULT_CONTEXT);

export const useLocale = (): LocaleContextType => useContext(LocaleContext);

export { LOCALE_MAP };

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<LocaleData>(DEFAULT_LOCALE);
  const [rates,  setRates]  = useState<Record<string, number>>(FALLBACK_RATES);

  useEffect(() => {
    // Fetch exchange rates
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(r => r.json())
      .then((d: { result: string; rates: Record<string, number> }) => {
        if (d.result === 'success') setRates(d.rates);
      })
      .catch(() => {});

    // Load saved preference
    try {
      const saved = localStorage.getItem('tflixs_locale');
      if (saved) { setLocale(JSON.parse(saved) as LocaleData); return; }
    } catch { /* ignore */ }

    // Auto-detect from IP
    fetch('https://ipwho.is/')
      .then(r => r.json())
      .then((d: { success: boolean; country_code: string; country: string; city: string }) => {
        if (d.success && LOCALE_MAP[d.country_code]) {
          setLocale({ ...LOCALE_MAP[d.country_code], country: d.country_code, countryName: d.country });
        }
      })
      .catch(() => {});
  }, []);

  const setManualLocale = useCallback((code: string) => {
    if (!LOCALE_MAP[code]) return;
    const newLocale: LocaleData = { ...LOCALE_MAP[code], country: code, countryName: code };
    setLocale(newLocale);
    localStorage.setItem('tflixs_locale', JSON.stringify(newLocale));
  }, []);

  const resetLocale = useCallback(() => {
    localStorage.removeItem('tflixs_locale');
    window.location.reload();
  }, []);

  const convertPrice = useCallback((usd: number): number => {
    return Math.round(usd * (rates[locale.currency] ?? 1) * 100) / 100;
  }, [rates, locale.currency]);

  const formatPrice = useCallback((usd: number): string => {
    const v = convertPrice(usd);
    const large = ['IDR', 'VND', 'KRW'].includes(locale.currency);
    return `${locale.symbol}${large ? Math.round(v).toLocaleString() : v.toLocaleString()}`;
  }, [convertPrice, locale]);

  const t = useCallback((key: string, vars: Record<string, string | number> = {}): string =>
    tFn(locale.language, key, vars),
  [locale.language]);

  const isRTL = ['ar', 'ur'].includes(locale.language);

  return (
    <LocaleContext.Provider value={{
      locale, rates, convertPrice, formatPrice,
      t, setManualLocale, resetLocale, LOCALE_MAP, isRTL,
    }}>
      {children}
    </LocaleContext.Provider>
  );
}
