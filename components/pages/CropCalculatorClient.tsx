'use client';
import { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useLocale } from '@/contexts/LocaleContext';
import PublicLayout from '@/components/layout/PublicLayout';
import AdSlot from '@/components/layout/AdSlot';
import WeatherWidget from '@/components/layout/WeatherWidget';
import type { Crop, CalculatorResult } from '@/types';

const AREA_UNITS = [
  { value: 'hectare', label: 'Hectare (ha)' }, { value: 'acre', label: 'Acre' },
  { value: 'bigha', label: 'Bigha' }, { value: 'katha', label: 'Katha' },
];
const SOIL = ['Unknown / Skip','Low','Medium','High'];

export default function CropCalculatorClient({ crop }: { crop: Crop }) {
  const { t, formatPrice, locale } = useLocale();
  const [area, setArea] = useState('');
  const [unit, setUnit] = useState('acre');
  const [soilN, setSoilN] = useState('');
  const [soilP, setSoilP] = useState('');
  const [soilK, setSoilK] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState('');

  const calc = async () => {
    if (!area || parseFloat(area) <= 0) { setError('Please enter a valid area.'); return; }
    setError(''); setLoading(true);
    try {
      const crops = [{ id: crop.id, name: crop.fullName, npkRequirement: crop.npk, season: crop.season, source: crop.source, yieldTarget: crop.yield }];
      const res = await api.post<{ result: CalculatorResult }>('/api/calculator/calculate', {
        cropId: crop.id, area: parseFloat(area), areaUnit: unit,
        soilN: soilN ? parseInt(soilN) : 0, soilP: soilP ? parseInt(soilP) : 0, soilK: soilK ? parseInt(soilK) : 0, crops,
      });
      setResult(res.data.result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Calculation failed.');
    } finally { setLoading(false); }
  };

  return (
    <PublicLayout showNewsletter>
      <section className="page-hero">
        <div className="container">
          <nav style={{ fontSize: '0.82rem', opacity: 0.8, marginBottom: 12 }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.8)' }}>Home</Link>{' › '}
            <Link href="/calculator" style={{ color: 'rgba(255,255,255,0.8)' }}>Calculator</Link>{' › '}
            <span>{crop.name}</span>
          </nav>
          <h1>{crop.icon} {crop.name} Fertilizer Calculator</h1>
          <p>Based on {crop.source} · Target yield: {crop.yield}</p>
        </div>
      </section>
      <div className="container calc-layout">
        <div className="calc-main">
          <AdSlot slot="header" style={{ marginBottom: 20 }} />
          {error && <div className="alert alert-error">{error}</div>}
          {!result ? (
            <div className="card">
              <div className="card-header"><h2>Calculate for {crop.name}</h2></div>
              <div className="card-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label>Land Area *</label>
                    <input type="number" className="form-control" placeholder="e.g. 2.5" value={area} onChange={e => setArea(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Unit</label>
                    <select className="form-control" value={unit} onChange={e => setUnit(e.target.value)}>
                      {AREA_UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid-3">
                  {[['N',soilN,setSoilN],['P',soilP,setSoilP],['K',soilK,setSoilK]].map(([n,v,s]) => (
                    <div key={String(n)} className="form-group">
                      <label>{String(n)} Level</label>
                      <select className="form-control" value={String(v)} onChange={e => (s as React.Dispatch<React.SetStateAction<string>>)(e.target.value)}>
                        {SOIL.map((l,i) => <option key={i} value={i===0?'':String(i-1)}>{l}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <button className="btn btn-primary btn-lg" onClick={calc} disabled={loading} style={{width:'100%',justifyContent:'center'}}>
                  {loading ? t('calculating') : t('calculate')}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="npk-cards">
                {([['Nitrogen (N)', result.requiredNPK.n,'npk-n'],['Phosphorus (P₂O₅)',result.requiredNPK.p,'npk-p'],['Potassium (K₂O)',result.requiredNPK.k,'npk-k']] as [string,number,string][]).map(([label,val,cls])=>(
                  <div key={label} className={`npk-card ${cls}`}>
                    <div className="npk-card__label">{label}</div>
                    <div className="npk-card__value">{val} kg</div>
                  </div>
                ))}
              </div>
              <div className="card" style={{marginTop:16}}>
                <div className="table-responsive">
                  <table>
                    <thead><tr><th>Fertilizer</th><th>Qty</th><th>Cost ({locale.currency})</th></tr></thead>
                    <tbody>
                      {result.recommendations.map((r,i)=>(
                        <tr key={i}><td><strong>{r.fertilizer}</strong></td><td>{r.requiredKg} kg</td><td>{formatPrice(r.costUSD)}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="alert alert-warning" style={{marginTop:12,fontSize:'0.82rem'}}>⚠️ {result.disclaimer}</div>
              <button className="btn btn-outline" onClick={()=>setResult(null)} style={{marginTop:16}}>🔄 Recalculate</button>
            </div>
          )}
        </div>
        <aside className="calc-sidebar">
          <AdSlot slot="sidebar" />
          <WeatherWidget />
          <div className="card sidebar-card">
            <div className="card-body">
              <h3>Other Calculators</h3>
              {['rice','wheat','maize','tomato'].filter(s=>s!==crop.slug).map(s=>(
                <Link key={s} href={`/calculator/${s}`} className="btn btn-outline btn-sm" style={{display:'block',marginBottom:8,textTransform:'capitalize'}}>{s} →</Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </PublicLayout>
  );
}
