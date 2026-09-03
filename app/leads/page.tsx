'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import FiltersBar from '@/components/FiltersBar';
import LeadsTable from '@/components/LeadsTable';
import Pagination from '@/components/Pagination';
import LeadDetailDrawer from '@/components/LeadDetailDrawer';
import { GetLeadsQueryOptions, GetLeadsResponse, LeadRecord, PaginationMeta } from '@/lib/types';
import { AlertCircle } from 'lucide-react';

function LeadsExplorerContent() {
  const searchParams = useSearchParams();

  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
  });
  const [availableServices, setAvailableServices] = useState<string[]>([]);
  const [availableSources, setAvailableSources] = useState<string[]>([]);
  const [availableCampaigns, setAvailableCampaigns] = useState<string[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCareInfoId, setSelectedCareInfoId] = useState<string | null>(
    searchParams.get('selected') || null
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Filter state
  const [filters, setFilters] = useState<GetLeadsQueryOptions>({
    search: searchParams.get('search') || '',
    service: searchParams.get('service') || 'all',
    source: searchParams.get('source') || 'all',
    campaign: searchParams.get('campaign') || 'all',
    dateRange: (searchParams.get('dateRange') as any) || 'all',
    trafficType: (searchParams.get('trafficType') as any) || 'all',
    sort: (searchParams.get('sort') as any) || 'newest',
    page: Number(searchParams.get('page')) || 1,
    limit: 15,
  });

  const fetchLeads = useCallback(
    async (queryFilters: GetLeadsQueryOptions, isRefresh = false) => {
      try {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (queryFilters.search) params.set('search', queryFilters.search);
        if (queryFilters.service && queryFilters.service !== 'all')
          params.set('service', queryFilters.service);
        if (queryFilters.source && queryFilters.source !== 'all')
          params.set('source', queryFilters.source);
        if (queryFilters.campaign && queryFilters.campaign !== 'all')
          params.set('campaign', queryFilters.campaign);
        if (queryFilters.dateRange && queryFilters.dateRange !== 'all')
          params.set('dateRange', queryFilters.dateRange);
        if (queryFilters.trafficType && queryFilters.trafficType !== 'all')
          params.set('trafficType', queryFilters.trafficType);
        if (queryFilters.sort) params.set('sort', queryFilters.sort);
        if (queryFilters.page) params.set('page', String(queryFilters.page));
        if (queryFilters.limit) params.set('limit', String(queryFilters.limit));

        const res = await fetch(`/api/leads?${params.toString()}`);
        const json: GetLeadsResponse = await res.json().catch(() => null);

        if (res.ok && json?.success && json?.data) {
          setLeads(json.data.leads);
          setPagination(json.data.pagination);
          if (json.data.availableServices) setAvailableServices(json.data.availableServices);
          if (json.data.availableSources) setAvailableSources(json.data.availableSources);
          if (json.data.availableCampaigns) setAvailableCampaigns(json.data.availableCampaigns);
        } else {
          setError(json?.message || 'Failed to retrieve enquiries from database');
        }
      } catch {
        setError('Network error while querying leads from database.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchLeads(filters);
  }, [filters, fetchLeads]);

  const handleFilterChange = (updated: Partial<GetLeadsQueryOptions>) => {
    setFilters((prev) => ({
      ...prev,
      ...updated,
      page: updated.page !== undefined ? updated.page : 1, // reset to page 1 on filter change
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      service: 'all',
      source: 'all',
      campaign: 'all',
      dateRange: 'all',
      trafficType: 'all',
      sort: 'newest',
      page: 1,
      limit: 15,
    });
  };

  const handlePageChange = (newPage: number) => {
    handleFilterChange({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="dashboard-layout">
      {/* Navigation Sidebar */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="main-content">
        {/* Top Header */}
        <Header
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onRefresh={() => fetchLeads(filters, true)}
          isRefreshing={refreshing}
        />

        {/* Page Container */}
        <main className="content-container">
          {/* Page Heading */}
          <div style={{ marginBottom: '20px' }}>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--navy-primary)',
                letterSpacing: '-0.01em',
              }}
            >
              Care Enquiries
            </h1>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Individual care requests, user demographics, and multi-touch attribution records
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div
              role="alert"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#991b1b',
                padding: '14px 16px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                marginBottom: '20px',
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Filters Bar */}
          <FiltersBar
            filters={filters}
            onChange={handleFilterChange}
            onClear={handleClearFilters}
            availableServices={availableServices}
            availableSources={availableSources}
            availableCampaigns={availableCampaigns}
            loading={loading}
          />

          {/* Leads Table & Mobile Card View */}
          <LeadsTable
            leads={leads}
            loading={loading}
            onSelectLead={(id) => setSelectedCareInfoId(id)}
          />

          {/* Server-Side Pagination */}
          <Pagination
            meta={pagination}
            onPageChange={handlePageChange}
            loading={loading}
          />
        </main>
      </div>

      {/* Detail Slide-over Drawer */}
      <LeadDetailDrawer
        careInfoId={selectedCareInfoId}
        onClose={() => setSelectedCareInfoId(null)}
      />
    </div>
  );
}

export default function LeadsPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading care enquiries...
        </div>
      }
    >
      <LeadsExplorerContent />
    </Suspense>
  );
}
