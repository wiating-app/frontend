import React from 'react'
import { ChevronLeft, ChevronRight } from '@material-ui/icons'
import IconButton from './IconButton'

interface PaginationProps {
  count: number
  rowsPerPage: number
  page: number
  callback: (page: number) => void
}

const Pagination = ({ count, rowsPerPage, page, callback }: PaginationProps) => {
  const from = count === 0 ? 0 : page * rowsPerPage + 1
  const to = Math.min(count, (page + 1) * rowsPerPage)
  const totalPages = Math.ceil(count / rowsPerPage)
  const isFirstPage = page === 0
  const isLastPage = page >= totalPages - 1

  return (
    <div className="flex items-center justify-end gap-4 text-sm text-gray-700 mt-4">
      <span>
        {from}–{to} of {count}
      </span>
      <div className="flex items-center gap-1">
        <IconButton
          onClick={() => callback(page - 1)}
          disabled={isFirstPage}
          aria-label="Previous Page"
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          onClick={() => callback(page + 1)}
          disabled={isLastPage}
          aria-label="Next Page"
        >
          <ChevronRight />
        </IconButton>
      </div>
    </div>
  )
}

export default Pagination
