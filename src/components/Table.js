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
    <MUITable>
      <TableHead className={classes.head}>
        <TableRow className={classes.cell}>
          {labels.map((label, index) => (
            <TableCell key={index} className={classes.cell}>
              {label.name}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody className={classes.body}>
        {data.map((row, index) =>
          <TableRow key={index} className={classes.row}>
            {labels.map((label, index) => (
              <TableCell
                key={index}
                className={`${classes.cell} ${label.wide ? classes.cellWide : ''}`}
              >
                {row[label.field]}
              </TableCell>
            ))}
          </TableRow>
        )}
      </TableBody>
    </MUITable>
  )
}

const useStyles = makeStyles(theme => ({
  // Make table responsive.
  [theme.breakpoints.down('sm')]: {
    head: {
      display: 'none',
    },
    body: {
      display: 'block',
    },
    row: {
      display: 'flex',
      flexWrap: 'wrap',
      borderBottomWidth: 1,
      borderColor: theme.palette.grey[400],
      borderBottomStyle: 'solid',
      paddingTop: theme.spacing(1.5),
      paddingBottom: theme.spacing(1.5),
    },
    cell: {
      display: 'block',
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5),
      lineHeight: 1.3,
      border: 'none',
    },
    cellWide: {
      minWidth: '100%',
    },
  },
}))


Table.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.node,
    field: PropTypes.string,
    wide: PropTypes.bool,
  })).isRequired,
  data: PropTypes.array.isRequired,
}


export default Table
