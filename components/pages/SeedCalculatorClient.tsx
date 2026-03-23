'use client';
import React, { useState } from 'react';
import Head from 'next/head';
import PublicLayout from '@/components/layout/PublicLayout';
import AdSlot from '@/components/layout/AdSlot';

// Define the crop data keys
type CropKey = keyof typeof CROP_DATA;

// ---------- Data ----------
const CROP_DATA = {
  rice: {
    name: 'Rice', icon: '🌾', method: 'Transplanting (Nursery)',
    seedRateKgPerHa: 20, spacing: '20×15 cm',
    notes: 'For direct seeding use 80‑100 kg/ha.',
  },
  wheat: {
    name: 'Wheat', icon: '🌾', method: 'Drilling',
    seedRateKgPerHa: 100, spacing: '22.5 cm row spacing',
    notes: 'Adjust for late sowing (increase by 10‑15%).',
  },
  maize: {
    name: 'Maize', icon: '🌽', method: 'Ridges / Furrows',
    seedRateKgPerHa: 20, spacing: '60×25 cm',
    notes: 'Use 25‑30 kg/ha for high‑density planting.',
  },
  potato: {
    name: 'Potato', icon: '🥔', method: 'Tuber planting',
    seedRateKgPerHa: 2000, spacing: '60×25 cm',
    notes: 'Use disease‑free certified seed tubers.',
  },
  soybean: {
    name: 'Soybean', icon: '🫘', method: 'Drilling',
    seedRateKgPerHa: 70, spacing: '45×10 cm',
    notes: 'Inoculate with Rhizobium for better yield.',
  },
  groundnut: {
    name: 'Groundnut', icon: '🥜', method: 'Drilling',
    seedRateKgPerHa: 100, spacing: '30×10 cm',
    notes: 'Use kernels (peeled) for planting.',
  },
  mustard: {
    name: 'Mustard', icon: '🌼', method: 'Broadcasting / Drilling',
    seedRateKgPerHa: 4, spacing: '30×15 cm (drilling)',
    notes: 'Higher rate for broadcasting (5‑6 kg/ha).',
  },
  cotton: {
    name: 'Cotton', icon: '🌱', method: 'Ridges / Flat sowing',
    seedRateKgPerHa: 20, spacing: '90×45 cm',
    notes: 'Use delinted seeds for uniform germination.',
  },
  onion: {
    name: 'Onion', icon: '🧅', method: 'Transplanting',
    seedRateKgPerHa: 8, spacing: '15×10 cm',
    notes: 'For bulb production.',
  },
};

const UNIT_OPTIONS = ['Hectare (ha)', 'Acre', 'Square Meter (m²)'] as const;
type Unit = typeof UNIT_OPTIONS[number];

const AREA_CONVERSION: Record<Unit, number> = {
  'Hectare (ha)': 1,
  'Acre': 0.404686,
  'Square Meter (m²)': 0.0001,
};

// ---------- Component ----------
const SeedCalculator = () => {
  const [crop, setCrop] = useState<CropKey>('rice');
  const [areaValue, setAreaValue] = useState('1');
  const [areaUnit, setAreaUnit] = useState<Unit>('Hectare (ha)');
  const [customRate, setCustomRate] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  const cropData = CROP_DATA[crop];
  const standardRate = cropData.seedRateKgPerHa;
  const finalRate = useCustom && customRate ? parseFloat(customRate) : standardRate;

  const areaInHectares = parseFloat(areaValue) * AREA_CONVERSION[areaUnit];
  let seedNeeded = 0;
  if (!isNaN(areaInHectares) && areaInHectares > 0 && !isNaN(finalRate) && finalRate > 0) {
    seedNeeded = areaInHectares * finalRate;
  }

  const isAreaValid = areaValue !== '' && !isNaN(parseFloat(areaValue)) && parseFloat(areaValue) > 0;
  const isRateValid = !useCustom || (customRate !== '' && !isNaN(parseFloat(customRate)) && parseFloat(customRate) > 0);

  return (
    <PublicLayout>
      <Head>
        <title>Seed Calculator – Estimate Seed Requirement | Tflixs</title>
        <meta
          name="description"
          content="Calculate how much seed you need for any crop based on area and planting method. Free tool for farmers."
        />
        <meta name="keywords" content="seed calculator, seed rate, planting, farming, crop calculator" />
      </Head>

      <section className="page-hero">
        <div className="container">
          <h1>🌾 Seed Calculator</h1>
          <p>Calculate seed requirement for your field — save money and avoid waste.</p>
        </div>
      </section>

      <div className="container section-sm">
        <AdSlot slot="header" style={{ marginBottom: 24 }} />

        {/* Main card */}
        <div
          className="card"
          style={{
            borderRadius: '24px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.02)',
            border: 'none',
          }}
        >
          <div className="card-body" style={{ padding: '2rem' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '2rem',
              }}
            >
              {/* Left column - inputs */}
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>
                    🌾 Crop
                  </label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value as CropKey)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#fff',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    {(Object.entries(CROP_DATA) as [CropKey, typeof CROP_DATA[CropKey]][]).map(([key, val]) => (
                      <option key={key} value={key}>
                        {val.icon} {val.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>
                    📏 Field Area
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="number"
                      value={areaValue}
                      onChange={(e) => setAreaValue(e.target.value)}
                      placeholder="e.g., 2.5"
                      step="any"
                      style={{
                        flex: 1,
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        fontSize: '1rem',
                      }}
                    />
                    <select
                      value={areaUnit}
                      onChange={(e) => setAreaUnit(e.target.value as Unit)}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#fff',
                        fontSize: '1rem',
                      }}
                    >
                      {UNIT_OPTIONS.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>
                    🌱 Seeding Rate
                  </label>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={useCustom}
                        onChange={(e) => setUseCustom(e.target.checked)}
                        style={{ width: '1.2rem', height: '1.2rem' }}
                      />
                      <span>Use custom seed rate</span>
                    </label>
                  </div>

                  {useCustom ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="number"
                        value={customRate}
                        onChange={(e) => setCustomRate(e.target.value)}
                        placeholder="kg per hectare"
                        step="any"
                        style={{
                          flex: 1,
                          padding: '0.75rem 1rem',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          fontSize: '1rem',
                        }}
                      />
                      <span style={{ color: '#64748b' }}>kg/ha</span>
                    </div>
                  ) : (
                    <div
                      style={{
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        padding: '0.75rem 1rem',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <div>
                        Recommended: <strong>{standardRate} kg/ha</strong> (for {cropData.method})
                      </div>
                      {cropData.notes && (
                        <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.25rem' }}>
                          {cropData.notes}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right column - result */}
              <div>
                <div
                  style={{
                    backgroundColor: '#f0fdf4',
                    borderRadius: '24px',
                    padding: '1.5rem',
                    border: '1px solid #bbf7d0',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    📊 Your Result
                  </h3>

                  {!isAreaValid ? (
                    <div className="alert alert-warning">Please enter a valid positive area.</div>
                  ) : !isRateValid ? (
                    <div className="alert alert-warning">Please enter a valid custom seed rate.</div>
                  ) : (
                    <>
                      <div
                        style={{
                          fontSize: '3rem',
                          fontWeight: 700,
                          color: '#166534',
                          marginBottom: '0.5rem',
                          lineHeight: 1,
                        }}
                      >
                        {seedNeeded.toFixed(2)}{' '}
                        <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#15803d' }}>kg</span>
                      </div>
                      <hr style={{ margin: '1rem 0' }} />
                      <div style={{ display: 'grid', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 500, color: '#374151' }}>Crop</span>
                          <span>
                            {cropData.icon} {cropData.name}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 500, color: '#374151' }}>Area</span>
                          <span>
                            {areaValue} {areaUnit} = {areaInHectares.toFixed(4)} ha
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 500, color: '#374151' }}>Seed rate</span>
                          <span>{finalRate} kg/ha</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 500, color: '#374151' }}>Method</span>
                          <span>{cropData.method}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 500, color: '#374151' }}>Spacing</span>
                          <span>{cropData.spacing}</span>
                        </div>
                      </div>

                      {cropData.notes && (
                        <div
                          style={{
                            marginTop: '1rem',
                            fontSize: '0.85rem',
                            padding: '0.75rem',
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            color: '#475569',
                          }}
                        >
                          💡 <strong>Note:</strong> {cropData.notes}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help card */}
        <div
          className="card mt-4"
          style={{
            borderRadius: '20px',
            border: 'none',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.05)',
          }}
        >
          <div className="card-body" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>
              📖 How to use this calculator
            </h3>
            <ul style={{ marginLeft: '1.25rem', marginBottom: '1rem', color: '#334155' }}>
              <li>Select your crop – the recommended seed rate and planting method are shown.</li>
              <li>Enter the field area. You can use hectares, acres, or square meters.</li>
              <li>
                If you have your own seeding rate (e.g., for different varieties), check “Use custom seed rate” and
                enter the value in kg per hectare.
              </li>
              <li>The result shows exactly how many kg of seed you need.</li>
            </ul>
            <p className="text-muted small" style={{ color: '#64748b', fontSize: '0.75rem' }}>
              * Rates are general recommendations. Consult local agricultural extension services for variety‑specific
              advice.
            </p>
          </div>
        </div>

        <AdSlot slot="belowCalculator" style={{ marginTop: 32 }} />
      </div>
    </PublicLayout>
  );
};

export default SeedCalculator;