'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SummaryCards from '@/components/SummaryCards';
import DistributionCharts from '@/components/DistributionCharts';
import RecentEnquiriesTable from '@/components/RecentEnquiriesTable';
import LeadDetailDrawer from '@/components/LeadDetailDrawer';
import { DashboardStats } from '@/lib/types';
import { AlertCircle } from 'lucide-react';

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCareInfoId, setSelectedCareInfoId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const fetchStats = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const res = await fetch('/api/dashboard/stats');
      const json = await res.json().catch(() => null);

      if (res.ok && json?.success && json?.data) {
        setStats(json.data);
      } else {
        setError(json?.error || 'Failed to load dashboard metrics from database');
      }
    } catch {
      setError('Unable to connect to dashboard API. Please check your database connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

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
          onRefresh={() => fetchStats(true)}
          isRefreshing={refreshing}
        />

        {/* Page Container */}
        <main className="content-container">
          {/* Page Heading Banner */}
          <div style={{ marginBottom: '24px' }}>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--navy-primary)',
                letterSpacing: '-0.01em',
              }}
            >
              Operations Overview
            </h1>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Real-time care enquiries, conversion metrics, and multi-channel attribution for Noblecare4u
            </p>
          </div>

          {/* Error Banner */}
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
                marginBottom: '24px',
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* 9 KPI Summary Cards */}
          <SummaryCards stats={stats} loading={loading} />

          {/* Visual Distribution and 7-day Trend */}
          <DistributionCharts stats={stats} loading={loading} />

          {/* Recent Enquiries Table */}
          <RecentEnquiriesTable
            enquiries={stats?.recentEnquiries || []}
            loading={loading}
            onSelectLead={(id) => setSelectedCareInfoId(id)}
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
