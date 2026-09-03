'use client';

import React from 'react';
import { GetLeadsQueryOptions } from '@/lib/types';
import { Search, X, Filter } from 'lucide-react';

interface FiltersBarProps {
  filters: GetLeadsQueryOptions;
  onChange: (updated: Partial<GetLeadsQueryOptions>) => void;
  onClear: () => void;
  availableServices?: string[];
  availableSources?: string[];
  availableCampaigns?: string[];
  loading?: boolean;
}

export default function FiltersBar({
  filters,
  onChange,
  onClear,
  availableServices = [],
  availableSources = [],
  availableCampaigns = [],
  loading = false,
}: FiltersBarProps) {
  const hasActiveFilters = Boolean(
    filters.search ||
      (filters.service && filters.service !== 'all') ||
      (filters.source && filters.source !== 'all') ||
      (filters.campaign && filters.campaign !== 'all') ||
      (filters.dateRange && filters.dateRange !== 'all') ||
      (filters.trafficType && filters.trafficType !== 'all') ||
      filters.sort === 'oldest'
  );

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)',
        padding: '18px 20px',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      {/* Top row: Search input and Date Range */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Search Input */}
        <div
          style={{
            position: 'relative',
            flex: '1 1 280px',
            maxWidth: '450px',
          }}
        >
          <Search
            size={17}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            placeholder="Search by name, phone, or city..."
            value={filters.search || ''}
            onChange={(e) => onChange({ search: e.target.value, page: 1 })}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '8px',
              border: '1px solid var(--border-light)',
              fontSize: '0.88rem',
              backgroundColor: 'var(--bg-page)',
            }}
          />
          {filters.search && (
            <button
              onClick={() => onChange({ search: '', page: 1 })}
              aria-label="Clear search"
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                padding: '2px',
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Date Range Preset Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Date:
          </label>
          <select
            value={filters.dateRange || 'all'}
            onChange={(e) => onChange({ dateRange: e.target.value as any, page: 1 })}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-light)',
              fontSize: '0.84rem',
              backgroundColor: '#ffffff',
              color: 'var(--text-primary)',
            }}
          >
            <option value="all">All Dates</option>
            <option value="today">Today (IST)</option>
            <option value="yesterday">Yesterday</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>

        {/* Sort Direction */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Sort:
          </label>
          <select
            value={filters.sort || 'newest'}
            onChange={(e) => onChange({ sort: e.target.value as any, page: 1 })}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-light)',
              fontSize: '0.84rem',
              backgroundColor: '#ffffff',
              color: 'var(--text-primary)',
            }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Bottom Filter Controls Row */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          paddingTop: '10px',
          borderTop: '1px solid var(--border-light)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <Filter size={14} />
          <span>Filters:</span>
        </div>

        {/* Care Service Filter */}
        <select
          value={filters.service || 'all'}
          onChange={(e) => onChange({ service: e.target.value, page: 1 })}
          style={{
            padding: '7px 12px',
            borderRadius: '8px',
            border: '1px solid var(--border-light)',
            fontSize: '0.82rem',
            backgroundColor: filters.service && filters.service !== 'all' ? 'var(--care-blue-subtle)' : '#ffffff',
            color: filters.service && filters.service !== 'all' ? 'var(--care-blue)' : 'var(--text-primary)',
            fontWeight: filters.service && filters.service !== 'all' ? 600 : 400,
          }}
        >
          <option value="all">All Services</option>
          <option value="Elder Care">Elder Care</option>
          <option value="Nursing">Nursing</option>
          <option value="Physiotherapy">Physiotherapy</option>
          <option value="Not sure yet">Not sure yet</option>
          {availableServices
            .filter((s) => !['Elder Care', 'Nursing', 'Physiotherapy', 'Not sure yet'].includes(s))
            .map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
        </select>

        {/* Acquisition / Traffic Type Filter */}
        <select
          value={filters.trafficType || 'all'}
          onChange={(e) => onChange({ trafficType: e.target.value as any, page: 1 })}
          style={{
            padding: '7px 12px',
            borderRadius: '8px',
            border: '1px solid var(--border-light)',
            fontSize: '0.82rem',
            backgroundColor: filters.trafficType && filters.trafficType !== 'all' ? 'var(--orange-subtle)' : '#ffffff',
            color: filters.trafficType && filters.trafficType !== 'all' ? 'var(--orange-accent)' : 'var(--text-primary)',
            fontWeight: filters.trafficType && filters.trafficType !== 'all' ? 600 : 400,
          }}
        >
          <option value="all">All Traffic Types</option>
          <option value="direct">Direct / Organic Only</option>
          <option value="campaign">Campaign Leads Only</option>
        </select>

        {/* Dynamic Source Filter */}
        {availableSources.length > 0 && (
          <select
            value={filters.source || 'all'}
            onChange={(e) => onChange({ source: e.target.value, page: 1 })}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-light)',
              fontSize: '0.82rem',
              backgroundColor: filters.source && filters.source !== 'all' ? 'var(--care-blue-subtle)' : '#ffffff',
              color: filters.source && filters.source !== 'all' ? 'var(--care-blue)' : 'var(--text-primary)',
            }}
          >
            <option value="all">All Sources</option>
            {availableSources.map((src) => (
              <option key={src} value={src}>{src}</option>
            ))}
          </select>
        )}

        {/* Dynamic Campaign Filter */}
        {availableCampaigns.length > 0 && (
          <select
            value={filters.campaign || 'all'}
            onChange={(e) => onChange({ campaign: e.target.value, page: 1 })}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-light)',
              fontSize: '0.82rem',
              backgroundColor: filters.campaign && filters.campaign !== 'all' ? 'var(--care-blue-subtle)' : '#ffffff',
              color: filters.campaign && filters.campaign !== 'all' ? 'var(--care-blue)' : 'var(--text-primary)',
            }}
          >
            <option value="all">All Campaigns</option>
            {availableCampaigns.map((camp) => (
              <option key={camp} value={camp}>{camp}</option>
            ))}
          </select>
        )}

        {/* Clear Filters Action */}
        {hasActiveFilters && (
          <button
            onClick={onClear}
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#b91c1c',
              backgroundColor: '#fee2e2',
              marginLeft: 'auto',
            }}
          >
            <X size={14} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
