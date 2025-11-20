import React from 'react'
import {
  Tooltip,
  ClickAwayListener,
  IconButton,
} from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { InfoOutlined } from '@material-ui/icons'


interface InfoTooltipProps {
  placement?: 'bottom' | 'top' | 'left' | 'right' | 'bottom-end' | 'bottom-start' | 'left-end' | 'left-start' | 'right-end' | 'right-start' | 'top-end' | 'top-start'
  large?: boolean
  icon?: React.ElementType
  children: React.ReactNode
}

const InfoTooltip = ({
  placement = 'bottom',
  large,
  icon,
  children,
}: InfoTooltipProps) => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)

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
      >
        {large
          ? <IconButton
            onClick={() => setOpen(true)}
            onMouseOver={() => setOpen(true)}
            onMouseOut={() => setOpen(false)}
          >
            <IconComponent className={classes.icon} />
          </IconButton>
          : <span
            onClick={() => setOpen(true)}
            onMouseOver={() => setOpen(true)}
            onMouseOut={() => setOpen(false)}
            className={classes.smallTrigger}
          >
            <IconComponent className={classes.icon} />
          </span>
        }
      </Tooltip>
    </ClickAwayListener>
  )
}

const useStyles = makeStyles<Theme>(theme => ({
  message: {
    fontSize: theme.typography.fontSize,
    lineHeight: 'normal',
    fontWeight: theme.typography.fontWeightRegular as any,
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
      transform: 'none',
    },
  },
}))

export default InfoTooltip

