import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import "./Pagination.css";

function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  disabled = false,
  className = "",
}) {
  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages = [];
    const totalVisiblePages = siblingCount * 2 + 3;

    if (totalPages <= totalVisiblePages + 2) {
      for (let page = 1; page <= totalPages; page += 1) {
        pages.push(page);
      }

      return pages;
    }

    const leftSibling = Math.max(currentPage - siblingCount, 1);

    const rightSibling = Math.min(
      currentPage + siblingCount,
      totalPages
    );

    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < totalPages - 1;

    pages.push(1);

    if (showLeftDots) {
      pages.push("left-ellipsis");
    } else {
      pages.push(2);
    }

    for (
      let page = leftSibling;
      page <= rightSibling;
      page += 1
    ) {
      if (page !== 1 && page !== totalPages) {
        pages.push(page);
      }
    }

    if (showRightDots) {
      pages.push("right-ellipsis");
    } else if (totalPages > 1) {
      pages.push(totalPages - 1);
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return [...new Set(pages)];
  };

  const pages = getPageNumbers();

  const handlePageChange = (page) => {
    if (
      disabled ||
      page < 1 ||
      page > totalPages ||
      page === currentPage
    ) {
      return;
    }

    onPageChange?.(page);
  };

  return (
    <nav
      className={`lumora-pagination ${className}`}
      aria-label="Pagination"
    >
      {showFirstLast && (
        <button
          type="button"
          className="lumora-pagination__button"
          onClick={() => handlePageChange(1)}
          disabled={disabled || currentPage === 1}
          aria-label="First page"
        >
          First
        </button>
      )}

      <button
        type="button"
        className="lumora-pagination__button lumora-pagination__arrow"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={disabled || currentPage === 1}
        aria-label="Previous page"
      >
        <FaChevronLeft size={11} />
      </button>

      <div className="lumora-pagination__pages">
        {pages.map((page) => {
          if (typeof page !== "number") {
            return (
              <span
                key={page}
                className="lumora-pagination__ellipsis"
              >
                …
              </span>
            );
          }

          const active = page === currentPage;

          return (
            <button
              key={page}
              type="button"
              className={`lumora-pagination__button ${
                active
                  ? "lumora-pagination__button--active"
                  : ""
              }`}
              onClick={() => handlePageChange(page)}
              disabled={disabled}
              aria-current={active ? "page" : undefined}
              aria-label={`Page ${page}`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="lumora-pagination__button lumora-pagination__arrow"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={disabled || currentPage === totalPages}
        aria-label="Next page"
      >
        <FaChevronRight size={11} />
      </button>

      {showFirstLast && (
        <button
          type="button"
          className="lumora-pagination__button"
          onClick={() => handlePageChange(totalPages)}
          disabled={disabled || currentPage === totalPages}
          aria-label="Last page"
        >
          Last
        </button>
      )}
    </nav>
  );
}

export default Pagination;