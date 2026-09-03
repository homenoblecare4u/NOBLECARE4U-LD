'use client';

import React from 'react';
import { PaginationMeta } from '@/lib/types';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (newPage: number) => void;
  loading?: boolean;
}

export default function Pagination({ meta, onPageChange, loading = false }: PaginationProps) {
  const { page, totalPages, total, limit } = meta;

  if (total === 0 || totalPages <= 1) {
    return null;
  }

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(total, page * limit);

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '16px 20px',
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)',
        fontSize: '0.84rem',
      }}
    >
      {/* Item count range */}
      <div style={{ color: 'var(--text-secondary)' }}>
        Showing <span style={{ fontWeight: 600, color: 'var(--navy-primary)' }}>{startItem}</span> to{' '}
        <span style={{ fontWeight: 600, color: 'var(--navy-primary)' }}>{endItem}</span> of{' '}
        <span style={{ fontWeight: 600, color: 'var(--navy-primary)' }}>{total}</span> enquiries
      </div>

      {/* Pagination controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={page <= 1 || loading}
          aria-label="First page"
          style={{
            padding: '6px 8px',
            borderRadius: '6px',
            border: '1px solid var(--border-light)',
            backgroundColor: page <= 1 ? 'var(--bg-surface-subtle)' : '#ffffff',
            color: page <= 1 ? 'var(--text-muted)' : 'var(--text-primary)',
            cursor: page <= 1 ? 'not-allowed' : 'pointer',
          }}
        >
          <ChevronsLeft size={16} />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || loading}
          aria-label="Previous page"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border-light)',
            backgroundColor: page <= 1 ? 'var(--bg-surface-subtle)' : '#ffffff',
            color: page <= 1 ? 'var(--text-muted)' : 'var(--text-primary)',
            fontWeight: 500,
            cursor: page <= 1 ? 'not-allowed' : 'pointer',
          }}
        >
          <ChevronLeft size={16} />
          <span>Prev</span>
        </button>

        {/* Page status */}
        <span style={{ padding: '0 8px', fontWeight: 600, color: 'var(--navy-primary)' }}>
          Page {page} of {totalPages}
        </span>

        {/* Next Page */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || loading}
          aria-label="Next page"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border-light)',
            backgroundColor: page >= totalPages ? 'var(--bg-surface-subtle)' : '#ffffff',
            color: page >= totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
            fontWeight: 500,
            cursor: page >= totalPages ? 'not-allowed' : 'pointer',
          }}
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages || loading}
          aria-label="Last page"
          style={{
            padding: '6px 8px',
            borderRadius: '6px',
            border: '1px solid var(--border-light)',
            backgroundColor: page >= totalPages ? 'var(--bg-surface-subtle)' : '#ffffff',
            color: page >= totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
            cursor: page >= totalPages ? 'not-allowed' : 'pointer',
          }}
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
}
