'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useLocale } from '@/contexts/LocaleContext';
import PublicLayout from '@/components/layout/PublicLayout';
import AdSlot from '@/components/layout/AdSlot';
import WeatherWidget from '@/components/layout/WeatherWidget';
import './Calculator.css';
import type { CalculatorResult } from '@/types';

interface CropData {
  id: string;
  name: string;
  icon: string;
  season: string;
  npkRequirement?: { n: number; p: number; k: number };
}

const AREA_UNITS = [
  { value: 'hectare', label: 'Hectare (ha)' },
  { value: 'acre', label: 'Acre' },
  { value: 'bigha', label: 'Bigha' },
  { value: 'katha', label: 'Katha' },
  { value: 'decimal', label: 'Decimal' },
];

const AREA_CONVERSION: Record<string, number> = {
  hectare: 1,
  acre: 0.404686,
  bigha: 0.25,          // adjust to your region (1 bigha ≈ 0.25 ha in many Indian states)
  katha: 0.0169,        // adjust
  decimal: 0.00404686,  // 1 decimal = 0.00404686 ha
};

const SOIL_LEVELS = [
  { value: '', label: 'Unknown / Skip' },
  { value: '0', label: 'Low' },
  { value: '1', label: 'Medium' },
  { value: '2', label: 'High' },
];

const STEP_LABELS = ['Select Crop', 'Enter Area', 'Soil Data', 'Results'];

export default function CalculatorClient() {
  const { formatPrice, locale } = useLocale();

  const [crops, setCrops] = useState<CropData[]>([]);
  const [cropsLoading, setCropsLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Form state
  const [selectedCrop, setSelectedCrop] = useState('');
  const [area, setArea] = useState('');
  const [areaUnit, setAreaUnit] = useState('acre');
  const [areaError, setAreaError] = useState('');
  const [soilN, setSoilN] = useState('');
  const [soilP, setSoilP] = useState('');
  const [soilK, setSoilK] = useState('');

  useEffect(() => {
    setCropsLoading(true);
    api.get<{ crops: CropData[] }>('/api/calculator/crops')
      .then(r => {
        setCrops(r.data.crops);
        setCropsLoading(false);
      })
      .catch(() => setCropsLoading(false));
  }, []);

  const selectedCropObj = crops.find(c => c.id === selectedCrop);
  const filteredCrops = crops.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCalculate = async () => {
    if (!selectedCrop || !area || parseFloat(area) <= 0) {
      setError('Please select a crop and enter a valid area.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await api.post<{ result: CalculatorResult }>('/api/calculator/calculate', {
        cropId: selectedCrop,
        area: parseFloat(area),
        areaUnit,
        soilN: soilN ? parseInt(soilN) : 0,
        soilP: soilP ? parseInt(soilP) : 0,
        soilK: soilK ? parseInt(soilK) : 0,
        crops,
      });
      setResult(res.data.result);
      setStep(4);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Calculation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setStep(1);
    setSelectedCrop('');
    setArea('');
    setSoilN('');
    setSoilP('');
    setSoilK('');
    setError('');
    setAreaError('');
  };

  const nextStep = (from: number) => {
    if (from === 1 && !selectedCrop) {
      setError('Please select a crop.');
      return;
    }
    if (from === 2 && (!area || parseFloat(area) <= 0)) {
      setError('Please enter a valid area.');
      return;
    }
    setError('');
    setStep(from + 1);
  };

  // Compute area in hectares for hint
  const areaNum = parseFloat(area);
  const areaInHectares = !isNaN(areaNum) && areaNum > 0
    ? areaNum * AREA_CONVERSION[areaUnit]
    : 0;

  return (
    <PublicLayout showNewsletter>
      <section className="page-hero">
        <div className="container">
          <h1>🧮 Fertilizer Calculator</h1>
          <p>Get precise NPK recommendations for your crop and land</p>
        </div>
      </section>

      <div className="container calc-layout">
        {/* Main column */}
        <div className="calc-main">
          {/* Progress bar (clickable for steps 1‑3) */}
          {step < 4 && (
            <div className="calc-progress">
              {STEP_LABELS.map((label, i) => {
                const num = i + 1;
                const isDone = step > num;
                const isActive = step === num;
                const canGoBack = num < step && num <= 3;
                return (
                  <div
                    key={num}
                    className={`calc-progress__step${isDone ? ' done' : ''}${isActive ? ' active' : ''}`}
                    onClick={() => canGoBack && setStep(num)}
                    style={{ cursor: canGoBack ? 'pointer' : 'default' }}
                  >
                    <div className="calc-progress__dot">{isDone ? '✓' : num}</div>
                    <span>{label}</span>
                  </div>
                );
              })}
            </div>
          )}

          {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

          {/* Step 1 – Select Crop */}
          {step === 1 && (
            <div className="calc-step card">
              <div className="card-header">
                <h2>Step 1: Select Your Crop</h2>
                <p>Choose the crop you want to grow this season</p>
              </div>
              <div className="card-body">
                <input
                  type="text"
                  className="form-control"
                  placeholder="🔍 Search crops..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ marginBottom: 20 }}
                />
                {cropsLoading ? (
                  <div className="skeleton-grid">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="skeleton-crop-btn" />
                    ))}
                  </div>
                ) : (
                  <div className="crop-grid">
                    {filteredCrops.map(crop => (
                      <button
                        key={crop.id}
                        className={`crop-btn ${selectedCrop === crop.id ? 'selected' : ''}`}
                        onClick={() => setSelectedCrop(crop.id)}
                      >
                        <span className="crop-btn__icon">{crop.icon}</span>
                        <span className="crop-btn__name">{crop.name}</span>
                        <span className="crop-btn__season">{crop.season}</span>
                      </button>
                    ))}
                  </div>
                )}
                <div className="calc-nav">
                  <div />
                  <span className='text-small'>select crop → click Next: Enter Area →</span>
                  <button className="btn btn-primary" onClick={() => nextStep(1)}>
                    Next: Enter Area →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 – Area */}
          {step === 2 && (
            <div className="calc-step card">
              <div className="card-header">
                <h2>Step 2: Enter Land Area</h2>
                <p>How much land are you farming?</p>
              </div>
              <div className="card-body">
                {selectedCropObj && (
                  <div className="selected-crop-badge">
                    <span>{selectedCropObj.icon}</span>
                    <span>✅ Selected: <strong>{selectedCropObj.name}</strong></span>
                    <button className="btn-link" onClick={() => setStep(1)}>Change</button>
                  </div>
                )}
                <div className="grid-2">
                  <div className="form-group">
                    <label>Land Area *</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="e.g., 2.5"
                      value={area}
                      min="0.01"
                      step="0.01"
                      onChange={(e) => {
                        const val = e.target.value;
                        setArea(val);
                        if (val && parseFloat(val) > 0) setAreaError('');
                        else if (val !== '') setAreaError('Please enter a positive number');
                        else setAreaError('');
                      }}
                    />
                    {areaError && <div className="alert alert-error" style={{ marginTop: 8 }}>{areaError}</div>}
                    {areaNum > 0 && !areaError && (
                      <div className="area-hint">
                        ≈ {areaNum.toFixed(2)} {areaUnit} = {areaInHectares.toFixed(4)} ha
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Unit of Measurement</label>
                    <select
                      className="form-control"
                      value={areaUnit}
                      onChange={e => setAreaUnit(e.target.value)}
                    >
                      {AREA_UNITS.map(u => (
                        <option key={u.value} value={u.value}>{u.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="calc-nav">
                  <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn btn-primary" onClick={() => nextStep(2)}>Next: Soil Data →</button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 – Soil */}
          {step === 3 && (
            <div className="calc-step card">
              <div className="card-header">
                <h2>Step 3: Soil Nutrient Levels</h2>
                <p>Optional — skip if you don&apos;t have soil test results</p>
              </div>
              <div className="card-body">
                <div className="alert alert-info" style={{ marginBottom: 20 }}>
                  💡 <strong>Tip:</strong> Get your soil tested at your nearest agriculture department for best results.
                </div>
                <div className="grid-3">
                  {[
                    { label: '🟤 Nitrogen (N) Level', val: soilN, set: setSoilN, tooltip: 'Low: < 0.2% organic carbon, Medium: 0.2–0.5%, High: > 0.5%' },
                    { label: '🟡 Phosphorus (P) Level', val: soilP, set: setSoilP, tooltip: 'Low: < 10 kg/ha, Medium: 10–25 kg/ha, High: > 25 kg/ha' },
                    { label: '🟣 Potassium (K) Level', val: soilK, set: setSoilK, tooltip: 'Low: < 50 kg/ha, Medium: 50–100 kg/ha, High: > 100 kg/ha' },
                  ].map(s => (
                    <div key={s.label} className="form-group">
                      <label>
                        {s.label}
                        <span className="tooltip-icon" title={s.tooltip}>ⓘ</span>
                      </label>
                      <select
                        className="form-control"
                        value={s.val}
                        onChange={e => s.set(e.target.value)}
                      >
                        {SOIL_LEVELS.map(l => (
                          <option key={l.value} value={l.value}>{l.label}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                <div className="calc-nav">
                  <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="btn btn-ghost"
                      onClick={() => {
                        setSoilN('');
                        setSoilP('');
                        setSoilK('');
                        handleCalculate();
                      }}
                    >
                      Skip & Calculate
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleCalculate}
                      disabled={loading}
                    >
                      {loading ? '⏳ Calculating...' : '🧮 Calculate Now'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4 – Results */}
          {step === 4 && result && (
            <div className="calc-results">
              <div className="card">
                <div className="card-body">
                  <div className="results-title">
                    <div>
                      <h2>✅ Fertilizer Recommendations</h2>
                      <p>
                        For <strong>{result.crop}</strong> · <strong>{result.area} ha</strong>
                        {result.source && <> · Source: {result.source}</>}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => window.print()}>
                        🖨️ Print
                      </button>
                      <button className="btn btn-outline btn-sm" onClick={handleReset}>
                        🔄 New
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="npk-cards">
                {[
                  ['Nitrogen (N)', result.requiredNPK.n, 'npk-n'],
                  ['Phosphorus (P₂O₅)', result.requiredNPK.p, 'npk-p'],
                  ['Potassium (K₂O)', result.requiredNPK.k, 'npk-k'],
                ].map(([label, val, cls]) => (
                  <div key={label} className={`npk-card ${cls}`}>
                    <div className="npk-card__label">{label}</div>
                    <div className="npk-card__value">{val} kg</div>
                    <div className="npk-card__sub">Total required</div>
                  </div>
                ))}
              </div>

              {result.source && (
                <div className="alert alert-info" style={{ marginTop: 12, fontSize: '0.82rem' }}>
                  📚 <strong>Source:</strong> {result.source}
                  {result.yieldTarget && ` · Target yield: ${result.yieldTarget}`}
                </div>
              )}

              <AdSlot slot="belowCalculator" style={{ margin: '16px 0' }} />

              <div className="card" style={{ marginTop: 16 }}>
                <div className="card-header"><h3>📦 Recommended Fertilizers</h3></div>
                <div className="table-responsive rec-table-desktop">
                  <table>
                    <thead>
                      <tr>
                        <th>Fertilizer</th>
                        <th>Total Qty</th>
                        <th>Per Hectare</th>
                        <th>Est. Cost ({locale.currency})</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.recommendations.map((r, i) => (
                        <tr key={i}>
                          <td><strong>{r.fertilizer}</strong></td>
                          <td><span className="badge badge-green">{r.requiredKg} kg</span></td>
                          <td style={{ color: 'var(--stone)', fontSize: '0.82rem' }}>{r.perHa} kg/ha</td>
                          <td>{formatPrice(r.costUSD)}</td>
                        </tr>
                      ))}
                      <tr className="total-row">
                        <td><strong>Total Estimated Cost</strong></td>
                        <td />
                        <td />
                        <td><strong>{formatPrice(result.totalCostUSD)}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards view */}
                <div className="rec-cards-mobile">
                  {result.recommendations.map((r, i) => (
                    <div key={i} className="rec-card">
                      <div className="rec-card__name">
                        <div className="rec-card__num">{i + 1}</div>
                        <strong>{r.fertilizer}</strong>
                      </div>
                      <div className="rec-card__stats">
                        <div className="rec-card__stat">
                          <span className="rec-card__stat-label">Total</span>
                          <span className="rec-card__stat-val">{r.requiredKg} kg</span>
                        </div>
                        <div className="rec-card__stat">
                          <span className="rec-card__stat-label">Per ha</span>
                          <span className="rec-card__stat-val">{r.perHa} kg</span>
                        </div>
                        <div className="rec-card__stat">
                          <span className="rec-card__stat-label">Cost</span>
                          <span className="rec-card__stat-val rec-card__cost">{formatPrice(r.costUSD)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="rec-card rec-card--total">
                    <strong>Total Estimated Cost</strong>
                    <span className="rec-card__cost">{formatPrice(result.totalCostUSD)}</span>
                  </div>
                </div>
              </div>

              {result.applicationSchedule?.length > 0 && (
                <div className="card" style={{ marginTop: 16 }}>
                  <div className="card-header"><h3>📅 Application Schedule</h3></div>
                  <div className="card-body">
                    {result.applicationSchedule.map((s, i) => (
                      <div key={i} className="schedule-row">
                        <div className="schedule-row__timing">
                          <span className="schedule-row__dot">{i + 1}</span>
                          <strong>{s.timing}</strong>
                        </div>
                        <div className="schedule-row__share">{s.share}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="alert alert-warning" style={{ marginTop: 16 }}>
                ⚠️ <strong>Disclaimer:</strong> {result.disclaimer}
              </div>
              {result.priceNote && (
                <div className="alert alert-info" style={{ marginTop: 8, fontSize: '0.8rem' }}>
                  💱 {result.priceNote}
                </div>
              )}

              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <button className="btn btn-primary btn-lg" onClick={handleReset}>
                  🔄 Calculate for Another Crop
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="calc-sidebar">
          <AdSlot slot="sidebar" />
          <WeatherWidget />
          <div className="card sidebar-card">
            <div className="card-body">
              <h3>💡 Quick Tips</h3>
              <ul className="tips-list">
                <li>Test your soil every 2–3 years</li>
                <li>Split N application for better uptake</li>
                <li>Apply P and K as basal dose</li>
                <li>Use organic matter to improve soil</li>
                <li>Monitor crop at 30 and 60 DAS</li>
              </ul>
            </div>
          </div>
          <div className="card sidebar-card">
            <div className="card-body">
              <h3>🌱 Also Try</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Link href="/seed-calculator" className="btn btn-ghost btn-sm">🌱 Seed Rate Calculator</Link>
                <Link href="/calendar" className="btn btn-ghost btn-sm">📅 Crop Calendar</Link>
                <Link href="/pest-guide" className="btn btn-ghost btn-sm">💊 Pest Guide</Link>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </PublicLayout>
  );
}