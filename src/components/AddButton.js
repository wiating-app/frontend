import React from 'react'
import { Link } from 'react-router-dom'
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
import {
  AddLocation,
  PinDrop,
  BorderColor,
  PersonPinCircle,
} from '@material-ui/icons'
import useLanguage from '../utils/useLanguage'
import useAuth0 from '../utils/useAuth0'


const AddButton = () => {
  const classes = useStyles()
  const { translations } = useLanguage()
  const { isLoggedIn } = useAuth0()
  const [isOpen, setIsOpen] = React.useState()
  const links = [
    {
      label: translations.pointOnMap,
      url: '/location/new',
      icon: <PinDrop />,
    },
    {
      label: translations.enterCoordinates,
      url: '/location/new',
      icon: <BorderColor />,
    },
    {
      label: translations.inCurrentLocation,
      url: '/location/new',
      icon: <PersonPinCircle />,
    },
  ]
  return (
    isLoggedIn
      ? <div className={classes.root}>
        <Tooltip title={translations.addMarker} placement='left'>
          <Fab
            color='primary'
            size='medium'
            aria-label='Add'
            onClick={e => setIsOpen(e.currentTarget)}
            aria-owns={isOpen ? 'plus-menu' : null}
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
          {links.map((item, index) =>
            <MenuItem
              component={Link}
              to={item.url}
              key={index}
              onClick={() => setIsOpen(null)}
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
