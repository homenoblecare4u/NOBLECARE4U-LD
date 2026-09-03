'use client';

import React from 'react';
import { DashboardStats } from '@/lib/types';
import {
  Users,
  ClipboardList,
  Calendar,
  CalendarDays,
  HeartPulse,
  Stethoscope,
  Activity,
  Compass,
  Megaphone,
} from 'lucide-react';

interface SummaryCardsProps {
  stats?: DashboardStats | null;
  loading?: boolean;
}

export default function SummaryCards({ stats, loading = false }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Total Unique Leads',
      value: stats?.totalUniqueLeads ?? 0,
      description: 'Distinct individuals who requested care',
      icon: Users,
      color: '#174ea6', // Care blue
      bgColor: '#eff6ff',
    },
    {
      title: 'Total Care Enquiries',
      value: stats?.totalCareEnquiries ?? 0,
      description: 'All historical care requests submitted',
      icon: ClipboardList,
      color: '#10233f', // Noble navy
      bgColor: '#f1f5f9',
    },
    {
      title: 'Enquiries Today',
      value: stats?.enquiriesToday ?? 0,
      description: 'Submitted since 00:00 IST',
      icon: Calendar,
      color: '#059669', // Emerald
      bgColor: '#ecfdf5',
    },
    {
      title: 'Enquiries This Month',
      value: stats?.enquiriesThisMonth ?? 0,
      description: 'Submitted in the current calendar month',
      icon: CalendarDays,
      color: '#d97706', // Amber
      bgColor: '#fffbeb',
    },
    {
      title: 'Elder Care Enquiries',
      value: stats?.elderCareEnquiries ?? 0,
      description: 'Dedicated elderly support requests',
      icon: HeartPulse,
      color: '#166534', // Forest green
      bgColor: '#f0fdf4',
    },
    {
      title: 'Nursing Enquiries',
      value: stats?.nursingEnquiries ?? 0,
      description: 'Home skilled nursing assistance',
      icon: Stethoscope,
      color: '#1e40af', // Deep blue
      bgColor: '#eff6ff',
    },
    {
      title: 'Physiotherapy Enquiries',
      value: stats?.physiotherapyEnquiries ?? 0,
      description: 'Home mobility & physio sessions',
      icon: Activity,
      color: '#7e22ce', // Purple
      bgColor: '#faf5ff',
    },
    {
      title: 'Direct / Organic Leads',
      value: stats?.directOrganicEnquiries ?? 0,
      description: 'Uncampaign traffic or direct visits',
      icon: Compass,
      color: '#475569', // Slate
      bgColor: '#f8fafc',
    },
    {
      title: 'Campaign Leads',
      value: stats?.campaignAttributedEnquiries ?? 0,
      description: 'Attributed via UTM parameters',
      icon: Megaphone,
      color: '#ef7d45', // Warm orange
      bgColor: '#fff4ee',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '18px',
        marginBottom: '28px',
      }}
    >
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top row: Title and Icon */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '12px',
              }}
            >
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.3,
                }}
              >
                {card.title}
              </span>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: card.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={19} color={card.color} />
              </div>
            </div>

            {/* Metric Value */}
            <div style={{ marginBottom: '8px' }}>
              {loading ? (
                <div
                  style={{
                    height: '36px',
                    width: '70px',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    borderRadius: '6px',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                />
              ) : (
                <span
                  style={{
                    fontSize: '1.9rem',
                    fontWeight: 700,
                    color: 'var(--navy-primary)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {card.value.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Description note */}
            <p
              style={{
                fontSize: '0.76rem',
                color: 'var(--text-muted)',
                lineHeight: 1.35,
              }}
            >
              {card.description}
            </p>
          </div>
        );
      })}

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
