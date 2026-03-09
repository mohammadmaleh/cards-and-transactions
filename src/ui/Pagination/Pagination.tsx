import { Button } from "@/ui"
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"
import type { ReactNode } from "react"

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function getPageNumbers(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages: (number | "ellipsis")[] = [1]
  const rangeStart = Math.max(2, currentPage - 1)
  const rangeEnd = Math.min(totalPages - 1, currentPage + 1)

  if (rangeStart > 2) pages.push("ellipsis")
  for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i)
  if (rangeEnd < totalPages - 1) pages.push("ellipsis")
  pages.push(totalPages)

  return pages
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps): ReactNode {
  const pages = getPageNumbers(currentPage, totalPages)

  return (
    <nav role="navigation" aria-label="Pagination">
      <ul className="flex flex-row items-center gap-1">
        <li>
          <Button
            variant="ghost"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Go to previous page"
            className="gap-1 px-2.5"
          >
            <ChevronLeftIcon />
            <span className="hidden sm:block">Previous</span>
          </Button>
        </li>

        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <li key={`ellipsis-${index}`} aria-hidden="true">
              <span className="flex size-9 items-center justify-center">
                <MoreHorizontalIcon className="size-4" />
              </span>
            </li>
          ) : (
            <li key={page}>
              <Button
                variant={page === currentPage ? "outline" : "ghost"}
                size="icon"
                onClick={() => onPageChange(page)}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </Button>
            </li>
          ),
        )}

        <li>
          <Button
            variant="ghost"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Go to next page"
            className="gap-1 px-2.5"
          >
            <span className="hidden sm:block">Next</span>
            <ChevronRightIcon />
          </Button>
        </li>
      </ul>
    </nav>
  )
}

export { Pagination }
export type { PaginationProps }
