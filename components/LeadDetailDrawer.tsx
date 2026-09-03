'use client';

import React, { useEffect, useState } from 'react';
import { LeadDetailData } from '@/lib/types';
import { formatIstDateTime } from '@/lib/date';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  History,
  Megaphone,
  Globe,
  Tag,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface LeadDetailDrawerProps {
  careInfoId: string | null;
  onClose: () => void;
}

export default function LeadDetailDrawer({ careInfoId, onClose }: LeadDetailDrawerProps) {
  const [detail, setDetail] = useState<LeadDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!careInfoId) {
      setDetail(null);
      return;
    }

    let isMounted = true;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/leads/${careInfoId}`);
        if (!res.ok) {
          throw new Error('Failed to load lead details');
        }
        const json = await res.json();
        if (isMounted) {
          if (json.success && json.data) {
            setDetail(json.data);
          } else {
            setError(json.error || 'Failed to load details');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError('Unable to load lead details from the database.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDetail();

    return () => {
      isMounted = false;
    };
  }, [careInfoId]);

  // Handle Escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (careInfoId) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [careInfoId, onClose]);

  if (!careInfoId) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {/* Backdrop */}
      <div
        role="presentation"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(10, 23, 42, 0.6)',
          backdropFilter: 'blur(2px)',
          transition: 'opacity 0.2s ease',
        }}
      />

      {/* Drawer Container */}
      <div
        className="lead-drawer-panel"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '580px',
          height: '100%',
          backgroundColor: '#ffffff',
          boxShadow: 'var(--shadow-drawer)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 101,
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            backgroundColor: '#ffffff',
            zIndex: 10,
          }}
        >
          <div>
            <h2
              id="drawer-title"
              style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                color: 'var(--navy-primary)',
              }}
            >
              Enquiry & Patient Details
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Comprehensive care history and user touchpoint record
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close enquiry drawer"
            style={{
              padding: '8px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-surface-subtle)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', flex: 1 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              Loading lead details and touchpoint history...
            </div>
          ) : error ? (
            <div
              style={{
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                fontSize: '0.88rem',
              }}
            >
              {error}
            </div>
          ) : detail ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* 1. Selected Care Enquiry Card */}
              <div
                style={{
                  backgroundColor: 'var(--care-blue-subtle)',
                  borderRadius: '12px',
                  border: '1px solid #bfdbfe',
                  padding: '18px 20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: 'var(--care-blue)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Selected Care Request
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span
                      style={{
                        backgroundColor: '#ffffff',
                        color: 'var(--care-blue)',
                        padding: '3px 10px',
                        borderRadius: '10px',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                      }}
                    >
                      {detail.enquiry.careNeeded}
                    </span>
                    <span
                      style={{
                        backgroundColor: detail.enquiry.userType === 'New' ? '#dbeafe' : '#fef3c7',
                        color: detail.enquiry.userType === 'New' ? '#1e40af' : '#92400e',
                        padding: '3px 8px',
                        borderRadius: '10px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      {detail.enquiry.userType} Enquiry
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  <Clock size={14} color="var(--care-blue)" />
                  <span>Received: {formatIstDateTime(detail.enquiry.createdAt)}</span>
                </div>

                {detail.enquiry.additionalInfo ? (
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '12px', marginTop: '8px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Additional Care Details / Message:
                    </div>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                      {detail.enquiry.additionalInfo}
                    </p>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    No additional notes submitted with this enquiry.
                  </div>
                )}
              </div>

              {/* 2. Patient / User Profile */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid var(--border-light)',
                  padding: '18px 20px',
                }}
              >
                <h3
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: 'var(--navy-primary)',
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <User size={16} color="var(--care-blue)" />
                  <span>Contact Profile</span>
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.86rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Full Name</div>
                    <div style={{ fontWeight: 600, color: 'var(--navy-primary)', marginTop: '2px' }}>
                      {detail.user.name}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phone Number</div>
                    <div style={{ fontWeight: 600, fontFamily: 'monospace', color: 'var(--navy-primary)', marginTop: '2px' }}>
                      {detail.user.countryCode} {detail.user.phone}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>City</div>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {detail.user.city}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email Address</div>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {detail.user.email || '—'}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Initial Registered Date</div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {formatIstDateTime(detail.user.createdAt)}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Enquiries Placed</div>
                    <div style={{ fontWeight: 600, color: 'var(--care-blue)', marginTop: '2px' }}>
                      {detail.enquiryHistory.length} care {detail.enquiryHistory.length === 1 ? 'request' : 'requests'}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Complete Care Enquiry History */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid var(--border-light)',
                  padding: '18px 20px',
                }}
              >
                <h3
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: 'var(--navy-primary)',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <History size={16} color="var(--care-blue)" />
                  <span>Enquiry History ({detail.enquiryHistory.length})</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {detail.enquiryHistory.map((item, idx) => {
                    const isSelected = item._id === detail.enquiry._id;
                    return (
                      <div
                        key={item._id}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: isSelected ? '2px solid var(--care-blue)' : '1px solid var(--border-light)',
                          backgroundColor: isSelected ? 'var(--care-blue-subtle)' : 'var(--bg-surface-subtle)',
                          fontSize: '0.84rem',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, color: 'var(--navy-primary)' }}>
                            #{idx + 1} — {item.careNeeded}
                          </span>
                          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                            {formatIstDateTime(item.createdAt)}
                          </span>
                        </div>
                        {item.additionalInfo && (
                          <div style={{ marginTop: '4px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                            &ldquo;{item.additionalInfo}&rdquo;
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Complete User Campaign / Attribution History */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid var(--border-light)',
                  padding: '18px 20px',
                }}
              >
                <div style={{ marginBottom: '10px' }}>
                  <h3
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: 'var(--navy-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Megaphone size={16} color="var(--orange-accent)" />
                    <span>User Campaign Touchpoint History ({detail.campaignHistory.length})</span>
                  </h3>
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                    Note: Shows all marketing touchpoints recorded for this user across visits.
                  </p>
                </div>

                {detail.campaignHistory.length === 0 ? (
                  <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-subtle)', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    No campaign parameters recorded for this user. Traffic classified as Direct / Organic.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {detail.campaignHistory.map((camp, idx) => (
                      <div
                        key={camp._id || idx}
                        style={{
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-light)',
                          backgroundColor: 'var(--bg-surface-subtle)',
                          fontSize: '0.82rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span
                            style={{
                              fontWeight: 600,
                              color: camp.utm_source ? 'var(--orange-accent)' : 'var(--text-secondary)',
                              backgroundColor: camp.utm_source ? 'var(--orange-subtle)' : '#ffffff',
                              padding: '2px 8px',
                              borderRadius: '4px',
                            }}
                          >
                            {camp.utm_source || 'Direct / Organic'}
                          </span>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            {formatIstDateTime(camp.createdAt)}
                          </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '4px', fontSize: '0.78rem' }}>
                          {camp.utm_medium && (
                            <div>
                              <span style={{ color: 'var(--text-muted)' }}>Medium: </span>
                              <span style={{ fontWeight: 500 }}>{camp.utm_medium}</span>
                            </div>
                          )}
                          {camp.utm_campaign && (
                            <div>
                              <span style={{ color: 'var(--text-muted)' }}>Campaign: </span>
                              <span style={{ fontWeight: 500 }}>{camp.utm_campaign}</span>
                            </div>
                          )}
                          {camp.route && (
                            <div>
                              <span style={{ color: 'var(--text-muted)' }}>Route: </span>
                              <span style={{ fontWeight: 500 }}>{camp.route}</span>
                            </div>
                          )}
                          {camp.platform && (
                            <div>
                              <span style={{ color: 'var(--text-muted)' }}>Platform: </span>
                              <span style={{ fontWeight: 500 }}>{camp.platform}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
