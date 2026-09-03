'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, ShieldCheck, RefreshCw } from 'lucide-react';
import { formatIstDateTime } from '@/lib/date';

interface HeaderProps {
  onMenuToggle?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function Header({
  onMenuToggle,
  onRefresh,
  isRefreshing = false,
}: HeaderProps) {
  const [currentIstTime, setCurrentIstTime] = useState<string>('');

  useEffect(() => {
    // Update live IST time
    const updateTime = () => {
      setCurrentIstTime(formatIstDateTime(new Date()));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      style={{
        height: '64px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Left side: Mobile Menu Toggle & Brand for Mobile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          onClick={onMenuToggle}
          aria-label="Open mobile navigation"
          className="mobile-menu-trigger"
          style={{
            display: 'none',
            padding: '8px',
            borderRadius: '6px',
            color: 'var(--navy-primary)',
            backgroundColor: 'var(--bg-surface-subtle)',
          }}
        >
          <Menu size={20} />
        </button>

        <div className="mobile-brand-logo" style={{ display: 'none' }}>
          <Image
            src="/images/noblecare4u-logo.webp"
            alt="Noblecare4u"
            width={110}
            height={24}
            priority
            style={{ objectFit: 'contain', height: 'auto' }}
          />
        </div>

        {/* Live IST indicator */}
        <div
          className="ist-badge"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            backgroundColor: 'var(--bg-surface-subtle)',
            padding: '4px 12px',
            borderRadius: '16px',
            border: '1px solid var(--border-light)',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
            }}
          />
          <span>IST: {currentIstTime || 'Connecting...'}</span>
        </div>
      </div>

      {/* Right side: Operations Badge + Refresh Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Operations Scope Indicator */}
        <div
          className="header-ops-badge"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '16px',
            backgroundColor: 'var(--care-blue-subtle)',
            border: '1px solid #bfdbfe',
            fontSize: '0.78rem',
            color: 'var(--care-blue)',
            fontWeight: 600,
          }}
        >
          <ShieldCheck size={14} />
          <span>Noblecare4u Operations</span>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Refresh dashboard data"
            title="Refresh dashboard data"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-light)',
              backgroundColor: '#ffffff',
              color: 'var(--navy-primary)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: isRefreshing ? 'wait' : 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <RefreshCw
              size={15}
              style={{
                animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
              }}
            />
            <span className="refresh-text">Refresh</span>
          </button>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 1024px) {
          .mobile-menu-trigger {
            display: flex !important;
          }
          .mobile-brand-logo {
            display: flex !important;
          }
        }
        @media (max-width: 640px) {
          .ist-badge {
            display: none !important;
          }
          .refresh-text {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
