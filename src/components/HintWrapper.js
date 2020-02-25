import React from 'react'
import { Tooltip, Grid } from '@material-ui/core'
import { Info } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'


const HintWrapper = ({ message, children }) => {
  const classes = useStyles()

  return (
    <Grid container justify='space-between'>
      <Grid item xs={11}>
        {children}
      </Grid>
      <Grid item xs>
        <Tooltip
          title={<div className={classes.message}>{message}</div>}
          className={classes.root}
        >
          <Info className={classes.icon} />
        </Tooltip>
      </Grid>
    </Grid>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: 20,
  },
  icon: {
    cursor: 'help',
  },
  message: {
    fontSize: theme.typography.fontSize,
    lineHeight: 'normal',
    fontWeight: theme.typography.fontWeightRegular,
  },
}))

export default HintWrapper
