'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { toast } from 'react-toastify';
import api from '@/lib/api';
import './AdminLayout.css';

interface AdUnit { enabled: boolean; adSlot: string; }
interface AdsenseForm {
  enabled:     boolean;
  publisherId: string;
  adUnits:     Record<string, AdUnit>;
}

const DEFAULT_UNITS: Record<string, AdUnit> = {
  header:          { enabled: false, adSlot: '' },
  sidebar:         { enabled: false, adSlot: '' },
  inArticle:       { enabled: false, adSlot: '' },
  belowCalculator: { enabled: false, adSlot: '' },
};

const DEFAULT: AdsenseForm = { enabled: false, publisherId: '', adUnits: DEFAULT_UNITS };

export default function AdminAdsense() {
  const [form,     setForm]     = useState<AdsenseForm>(DEFAULT);
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    api.get<{ config: AdsenseForm }>('/api/adsense')
      .then(res => { if (res.data.config) setForm({ ...DEFAULT, ...res.data.config, adUnits: { ...DEFAULT_UNITS, ...(res.data.config.adUnits ?? {}) } }); })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  const handleGlobal = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleUnit = (slot: string, field: keyof AdUnit, value: string | boolean) => {
    setForm(prev => ({
      ...prev,
      adUnits: { ...prev.adUnits, [slot]: { ...prev.adUnits[slot], [field]: value } },
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/adsense', form);
      toast.success('AdSense settings saved!');
    } catch { toast.error('Failed to save'); }
    finally { setLoading(false); }
  };

  if (fetching) return <div className="spinner" />;

  return (
    <div>
      <div className="admin-page-header"><h1>💰 Google AdSense</h1></div>
      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header"><h3>Global Settings</h3></div>
          <div className="card-body">
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', marginBottom: 20, fontSize: '0.95rem' }}>
              <input type="checkbox" name="enabled" checked={form.enabled} onChange={handleGlobal}
                style={{ width: 18, height: 18, accentColor: 'var(--forest-mid)' }} />
              <strong>Enable Google AdSense</strong>
            </label>
            <div className="form-group">
              <label>Publisher ID</label>
              <input type="text" name="publisherId" className="form-control"
                placeholder="ca-pub-XXXXXXXXXXXXXXXX" value={form.publisherId} onChange={handleGlobal} />
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header"><h3>Ad Units</h3></div>
          <div className="card-body">
            {Object.entries(form.adUnits).map(([slot, unit]) => (
              <div key={slot} style={{ padding: '16px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', margin: 0 }}>
                    <input type="checkbox" checked={unit.enabled}
                      onChange={e => handleUnit(slot, 'enabled', e.target.checked)}
                      style={{ width: 16, height: 16, accentColor: 'var(--forest-mid)' }} />
                    <strong style={{ textTransform: 'capitalize' }}>
                      {slot.replace(/([A-Z])/g, ' $1').trim()}
                    </strong>
                  </label>
                </div>
                <input type="text" className="form-control" placeholder="Ad slot ID (e.g. 1234567890)"
                  value={unit.adSlot} disabled={!unit.enabled}
                  onChange={e => handleUnit(slot, 'adSlot', e.target.value)}
                  style={{ maxWidth: 300, opacity: unit.enabled ? 1 : 0.5 }} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '⏳ Saving…' : '💾 Save AdSense Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
