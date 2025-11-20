import React from 'react'
import { TablePagination } from '@material-ui/core'


interface PaginationProps {
  count: number
  rowsPerPage: number
  page: number
  callback: (page: number) => void
}

const Pagination = ({ count, rowsPerPage, page, callback }: PaginationProps) =>
  <TablePagination
    count={count}
    rowsPerPage={rowsPerPage}
    rowsPerPageOptions={[rowsPerPage]}
    page={page}
    backIconButtonProps={{
      'aria-label': 'Previous Page',
    }}
    nextIconButtonProps={{
      'aria-label': 'Next Page',
    }}
    onPageChange={(e: any, page: number) => callback(page)}
  />

export default Pagination
