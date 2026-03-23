'use client';

import { useState } from 'react';
import AdSlot from '@/components/layout/AdSlot';
import PublicLayout from '@/components/layout/PublicLayout';
import './PestGuide.css';

interface Pest {
  id:         string;
  name:       string;
  icon:       string;
  type:       'Pest' | 'Disease' | 'Deficiency';
  crops:      string[];
  severity:   'High' | 'Medium' | 'Low';
  symptoms:   string;
  cause:      string;
  treatment:  string[];
  prevention: string;
}

const PESTS: Pest[] = [
  {
    id: 'bph', name: 'Brown Planthopper', icon: '🦗', type: 'Pest', crops: ['Rice'], severity: 'High',
    symptoms: 'Circular yellowing patches in field called "hopperburn". Plants dry out rapidly from center.',
    cause: 'Nilaparvata lugens — sucks phloem sap from rice plants.',
    treatment: ['Drain water from field immediately', 'Apply Imidacloprid 17.8% SL @ 125ml/acre', 'Avoid excessive nitrogen application', 'Use resistant varieties like IR64, BRRI dhan29'],
    prevention: 'Avoid dense planting. Use balanced NPK — excess N attracts BPH.',
  },
  {
    id: 'stem_borer', name: 'Stem Borer', icon: '🐛', type: 'Pest', crops: ['Rice', 'Maize', 'Sugarcane'], severity: 'High',
    symptoms: 'Dead heart in vegetative stage. White ears at heading. Hollow stems with frass.',
    cause: 'Scirpophaga incertulas larvae bore into stems.',
    treatment: ['Apply Chlorpyrifos 20 EC @ 2ml/L water', 'Carbofuran 3G granules in whorl @ 15 kg/acre', 'Release Trichogramma egg parasitoids', 'Pull out and destroy affected tillers'],
    prevention: 'Destroy stubble after harvest. Avoid ratoon crops if infestation was severe.',
  },
  {
    id: 'aphids', name: 'Aphids', icon: '🐜', type: 'Pest', crops: ['Mustard', 'Wheat', 'Vegetables', 'Cotton'], severity: 'Medium',
    symptoms: 'Curled, yellowing leaves. Sticky honeydew on leaves. Black sooty mold on honeydew.',
    cause: 'Lipaphis erysimi and other Aphid species suck plant sap.',
    treatment: ['Spray Dimethoate 30 EC @ 1.5ml/L', 'Imidacloprid 17.8 SL @ 0.5ml/L', 'Neem oil 5ml/L as organic option', 'Yellow sticky traps for monitoring'],
    prevention: 'Avoid excessive N fertilizer. Conserve natural enemies (ladybirds, lacewings).',
  },
  {
    id: 'late_blight', name: 'Late Blight', icon: '🍄', type: 'Disease', crops: ['Potato', 'Tomato'], severity: 'High',
    symptoms: 'Water-soaked lesions on leaves turning brown/black. White mold on underside in humid conditions.',
    cause: 'Phytophthora infestans — fungal-like pathogen. Spreads in cool, wet conditions.',
    treatment: ['Mancozeb 75 WP @ 2.5g/L at first sign', 'Metalaxyl + Mancozeb @ 2.5g/L', 'Spray every 7 days during outbreak', 'Remove and destroy infected plants'],
    prevention: 'Use certified disease-free seed. Avoid overhead irrigation. Crop rotation.',
  },
  {
    id: 'blast', name: 'Rice Blast', icon: '💨', type: 'Disease', crops: ['Rice'], severity: 'High',
    symptoms: 'Diamond-shaped gray lesions on leaves with brown borders. Neck rot causing white ears.',
    cause: 'Magnaporthe oryzae fungus. Spreads via wind. Favoured by high humidity and N excess.',
    treatment: ['Tricyclazole 75 WP @ 0.6g/L at boot stage', 'Isoprothiolane 40 EC @ 1.5ml/L', 'Spray twice at 10 day intervals', 'Drain field temporarily'],
    prevention: 'Avoid excessive nitrogen. Use resistant varieties. Do not over-irrigate.',
  },
  {
    id: 'whitefly', name: 'Whitefly', icon: '🦋', type: 'Pest', crops: ['Tomato', 'Chilli', 'Cotton', 'Vegetables'], severity: 'Medium',
    symptoms: 'Yellow stippling on leaves. Honeydew and sooty mold. Virus transmission — leaf curl.',
    cause: 'Bemisia tabaci. Also transmits Tomato Yellow Leaf Curl Virus (TYLCV).',
    treatment: ['Imidacloprid 17.8 SL @ 0.5ml/L', 'Thiamethoxam 25 WG @ 0.2g/L', 'Neem oil 5ml/L every 5 days', 'Yellow sticky traps @ 20/acre'],
    prevention: 'Use reflective mulch to repel. Avoid planting near infested crops. Remove weeds.',
  },
  {
    id: 'fusarium', name: 'Fusarium Wilt', icon: '🌿', type: 'Disease', crops: ['Tomato', 'Chilli', 'Banana', 'Cotton'], severity: 'High',
    symptoms: 'One-sided wilting of plant. Yellow leaves starting from bottom. Brown vascular tissue inside stem.',
    cause: 'Fusarium oxysporum soil-borne fungus. Spreads through infected soil and water.',
    treatment: ['No effective cure once infected — remove plants', 'Soil drench with Carbendazim 50 WP @ 2g/L', 'Trichoderma viride bio-agent @ 5g/kg soil', 'Avoid waterlogging'],
    prevention: 'Crop rotation (3–4 years). Use grafted seedlings. Raised bed cultivation.',
  },
  {
    id: 'thrips', name: 'Thrips', icon: '🦠', type: 'Pest', crops: ['Onion', 'Chilli', 'Cotton', 'Rice'], severity: 'Medium',
    symptoms: 'Silver streaks on leaves. Leaf tip curling. Distorted growth. Onion leaves turn silvery-white.',
    cause: 'Thrips tabaci and Frankliniella schultzei — tiny insects rasping leaf surfaces.',
    treatment: ['Spinosad 45 SC @ 0.3ml/L', 'Fipronil 5 SC @ 1.5ml/L', 'Dimethoate 30 EC @ 2ml/L', 'Blue sticky traps for monitoring'],
    prevention: 'Reflective mulch. Remove crop debris. Avoid excess nitrogen fertilizer.',
  },
  {
    id: 'nutrient_n', name: 'Nitrogen Deficiency', icon: '🍃', type: 'Deficiency', crops: ['All Crops'], severity: 'Medium',
    symptoms: 'Yellowing starts from older/lower leaves and moves upward. Stunted growth. Pale green color overall.',
    cause: 'Insufficient nitrogen in soil. Poor uptake due to waterlogging or soil compaction.',
    treatment: ['Apply Urea @ 20–25 kg/acre as top dressing', 'Foliar spray of Urea 2% solution', 'Apply Ammonium Sulphate for quick release', 'Improve drainage if waterlogged'],
    prevention: 'Follow recommended NPK schedule. Split N application in 3 doses.',
  },
  {
    id: 'nutrient_fe', name: 'Iron Deficiency', icon: '🌱', type: 'Deficiency', crops: ['Rice', 'Wheat', 'Vegetables'], severity: 'Medium',
    symptoms: 'Interveinal chlorosis on young/upper leaves first. Leaves yellow between green veins.',
    cause: 'Alkaline soils (high pH). Waterlogged conditions. Excess phosphorus or zinc.',
    treatment: ['Foliar spray of FeSO4 (Ferrous Sulphate) 0.5%', 'Soil application of FeSO4 @ 25 kg/ha', 'Acidify soil with elemental sulfur', 'Apply chelated iron (Fe-EDTA) for faster response'],
    prevention: 'Maintain soil pH 6–6.5. Avoid excessive P application. Use organic matter.',
  },
];

const TYPES = ['All', 'Pest', 'Disease', 'Deficiency'] as const;
const SEVERITY_CLASS: Record<string, string> = {
  High:   'badge-red',
  Medium: 'badge-amber',
  Low:    'badge-green',
};

export default function PestGuideClient() {
  const [type,     setType]     = useState<string>('All');
  const [search,   setSearch]   = useState('');
  const [selected, setSelected] = useState<Pest | null>(null);

  const filtered = PESTS.filter(p =>
    (type === 'All' || p.type === type) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
     p.crops.some(c => c.toLowerCase().includes(search.toLowerCase())))
  );

  const toggle = (pest: Pest) =>
    setSelected(prev => prev?.id === pest.id ? null : pest);

  return (
    <PublicLayout>
      <section className="page-hero">
        <div className="container">
          <h1>💊 Pest &amp; Disease Guide</h1>
          <p>Identify crop problems and get science-based treatment recommendations</p>
        </div>
      </section>

      <div className="container section-sm">
        <AdSlot slot="header" style={{ marginBottom: 24 }} />

        {/* Controls */}
        <div className="pest-controls">
          <input
            type="text" className="form-control"
            placeholder="🔍 Search by pest name or crop..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 320 }}
          />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {TYPES.map(t => (
              <button key={t}
                className={`btn btn-sm ${type === t ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setType(t)}
              >
                {t === 'All' ? '🔍 All' : t === 'Pest' ? '🦗 Pests' : t === 'Disease' ? '🍄 Diseases' : '🌿 Deficiencies'}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="pest-grid">
          {filtered.map(pest => (
            <div
              key={pest.id}
              className={`pest-card card ${selected?.id === pest.id ? 'pest-card--active' : ''}`}
              onClick={() => toggle(pest)}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-body">
                <div className="pest-card__header">
                  <span className="pest-card__icon">{pest.icon}</span>
                  <div style={{ flex: 1 }}>
                    <h3>{pest.name}</h3>
                    <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                      <span className={`badge ${SEVERITY_CLASS[pest.severity]}`}>{pest.severity} Risk</span>
                      <span className="badge badge-blue">{pest.type}</span>
                    </div>
                  </div>
                </div>

                <div className="pest-card__crops" style={{ margin: '10px 0 8px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {pest.crops.map(c => (
                    <span key={c} className="pest-crop-tag badge badge-outline">{c}</span>
                  ))}
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--stone)', lineHeight: 1.55, marginBottom: 14 }}>
                  {pest.symptoms.slice(0, 100)}…
                </p>

                <button className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                  {selected?.id === pest.id ? '▲ Hide Details' : '▼ View Treatment'}
                </button>
              </div>

              {/* Expanded detail */}
              {selected?.id === pest.id && (
                <div className="pest-detail" onClick={e => e.stopPropagation()}>
                  {[
                    { icon: '🔍', title: 'Symptoms',   content: pest.symptoms,   list: false },
                    { icon: '🦠', title: 'Cause',      content: pest.cause,      list: false },
                    { icon: '💊', title: 'Treatment',  content: pest.treatment,  list: true  },
                    { icon: '🛡️', title: 'Prevention', content: pest.prevention, list: false },
                  ].map(section => (
                    <div key={section.title} className="pest-detail__section">
                      <h4>{section.icon} {section.title}</h4>
                      {section.list ? (
                        <ul style={{ marginLeft: 18 }}>
                          {(section.content as string[]).map((item, i) => (
                            <li key={i} style={{ marginBottom: 4, fontSize: '0.88rem' }}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>{section.content as string}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--stone)' }}>
            <p style={{ fontSize: '1.1rem' }}>No results found for &quot;{search}&quot;</p>
          </div>
        )}

        <AdSlot slot="belowCalculator" style={{ marginTop: 32 }} />
      </div>
    </PublicLayout>
  );
}
