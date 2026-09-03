'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Menu, LogOut, Shield, RefreshCw } from 'lucide-react';
import { formatIstDateTime } from '@/lib/date';

interface HeaderProps {
  adminEmail?: string;
  onMenuToggle?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function Header({
  adminEmail = 'admin@noblecare4u.com',
  onMenuToggle,
  onRefresh,
  isRefreshing = false,
}: HeaderProps) {
  const router = useRouter();
  const [currentIstTime, setCurrentIstTime] = useState<string>('');
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  useEffect(() => {
    // Update live IST time
    const updateTime = () => {
      setCurrentIstTime(formatIstDateTime(new Date()));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch {
      router.push('/login');
    }
  };

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

      {/* Right side: Refresh + Admin Profile + Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Refresh leads data"
            title="Refresh dashboard data"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid var(--border-light)',
              backgroundColor: '#ffffff',
              color: 'var(--text-secondary)',
              cursor: isRefreshing ? 'wait' : 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <RefreshCw
              size={16}
              style={{
                animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
              }}
            />
          </button>
        )}

        {/* Admin User Chip */}
        <div
          className="admin-profile-chip"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: '20px',
            backgroundColor: 'var(--bg-surface-subtle)',
            border: '1px solid var(--border-light)',
            fontSize: '0.84rem',
            color: 'var(--navy-primary)',
            fontWeight: 500,
          }}
        >
          <Shield size={14} color="var(--care-blue)" />
          <span className="admin-email-text">{adminEmail}</span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          aria-label="Log out of lead dashboard"
          title="Log out"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '8px',
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            fontSize: '0.84rem',
            fontWeight: 600,
            cursor: isLoggingOut ? 'wait' : 'pointer',
            transition: 'background-color 0.15s ease',
          }}
        >
          <LogOut size={15} />
          <span className="logout-text">Logout</span>
        </button>
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
          .admin-email-text {
            display: none !important;
          }
          .logout-text {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
