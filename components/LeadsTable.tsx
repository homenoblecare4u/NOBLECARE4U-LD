'use client';

import React from 'react';
import { LeadRecord } from '@/lib/types';
import { formatIstDateTime } from '@/lib/date';
import { Clock, Phone, MapPin, Eye, ExternalLink, Calendar, ChevronRight } from 'lucide-react';

interface LeadsTableProps {
  leads: LeadRecord[];
  loading?: boolean;
  onSelectLead: (careInfoId: string) => void;
}

export default function LeadsTable({ leads, loading = false, onSelectLead }: LeadsTableProps) {
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

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          padding: '60px 20px',
          textAlign: 'center',
          color: 'var(--text-muted)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ marginBottom: '8px', fontWeight: 600, color: 'var(--navy-primary)' }}>
          Retrieving enquiries...
        </div>
        <p style={{ fontSize: '0.84rem' }}>Querying care enquiries and touchpoints from MongoDB</p>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          padding: '60px 20px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--navy-primary)', marginBottom: '8px' }}>
          No care enquiries found
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '450px', margin: '0 auto' }}>
          Try clearing your filters or selecting a broader date range to see enquiries.
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {/* 1. Desktop Table View (min-width: 1024px) */}
      <div
        className="leads-desktop-table"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
          marginBottom: '20px',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '0.85rem',
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderBottom: '1px solid var(--border-light)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Enquiry Received</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Patient / Contact</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Phone</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>City</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Service Needed</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>User Status</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Enquiry Info Preview</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Campaign / Source</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                const serviceBadge = getBadgeStyle(lead.careNeeded);
                const hasUtm = Boolean(lead.userCampaignTouchpoint?.utm_source);

                return (
                  <tr
                    key={lead._id}
                    style={{
                      borderBottom: '1px solid var(--border-light)',
                      transition: 'background-color 0.1s ease',
                    }}
                    className="lead-row"
                  >
                    {/* Timestamp in IST */}
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={13} color="var(--text-muted)" />
                        <span>{formatIstDateTime(lead.createdAt)}</span>
                      </div>
                    </td>

                    {/* Name */}
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--navy-primary)' }}>
                      <div>{lead.name}</div>
                      {lead.email && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                          {lead.email}
                        </div>
                      )}
                    </td>

                    {/* Full Phone for Authorized Care Ops */}
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: 500, whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Phone size={13} color="var(--text-muted)" />
                        <span>{lead.phone}</span>
                      </div>
                    </td>

                    {/* City */}
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={13} color="var(--text-muted)" />
                        <span>{lead.city}</span>
                      </div>
                    </td>

                    {/* Care Needed Badge */}
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          backgroundColor: serviceBadge.bg,
                          color: serviceBadge.text,
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.76rem',
                          fontWeight: 600,
                          display: 'inline-block',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {lead.careNeeded}
                      </span>
                    </td>

                    {/* User Type: New or Repeat */}
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          backgroundColor: lead.userType === 'New' ? 'var(--status-new-bg)' : 'var(--status-repeat-bg)',
                          color: lead.userType === 'New' ? 'var(--status-new-text)' : 'var(--status-repeat-text)',
                          padding: '3px 9px',
                          borderRadius: '10px',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          display: 'inline-block',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {lead.userType} ({lead.totalUserEnquiries} {lead.totalUserEnquiries === 1 ? 'req' : 'reqs'})
                      </span>
                    </td>

                    {/* Additional Information Preview */}
                    <td style={{ padding: '14px 16px', maxWidth: '200px' }}>
                      {lead.additionalInfo ? (
                        <p
                          style={{
                            fontSize: '0.8rem',
                            color: 'var(--text-secondary)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={lead.additionalInfo}
                        >
                          {lead.additionalInfo}
                        </p>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>

                    {/* User Campaign Touchpoint Info */}
                    <td style={{ padding: '14px 16px', maxWidth: '160px' }}>
                      {hasUtm ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span
                            style={{
                              fontSize: '0.76rem',
                              fontWeight: 600,
                              color: 'var(--orange-accent)',
                              backgroundColor: 'var(--orange-subtle)',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              display: 'inline-block',
                              width: 'fit-content',
                            }}
                          >
                            {lead.userCampaignTouchpoint?.utm_source}
                          </span>
                          {lead.userCampaignTouchpoint?.utm_campaign && (
                            <span
                              style={{
                                fontSize: '0.72rem',
                                color: 'var(--text-muted)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {lead.userCampaignTouchpoint.utm_campaign}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                          Direct / Organic
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        onClick={() => onSelectLead(lead._id)}
                        aria-label={`View full details for enquiry from ${lead.name}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          backgroundColor: 'var(--care-blue-subtle)',
                          color: 'var(--care-blue)',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          transition: 'background-color 0.15s ease',
                        }}
                      >
                        <Eye size={14} />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Mobile Card List View (max-width: 1023px) - No Horizontal Overflow */}
      <div
        className="leads-mobile-card-list"
        style={{
          display: 'none',
          flexDirection: 'column',
          gap: '14px',
          marginBottom: '20px',
        }}
      >
        {leads.map((lead) => {
          const serviceBadge = getBadgeStyle(lead.careNeeded);
          return (
            <div
              key={lead._id}
              onClick={() => onSelectLead(lead._id)}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                padding: '16px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                cursor: 'pointer',
              }}
            >
              {/* Card Header: Name + Badges */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--navy-primary)' }}>
                    {lead.name}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <MapPin size={13} color="var(--text-muted)" />
                    <span>{lead.city}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span
                    style={{
                      backgroundColor: serviceBadge.bg,
                      color: serviceBadge.text,
                      padding: '3px 8px',
                      borderRadius: '10px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                    }}
                  >
                    {lead.careNeeded}
                  </span>
                  <span
                    style={{
                      backgroundColor: lead.userType === 'New' ? 'var(--status-new-bg)' : 'var(--status-repeat-bg)',
                      color: lead.userType === 'New' ? 'var(--status-new-text)' : 'var(--status-repeat-text)',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      fontSize: '0.68rem',
                      fontWeight: 600,
                    }}
                  >
                    {lead.userType} ({lead.totalUserEnquiries} total)
                  </span>
                </div>
              </div>

              {/* Middle: Phone & Date */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.82rem',
                  padding: '8px 10px',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderRadius: '6px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'monospace', fontWeight: 600 }}>
                  <Phone size={13} color="var(--care-blue)" />
                  <span>{lead.phone}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {formatIstDateTime(lead.createdAt)}
                </div>
              </div>

              {/* Message preview if exists */}
              {lead.additionalInfo && (
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    backgroundColor: '#fffbeb',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    lineHeight: 1.35,
                  }}
                >
                  &ldquo;{lead.additionalInfo}&rdquo;
                </p>
              )}

              {/* Card Footer: Attribution & CTA */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  {lead.userCampaignTouchpoint?.utm_source
                    ? `Source: ${lead.userCampaignTouchpoint.utm_source}`
                    : 'Direct / Organic'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--care-blue)' }}>
                  <span>View Details</span>
                  <ChevronRight size={14} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        .lead-row:hover {
          background-color: var(--bg-surface-subtle);
        }
        @media (max-width: 1024px) {
          .leads-desktop-table {
            display: none !important;
          }
          .leads-mobile-card-list {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
