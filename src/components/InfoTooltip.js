import React from 'react'
import {
  Tooltip,
  ClickAwayListener,
  IconButton,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { InfoOutlined } from '@material-ui/icons'


const InfoTooltip = ({
  placement,
  large,
  icon,
  children,
}) => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)

  const TriggerComponent = large ? IconButton : 'span'
  const IconComponent = icon || InfoOutlined

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Tooltip
        placement={placement}
        onClose={() => setOpen(false)}
        open={open}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        title={<div className={classes.message}>{children}</div>}
        className={classes.tooltip}
      >
        <TriggerComponent
          onClick={() => setOpen(true)}
          onMouseOver={() => setOpen(true)}
          onMouseOut={() => setOpen(false)}
          className={large ? '' : classes.smallTrigger}
        >
          <IconComponent className={classes.icon} />
        </TriggerComponent>
      </Tooltip>
    </ClickAwayListener>
  )
}

Tooltip.defaultProps = {
  placement: 'bottom',
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
    transform: `translateY(${theme.spacing(2.4)}px)`,
  },
  smallTrigger: {
    display: 'inline-block',
    verticalAlign: 'middle',
    '& > *': {
      fontSize: '1.33em',
    },
  },
}))

export default InfoTooltip
