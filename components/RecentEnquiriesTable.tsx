'use client';

import React from 'react';
import Link from 'next/link';
import { RecentEnquirySummary } from '@/lib/types';
import { formatIstDateTime } from '@/lib/date';
import { ArrowRight, Clock } from 'lucide-react';

interface RecentEnquiriesTableProps {
  enquiries?: RecentEnquirySummary[];
  loading?: boolean;
  onSelectLead?: (id: string) => void;
}

export default function RecentEnquiriesTable({
  enquiries = [],
  loading = false,
  onSelectLead,
}: RecentEnquiriesTableProps) {
  const getBadgeStyle = (service: string) => {
    switch (service) {
      case 'Elder Care':
        return { bg: 'var(--status-elder-bg)', text: 'var(--status-elder-text)' };
      case 'Nursing':
        return { bg: 'var(--status-nursing-bg)', text: 'var(--status-nursing-text)' };
      case 'Physiotherapy':
        return { bg: 'var(--status-physio-bg)', text: 'var(--status-physio-text)' };
      default:
        return { bg: 'var(--status-notsure-bg)', text: 'var(--status-notsure-text)' };
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '28px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '18px',
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: 600,
              color: 'var(--navy-primary)',
              marginBottom: '2px',
            }}
          >
            Recent Care Enquiries
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Latest incoming patient and family care requests (phone numbers masked on overview)
          </p>
        </div>
        <Link
          href="/leads"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.86rem',
            fontWeight: 600,
            color: 'var(--care-blue)',
            textDecoration: 'none',
          }}
        >
          <span>View All Enquiries</span>
          <ArrowRight size={15} />
        </Link>
      </div>

      {loading ? (
        <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading recent care requests...
        </div>
      ) : enquiries.length === 0 ? (
        <div
          style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            backgroundColor: 'var(--bg-surface-subtle)',
            borderRadius: '8px',
            fontSize: '0.88rem',
          }}
        >
          No enquiries found in the database yet. New website submissions will appear here automatically.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '0.86rem',
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid var(--border-light)',
                  color: 'var(--text-muted)',
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Lead Name</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Masked Phone</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>City</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Care Needed</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>User Status</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Received (IST)</th>
                <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((lead) => {
                const badge = getBadgeStyle(lead.careNeeded);
                return (
                  <tr
                    key={lead._id}
                    style={{
                      borderBottom: '1px solid var(--border-light)',
                      transition: 'background-color 0.1s ease',
                    }}
                    className="table-row-hover"
                  >
                    <td style={{ padding: '14px', fontWeight: 600, color: 'var(--navy-primary)' }}>
                      {lead.name}
                    </td>
                    <td style={{ padding: '14px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                      {lead.maskedPhone}
                    </td>
                    <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>
                      {lead.city}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span
                        style={{
                          backgroundColor: badge.bg,
                          color: badge.text,
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.76rem',
                          fontWeight: 600,
                          display: 'inline-block',
                        }}
                      >
                        {lead.careNeeded}
                      </span>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span
                        style={{
                          backgroundColor: lead.userType === 'New' ? 'var(--status-new-bg)' : 'var(--status-repeat-bg)',
                          color: lead.userType === 'New' ? 'var(--status-new-text)' : 'var(--status-repeat-text)',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        {lead.userType}
                      </span>
                    </td>
                    <td style={{ padding: '14px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} />
                        <span>{formatIstDateTime(lead.createdAt)}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      {onSelectLead ? (
                        <button
                          onClick={() => onSelectLead(lead._id)}
                          style={{
                            color: 'var(--care-blue)',
                            fontWeight: 600,
                            fontSize: '0.82rem',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--care-blue-subtle)',
                          }}
                        >
                          View Details
                        </button>
                      ) : (
                        <Link
                          href={`/leads?selected=${lead._id}`}
                          style={{
                            color: 'var(--care-blue)',
                            fontWeight: 600,
                            fontSize: '0.82rem',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--care-blue-subtle)',
                            textDecoration: 'none',
                          }}
                        >
                          View Details
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <style jsx global>{`
        .table-row-hover:hover {
          background-color: var(--bg-surface-subtle);
        }
      `}</style>
    </div>
  );
}
