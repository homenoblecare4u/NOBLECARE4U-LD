'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, ShieldCheck, X } from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Overview',
      href: '/',
      icon: LayoutDashboard,
      active: pathname === '/',
    },
    {
      label: 'Care Enquiries',
      href: '/leads',
      icon: Users,
      active: pathname === '/leads',
    },
  ];

  const sidebarContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '260px',
        backgroundColor: 'var(--navy-primary)',
        color: 'var(--text-inverse)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '24px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          href="/"
          onClick={onClose}
          style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '6px 10px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Image
              src="/images/noblecare4u-logo.webp"
              alt="Noblecare4u Logo"
              width={130}
              height={28}
              priority
              style={{ objectFit: 'contain', height: 'auto' }}
            />
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close navigation drawer"
            className="mobile-close-btn"
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              padding: '6px',
              display: 'none',
            }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Admin Scope Badge */}
      <div style={{ padding: '16px 20px 8px 20px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(23, 78, 166, 0.35)',
            border: '1px solid rgba(23, 78, 166, 0.5)',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.72rem',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            fontWeight: 600,
            color: '#93c5fd',
          }}
        >
          <ShieldCheck size={13} />
          <span>Care Operations</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav
        aria-label="Sidebar navigation"
        style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              aria-current={item.active ? 'page' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '0.92rem',
                fontWeight: item.active ? 600 : 500,
                color: item.active ? '#ffffff' : 'rgba(255, 255, 255, 0.72)',
                backgroundColor: item.active ? 'var(--care-blue)' : 'transparent',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={18} color={item.active ? '#ffffff' : '#94a3b8'} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Status Footer */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              display: 'inline-block',
            }}
          />
          <span style={{ color: '#e2e8f0', fontWeight: 500 }}>Live DB Connected</span>
        </div>
        <span>Read-Only Operations Mode</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className="desktop-sidebar"
        style={{
          width: '260px',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 40,
        }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          role="presentation"
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(10, 23, 42, 0.65)',
            backdropFilter: 'blur(2px)',
            zIndex: 49,
          }}
        />
      )}

      {/* Mobile Sliding Drawer */}
      <div
        className={`mobile-drawer ${isOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {sidebarContent}
      </div>

      <style jsx global>{`
        @media (max-width: 1024px) {
          .desktop-sidebar {
            display: none !important;
          }
          .mobile-close-btn {
            display: block !important;
          }
        }
        @media (min-width: 1025px) {
          .mobile-drawer {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
