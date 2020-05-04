import React from 'react'
import { Tooltip, Grid, ClickAwayListener, IconButton } from '@material-ui/core'
import { Info } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'


const HintWrapper = ({ message, children }) => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)

  return (
    <Grid container justify='space-between'>
      <Grid item xs={11}>
        {children}
      </Grid>
      <Grid item xs={1}>
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <div>
            <Tooltip
              placement='left-start'
              onClose={() => setOpen(false)}
              open={open}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              title={<div className={classes.message}>{message}</div>}
              className={classes.tooltip}
            >
              <IconButton
                onClick={() => setOpen(true)}
                onMouseOver={() => setOpen(true)}
                onMouseOut={() => setOpen(false)}
              >
                <Info className={classes.icon} />
              </IconButton>
            </Tooltip>
          </div>
        </ClickAwayListener>
      </Grid>
    </Grid>
  )
}

const useStyles = makeStyles(theme => ({
  message: {
    fontSize: theme.typography.fontSize,
    lineHeight: 'normal',
    fontWeight: theme.typography.fontWeightRegular,
    pointerEvents: 'none',
  },
  icon: {
    pointerEvents: 'none',
  },
}))

export default HintWrapper
