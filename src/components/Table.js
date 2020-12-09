import React from 'react'
import PropTypes from 'prop-types'
import {
  Table as MUITable,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const Table = ({ labels, data }) => {
  const classes = useStyles()
  return (
    <div className={classes.rwdScroll}>
      <MUITable>
        <TableHead>
          <TableRow>
            {labels.map((label, index) => (
              <TableCell key={index} className={classes.cell}>
                {label.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) =>
            <TableRow key={index}>
              {labels.map((label, index) => (
                <TableCell key={index} className={classes.cell}>
                  {row[label.field]}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </MUITable>
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  [theme.breakpoints.down('sm')]: {
    rwdScroll: {
      overflowX: 'auto',
    },
    cell: {
      padding: theme.spacing(1),
      lineHeight: 1.3,
    },
  },
}))


Table.propTypes = {
  labels: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
}


export default Table
