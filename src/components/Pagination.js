import React from 'react'
import PropTypes from 'prop-types'
import { TablePagination } from '@material-ui/core'


const Pagination = ({ count, rowsPerPage, page, callback }) =>
  <TablePagination
    component='div'
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
    onChangePage={(e, page) => callback(page)}
  />


Pagination.defaultProps = {
  rowsPerPage: 20,
}

Pagination.propTypes = {
  count: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  page: PropTypes.number,
  callback: PropTypes.func.isRequired,
}

export default Pagination