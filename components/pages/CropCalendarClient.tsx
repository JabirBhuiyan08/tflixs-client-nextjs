'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdSlot from '@/components/layout/AdSlot';
import PublicLayout from '@/components/layout/PublicLayout';
import './CropCalendar.css';

const MONTHS      = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTH_FULL  = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const CATEGORIES  = ['All','Cereal','Vegetable','Legume','Oilseed','Cash Crop','Fiber','Fruit'];

interface CropEntry {
  name:     string;
  icon:     string;
  category: string;
  sow:      number[];
  grow:     number[];
  harvest:  number[];
  notes:    string;
  npk:      string;
  slug?:    string;
}

const CROP_CALENDAR: CropEntry[] = [
  { name:'Rice (Kharif)',  icon:'🌾', category:'Cereal',    slug:'rice',      sow:[5,6],                           grow:[7,8,9],                        harvest:[10,11],               notes:'Main season rice. Transplant 25–30 days after nursery sowing.',   npk:'N:120 P:60 K:60 kg/ha'  },
  { name:'Rice (Boro)',    icon:'🌾', category:'Cereal',    slug:'rice',      sow:[11,12],                         grow:[1,2,3],                        harvest:[4,5],                 notes:'Winter/dry season rice. Requires irrigation.',                    npk:'N:150 P:60 K:60 kg/ha'  },
  { name:'Wheat',          icon:'🌿', category:'Cereal',    slug:'wheat',     sow:[11,12],                         grow:[1,2],                          harvest:[3,4],                 notes:'Sow after rice harvest. Cool dry weather needed.',                npk:'N:120 P:60 K:40 kg/ha'  },
  { name:'Maize',          icon:'🌽', category:'Cereal',    slug:'maize',     sow:[3,4,5],                         grow:[5,6,7],                        harvest:[7,8],                 notes:'Can be grown year-round. Needs well-drained soil.',               npk:'N:150 P:75 K:50 kg/ha'  },
  { name:'Potato',         icon:'🥔', category:'Vegetable', slug:'potato',    sow:[10,11],                         grow:[11,12,1],                      harvest:[2,3],                 notes:'Cool season crop. Plant certified seed potatoes.',                npk:'N:180 P:100 K:200 kg/ha' },
  { name:'Tomato',         icon:'🍅', category:'Vegetable', slug:'tomato',    sow:[10,11],                         grow:[12,1,2],                       harvest:[2,3,4],               notes:'Start in nursery, transplant at 30 days. Stake plants.',          npk:'N:120 P:60 K:120 kg/ha' },
  { name:'Onion',          icon:'🧅', category:'Vegetable', slug:'onion',     sow:[10,11],                         grow:[12,1,2],                       harvest:[3,4],                 notes:'Stop irrigation 2 weeks before harvest for curing.',              npk:'N:100 P:50 K:100 kg/ha' },
  { name:'Garlic',         icon:'🧄', category:'Vegetable',                   sow:[10,11],                         grow:[12,1,2],                       harvest:[3,4],                 notes:'Plant cloves 5cm deep. Well-drained fertile soil.',               npk:'N:100 P:50 K:100 kg/ha' },
  { name:'Mustard',        icon:'🌼', category:'Oilseed',   slug:'mustard',   sow:[10,11],                         grow:[11,12],                        harvest:[1,2],                 notes:'Short duration crop (90–100 days). Aphid management important.',  npk:'N:80 P:40 K:40 kg/ha'   },
  { name:'Cotton',         icon:'🌱', category:'Fiber',     slug:'cotton',    sow:[4,5,6],                         grow:[6,7,8,9],                      harvest:[10,11,12],            notes:'Long duration crop. Regular pest scouting essential.',            npk:'N:120 P:60 K:60 kg/ha'  },
  { name:'Sugarcane',      icon:'🎋', category:'Cash Crop', slug:'sugarcane', sow:[2,3,4],                         grow:[4,5,6,7,8,9,10,11],            harvest:[12,1,2],              notes:'Annual crop. Ratoon crop possible for 2–3 seasons.',              npk:'N:250 P:100 K:150 kg/ha'},
  { name:'Groundnut',      icon:'🥜', category:'Legume',    slug:'groundnut', sow:[6,7],                           grow:[7,8,9],                        harvest:[10,11],               notes:'Fixes nitrogen. Good for crop rotation with cereals.',            npk:'N:25 P:50 K:75 kg/ha'   },
  { name:'Soybean',        icon:'🫘', category:'Legume',    slug:'soybean',   sow:[6,7],                           grow:[7,8,9],                        harvest:[10,11],               notes:'Nitrogen-fixing legume. Inoculate seeds with Rhizobium.',         npk:'N:30 P:80 K:40 kg/ha'   },
  { name:'Banana',         icon:'🍌', category:'Fruit',     slug:'banana',    sow:[1,2,3,4,5,6,7,8,9,10,11,12],  grow:[1,2,3,4,5,6,7,8,9,10,11,12],  harvest:[1,2,3,4,5,6,7,8,9,10,11,12], notes:'Year-round crop. Harvests 10–14 months after planting.', npk:'N:200 P:60 K:300 kg/ha' },
  { name:'Chilli',         icon:'🌶️', category:'Vegetable',                   sow:[10,11,6,7],                     grow:[12,1,2,8,9],                   harvest:[2,3,4,10,11],         notes:'Two seasons possible. Thrips and mites major pests.',             npk:'N:120 P:60 K:60 kg/ha'  },
];

const getCellType = (crop: CropEntry, idx: number): string => {
  const m = idx + 1;
  if (crop.harvest.includes(m)) return 'harvest';
  if (crop.grow.includes(m))    return 'grow';
  if (crop.sow.includes(m))     return 'sow';
  return '';
};

export default function CropCalendarClient() {
  const [category, setCategory] = useState('All');
  const [search,   setSearch]   = useState('');
  const [selected, setSelected] = useState<CropEntry | null>(null);
  const currentMonth = new Date().getMonth(); // 0-indexed

  const filtered = CROP_CALENDAR.filter(c =>
    (category === 'All' || c.category === category) &&
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PublicLayout>
      <section className="page-hero">
        <div className="container">
          <h1>📅 Crop Calendar</h1>
          <p>Planting and harvesting schedules for 15+ crops</p>
        </div>
      </section>

      <div className="container section-sm">
        <AdSlot slot="header" style={{ marginBottom: 24 }} />

        <div className="calendar-controls">
          <input type="text" className="form-control" placeholder="🔍 Search crops..."
            value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 260 }} />
          <div className="calendar-cats">
            {CATEGORIES.map(cat => (
              <button key={cat} className={`cat-btn ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}>{cat}</button>
            ))}
          </div>
        </div>

        <div className="calendar-legend">
          <span className="legend-item"><span className="legend-dot sow" />Sow / Plant</span>
          <span className="legend-item"><span className="legend-dot grow" />Growing</span>
          <span className="legend-item"><span className="legend-dot harvest" />Harvest</span>
          <span className="legend-item"><span className="legend-dot current" />Current Month</span>
        </div>

        <div className="calendar-wrap card">
          <div className="table-responsive">
            <table className="calendar-table">
              <thead>
                <tr>
                  <th className="calendar-crop-col">Crop</th>
                  {MONTHS.map((m, i) => (
                    <th key={m} className={`calendar-month-col ${i === currentMonth ? 'current-month' : ''}`}>{m}</th>
                  ))}
                  <th className="calendar-npk">NPK</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(crop => (
                  <tr key={crop.name}
                    className={selected?.name === crop.name ? 'selected-row' : ''}
                    onClick={() => setSelected(selected?.name === crop.name ? null : crop)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className="calendar-crop-name">
                      <span>{crop.icon}</span>
                      <div>
                        <strong>{crop.name}</strong>
                        <span className="crop-category">{crop.category}</span>
                      </div>
                    </td>
                    {MONTHS.map((m, i) => {
                      const type = getCellType(crop, i);
                      return (
                        <td key={m} className={`calendar-cell ${type} ${i === currentMonth ? 'current-month-col' : ''}`}>
                          {type === 'sow'     && <span title="Sow/Plant">🌱</span>}
                          {type === 'grow'    && <span title="Growing">🌿</span>}
                          {type === 'harvest' && <span title="Harvest">✂️</span>}
                        </td>
                      );
                    })}
                    <td className="calendar-npk">{crop.npk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <div className="calendar-detail card" style={{ marginTop: 20 }}>
            <div className="card-body">
              <div className="calendar-detail__header" style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16, flexWrap:'wrap' }}>
                <span style={{ fontSize:'2rem' }}>{selected.icon}</span>
                <div style={{ flex:1 }}>
                  <h3 style={{ marginBottom:6 }}>{selected.name}</h3>
                  <span className="badge badge-green">{selected.category}</span>
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => setSelected(null)}>✕ Close</button>
              </div>
              <div className="calendar-detail__body" style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 }}>
                <div><strong>📝 Notes</strong><p style={{ marginTop:6, fontSize:'0.88rem', color:'var(--stone)' }}>{selected.notes}</p></div>
                <div><strong>🧪 NPK Requirement</strong><p style={{ marginTop:6, fontSize:'0.88rem', color:'var(--stone)' }}>{selected.npk}</p></div>
                <div><strong>🌱 Sow / Plant</strong><p style={{ marginTop:6, fontSize:'0.88rem', color:'var(--stone)' }}>{selected.sow.map(m => MONTH_FULL[m-1]).join(', ')}</p></div>
                <div><strong>✂️ Harvest</strong><p style={{ marginTop:6, fontSize:'0.88rem', color:'var(--stone)' }}>{selected.harvest.map(m => MONTH_FULL[m-1]).join(', ')}</p></div>
              </div>
              {selected.slug && (
                <div style={{ marginTop:20 }}>
                  <Link href={`/calculator/${selected.slug}`} className="btn btn-primary">
                    🧮 Calculate Fertilizer for {selected.name}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        <AdSlot slot="belowCalculator" style={{ marginTop: 32 }} />
      </div>
    </PublicLayout>
  );
}
