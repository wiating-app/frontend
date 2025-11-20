import React from 'react'
import {
  Fab,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Fade,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { AddLocation } from '@material-ui/icons'
import useLanguage from '../utils/useLanguage'


interface AddButtonItem {
  label: string
  icon: React.ReactNode
  callback: () => void
}

interface AddButtonProps {
  items: AddButtonItem[]
  isLoggedIn: boolean
}

const AddButton = ({ items, isLoggedIn }: AddButtonProps) => {
  const classes = useStyles()
  const { translations } = useLanguage()
  const [isOpen, setIsOpen] = React.useState<null | HTMLElement>(null)

  return (
    isLoggedIn
      ? <div className={classes.root}>
        <Tooltip title={translations.addMarker} placement='left'>
          <Fab
            color='primary'
            size='medium'
            aria-label='Add'
            onClick={e => setIsOpen(e.currentTarget)}
            aria-owns={isOpen ? 'plus-menu' : undefined}
            aria-haspopup='true'
          ><AddLocation /></Fab>
        </Tooltip>
        <Menu
          id='plus-menu'
          anchorEl={isOpen}
          open={Boolean(isOpen)}
          onClose={() => setIsOpen(null)}
          TransitionComponent={Fade}
        >
          <MenuItem className={classes.title}>
            <Typography variant='subtitle2'>{translations.addMarker}</Typography>
          </MenuItem>
          {items.map((item, index) =>
            <MenuItem
              key={index}
              onClick={() => {
                setIsOpen(null)
                item.callback()
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </MenuItem>
          )}
        </Menu>
      </div>
      : null
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    position: 'fixed',
    right: theme.spacing(1),
    bottom: theme.spacing(10),
    zIndex: theme.zIndex.speedDial,
  },
  title: {
    pointerEvents: 'none',
  },
}))

export default AddButton
