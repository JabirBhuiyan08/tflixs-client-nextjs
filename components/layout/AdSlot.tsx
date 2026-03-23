'use client';

import { useEffect, useRef } from 'react';
import { useAdsense } from '@/contexts/AdsenseContext';

interface Props {
  slot:      string;
  format?:   string;
  style?:    React.CSSProperties;
  className?: string;
}

declare global {
  interface Window { adsbygoogle: unknown[]; }
}

export default function AdSlot({ slot, format = 'auto', style, className = '' }: Props) {
  const { config } = useAdsense();
  const pushed = useRef(false);

  useEffect(() => {
    if (!config?.enabled || !config?.publisherId || pushed.current) return;
    const unit = config?.adUnits?.[slot];
    if (!unit?.enabled || !unit?.adSlot) return;
    try {
      pushed.current = true;
      (window.adsbygoogle = window.adsbygoogle ?? []).push({});
    } catch { /* noop */ }
  }, [config, slot]);

  if (!config?.enabled || !config?.publisherId) {
    return (
      <div className={`ad-slot ${className}`} style={{ minHeight: 90, ...style }}>
        <span>Ad Space ({slot})</span>
      </div>
    );
  }

  const unit = config?.adUnits?.[slot];
  if (!unit?.enabled || !unit?.adSlot) return null;

  return (
    <div className={className} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={config.publisherId}
        data-ad-slot={unit.adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
