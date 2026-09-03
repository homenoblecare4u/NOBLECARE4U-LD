'use client';

import React from 'react';
import { DashboardStats } from '@/lib/types';

interface DistributionChartsProps {
  stats?: DashboardStats | null;
  loading?: boolean;
}

export default function DistributionCharts({ stats, loading = false }: DistributionChartsProps) {
  const serviceColors: Record<string, string> = {
    'Elder Care': '#166534',
    'Nursing': '#174ea6',
    'Physiotherapy': '#7e22ce',
    'Not sure yet': '#64748b',
  };

  const trendMax = Math.max(1, ...(stats?.sevenDayTrend?.map((t) => t.count) || [1]));

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px',
        marginBottom: '28px',
      }}
    >
      {/* 1. Seven-Day Enquiry Trend */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          padding: '22px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--navy-primary)',
              marginBottom: '4px',
            }}
          >
            7-Day Enquiry Trend (Asia/Kolkata)
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Daily care requests submitted over the past 7 calendar days
          </p>
        </div>

        {loading ? (
          <div
            style={{
              height: '140px',
              backgroundColor: 'var(--bg-surface-subtle)',
              borderRadius: '8px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        ) : !stats?.sevenDayTrend || stats.sevenDayTrend.length === 0 ? (
          <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No enquiry history recorded yet
          </div>
        ) : (
          <div>
            {/* Visual Bar Graph */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: '8px',
                height: '140px',
                paddingTop: '20px',
                borderBottom: '1px solid var(--border-light)',
              }}
              role="img"
              aria-label="7-Day enquiry trend bar chart"
            >
              {stats.sevenDayTrend.map((item, idx) => {
                const heightPercent = Math.max(8, Math.round((item.count / trendMax) * 100));
                return (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      height: '100%',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: item.count > 0 ? 'var(--care-blue)' : 'var(--text-muted)',
                      }}
                    >
                      {item.count}
                    </span>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '36px',
                        height: `${heightPercent}%`,
                        backgroundColor: item.count > 0 ? 'var(--care-blue)' : '#e2e8f0',
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.3s ease',
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Labels Row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '8px',
              }}
            >
              {stats.sevenDayTrend.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  {item.label}
                </div>
              ))}
            </div>

            {/* Accessible Screen-Reader Summary */}
            <div className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden' }}>
              <ul>
                {stats.sevenDayTrend.map((t, i) => (
                  <li key={i}>{t.label}: {t.count} enquiries</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 2. Care Services Distribution */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          padding: '22px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--navy-primary)',
            marginBottom: '4px',
          }}
        >
          Care Service Distribution
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Breakdown of healthcare categories requested by leads
        </p>

        {loading ? (
          <div
            style={{
              height: '140px',
              backgroundColor: 'var(--bg-surface-subtle)',
              borderRadius: '8px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        ) : !stats?.serviceDistribution || stats.serviceDistribution.length === 0 ? (
          <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No service distribution records available
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {stats.serviceDistribution.map((item, idx) => {
              const color = serviceColors[item.name] || 'var(--care-blue)';
              return (
                <div key={idx}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.84rem',
                      fontWeight: 500,
                      marginBottom: '6px',
                    }}
                  >
                    <span style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: 'var(--bg-surface-subtle)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${item.percentage}%`,
                        height: '100%',
                        backgroundColor: color,
                        borderRadius: '4px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Attribution Source Breakdown */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          padding: '22px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--navy-primary)',
            marginBottom: '4px',
          }}
        >
          Acquisition Source Breakdown
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Originating channels recorded in campaign touchpoints
        </p>

        {loading ? (
          <div
            style={{
              height: '140px',
              backgroundColor: 'var(--bg-surface-subtle)',
              borderRadius: '8px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        ) : !stats?.attributionBreakdown || stats.attributionBreakdown.length === 0 ? (
          <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No campaign sources recorded yet
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {stats.attributionBreakdown.map((item, idx) => (
              <div key={idx}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.84rem',
                    fontWeight: 500,
                    marginBottom: '6px',
                  }}
                >
                  <span style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                    {item.source}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {item.count} ({item.percentage}%)
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${item.percentage}%`,
                      height: '100%',
                      backgroundColor: item.source === 'Direct / Organic' ? '#64748b' : 'var(--orange-accent)',
                      borderRadius: '4px',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
