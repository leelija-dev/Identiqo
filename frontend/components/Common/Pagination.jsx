// components/Common/Pagination.jsx
'use client';

import { memo } from 'react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

const Pagination = memo(({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  className = '',
}) => {
  const generatePaginationItems = () => {
    const items = [];
    const totalItems = totalPages;
    const current = currentPage;
    const siblings = siblingCount;

    // Calculate range
    const leftSiblingIndex = Math.max(current - siblings, 1);
    const rightSiblingIndex = Math.min(current + siblings, totalItems);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalItems - 1;

    // First page
    if (showFirstLast) {
      items.push({
        type: 'first',
        label: 'First',
        icon: FiChevronsLeft,
        page: 1,
        disabled: current === 1,
      });
    }

    // Previous button
    items.push({
      type: 'prev',
      label: 'Previous',
      icon: FiChevronLeft,
      page: current - 1,
      disabled: current === 1,
    });

    // Page numbers
    if (!showLeftDots && !showRightDots) {
      // Show all pages
      for (let i = 1; i <= totalItems; i++) {
        items.push({
          type: 'page',
          label: i.toString(),
          page: i,
          active: i === current,
        });
      }
    } else if (showLeftDots && !showRightDots) {
      // Show left dots, all right pages
      for (let i = 1; i <= 2; i++) {
        items.push({
          type: 'page',
          label: i.toString(),
          page: i,
          active: i === current,
        });
      }
      items.push({ type: 'dots', label: '...', page: null });
      for (let i = leftSiblingIndex; i <= totalItems; i++) {
        items.push({
          type: 'page',
          label: i.toString(),
          page: i,
          active: i === current,
        });
      }
    } else if (!showLeftDots && showRightDots) {
      // Show all left pages, right dots
      for (let i = 1; i <= rightSiblingIndex; i++) {
        items.push({
          type: 'page',
          label: i.toString(),
          page: i,
          active: i === current,
        });
      }
      items.push({ type: 'dots', label: '...', page: null });
      for (let i = totalItems - 1; i <= totalItems; i++) {
        items.push({
          type: 'page',
          label: i.toString(),
          page: i,
          active: i === current,
        });
      }
    } else if (showLeftDots && showRightDots) {
      // Show left dots and right dots
      for (let i = 1; i <= 2; i++) {
        items.push({
          type: 'page',
          label: i.toString(),
          page: i,
          active: i === current,
        });
      }
      items.push({ type: 'dots', label: '...', page: null });
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        items.push({
          type: 'page',
          label: i.toString(),
          page: i,
          active: i === current,
        });
      }
      items.push({ type: 'dots', label: '...', page: null });
      for (let i = totalItems - 1; i <= totalItems; i++) {
        items.push({
          type: 'page',
          label: i.toString(),
          page: i,
          active: i === current,
        });
      }
    }

    // Next button
    items.push({
      type: 'next',
      label: 'Next',
      icon: FiChevronRight,
      page: current + 1,
      disabled: current === totalPages,
    });

    // Last page
    if (showFirstLast) {
      items.push({
        type: 'last',
        label: 'Last',
        icon: FiChevronsRight,
        page: totalPages,
        disabled: current === totalPages,
      });
    }

    return items;
  };

  const paginationItems = generatePaginationItems();

  if (totalPages <= 1) return null;

  return (
    <nav
      className={`flex justify-center items-center gap-1 sm:gap-2 mt-8 ${className}`}
      aria-label="Pagination"
    >
      {paginationItems.map((item, index) => {
        if (item.type === 'dots') {
          return (
            <span
              key={`dots-${index}`}
              className="px-2 sm:px-3 py-1.5 sm:py-2 text-slate-400 text-sm"
              aria-hidden="true"
            >
              {item.label}
            </span>
          );
        }

        if (item.type === 'page') {
          return (
            <button
              key={item.page}
              onClick={() => !item.active && onPageChange(item.page)}
              className={`
                min-w-[32px] sm:min-w-[40px] h-8 sm:h-10 px-2 sm:px-3 rounded-lg text-sm font-medium
                transition-all duration-200
                ${item.active
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                  : 'bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200'
                }
              `}
              aria-current={item.active ? 'page' : undefined}
              aria-label={`Go to page ${item.page}`}
            >
              {item.label}
            </button>
          );
        }

        const Icon = item.icon;
        return (
          <button
            key={item.type}
            onClick={() => !item.disabled && onPageChange(item.page)}
            disabled={item.disabled}
            className={`
              flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-sm font-medium
              transition-all duration-200
              ${!item.disabled
                ? 'bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 cursor-pointer'
                : 'bg-slate-100/50 text-slate-400 cursor-not-allowed border border-slate-200/50'
              }
            `}
            aria-label={item.label}
          >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination;