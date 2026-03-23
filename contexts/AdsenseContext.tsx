'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import type { AdsenseConfig, AdsenseContextType } from '@/types';

const AdsenseContext = createContext<AdsenseContextType>({ config: null });

export const useAdsense = (): AdsenseContextType => useContext(AdsenseContext);

export function AdsenseProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AdsenseConfig | null>(null);

  useEffect(() => {
    api.get<{ config: AdsenseConfig }>('/api/adsense')
      .then(res => {
        const c = res.data.config;
        setConfig(c);
        if (c?.enabled && c?.publisherId) {
          const existing = document.querySelector('script[data-adsense]');
          if (!existing) {
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${c.publisherId}`;
            script.crossOrigin = 'anonymous';
            script.setAttribute('data-adsense', 'true');
            document.head.appendChild(script);
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <AdsenseContext.Provider value={{ config }}>
      {children}
    </AdsenseContext.Provider>
  );
}
