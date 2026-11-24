import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
  className?: string;
  width?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  pageSize = 8,
  searchKey,
  searchPlaceholder = 'بحث...',
  emptyMessage = 'لا توجد بيانات',
  onRowClick,
}: {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  searchKey?: (row: T) => string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  let filtered = data;
  if (search && searchKey) {
    const q = search.toLowerCase();
    filtered = data.filter((row) => searchKey(row).toLowerCase().includes(q));
  }

  if (sortKey) {
    const col = columns.find((c) => c.key === sortKey);
    if (col?.sortValue) {
      filtered = [...filtered].sort((a, b) => {
        const av = col.sortValue!(a);
        const bv = col.sortValue!(b);
        if (av < bv) return sortDir === 'asc' ? -1 : 1;
        if (av > bv) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }
  }

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div>
      {searchKey && (
        <div className="flex items-center gap-2 bg-surface-subtle rounded-xl px-3 py-2 mb-4 max-w-xs">
          <Search size={16} className="text-ink-300 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder={searchPlaceholder}
            className="bg-transparent text-sm flex-1 outline-none placeholder:text-ink-300"
          />
        </div>
      )}

      <div className="overflow-x-auto -mx-1">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-line">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn('text-right text-xs font-semibold text-ink-500 py-3 px-3', col.className)}
                  style={{ width: col.width }}
                >
                  {col.sortable ? (
                    <button
                      onClick={() => handleSort(col.key)}
                      className="flex items-center gap-1 hover:text-ink-900 transition-colors"
                    >
                      {col.label}
                      {sortKey === col.key ? (
                        sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />
                      ) : (
                        <ChevronUp size={13} className="text-ink-300" />
                      )}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-sm text-ink-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paged.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'border-b border-line/70 transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-surface-subtle/50'
                  )}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn('py-3.5 px-3 text-sm text-ink-900', col.className)}>
                      {col.render ? col.render(row) : (row as Record<string, unknown>)[col.key] as ReactNode}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-line">
          <p className="text-xs text-ink-500">
            عرض <span className="num">{page * pageSize + 1}</span>–
            <span className="num">{Math.min((page + 1) * pageSize, filtered.length)}</span> من{' '}
            <span className="num">{filtered.length}</span>
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-ink-700 hover:bg-surface-subtle disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
            <span className="text-xs text-ink-500 px-2 num">{page + 1} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-ink-700 hover:bg-surface-subtle disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
