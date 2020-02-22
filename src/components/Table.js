import React from 'react'
import PropTypes from 'prop-types'
import {
  Table as MUITable,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'

const Table = ({ labels, data }) =>
  <MUITable>
    <TableHead>
      <TableRow>
        {labels.map((label, index) => (
          <TableCell key={index}>{label.name}</TableCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      {data.map((row, index) =>
        <TableRow key={index}>
          {labels.map((label, index) => (
            <TableCell key={index}>{row[label.field]}</TableCell>
          ))}
        </TableRow>
      )}
    </TableBody>
  </MUITable>


Table.propTypes = {
  labels: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
}


export default Table
