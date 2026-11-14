import { useState, useMemo, useCallback } from "react";

export interface PaginationResult<T> {
  page: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  pageCount: number;
  pageSize: number;
  pageItems: T[];
  total: number;
  rangeStart: number;
  rangeEnd: number;
  reset: () => void;
}

export function usePagination<T>(
  items: T[],
  pageSize: number = 10
): PaginationResult<T> {
  const [page, setPageState] = useState<number>(1);
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  // Compute effective clamped page without cascading effect setState
  const effectivePage = Math.max(1, Math.min(page, pageCount));

  const setPage = useCallback(
    (updater: number | ((prev: number) => number)) => {
      setPageState((prev) => {
        const current = Math.max(1, Math.min(prev, pageCount));
        const next = typeof updater === "function" ? updater(current) : updater;
        return Math.max(1, Math.min(pageCount, next));
      });
    },
    [pageCount]
  );

  const reset = useCallback(() => {
    setPageState(1);
  }, []);

  const pageItems = useMemo(() => {
    const startIndex = (effectivePage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [items, effectivePage, pageSize]);

  const rangeStart = total === 0 ? 0 : (effectivePage - 1) * pageSize + 1;
  const rangeEnd = Math.min(total, effectivePage * pageSize);

  return {
    page: effectivePage,
    setPage,
    pageCount,
    pageSize,
    pageItems,
    total,
    rangeStart,
    rangeEnd,
    reset,
  };
}
