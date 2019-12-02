import React from 'react'
import { Switch, Route, Link, withRouter } from 'react-router-dom'
import {
  Drawer,
  IconButton,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { Close } from '@material-ui/icons'
import PerfectScrollbar from 'react-perfect-scrollbar'
// import PhotosForm from './PhotosForm'
import SearchResults from './SearchResults'
import SelectedLocationContainer from '../containers/SelectedLocationContainer'
import LocationFormContainer from '../containers/LocationFormContainer'


const LocationTab = ({
  cachedLocation,
  closeLocationTab,
  searchResults,
  setActiveMarker,
  setCachedLocation,
  location,
  history,
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <Drawer
      open={location.pathname.startsWith('/location') || location.pathname.startsWith('/search')}
      variant='persistent'
      anchor={matches ? 'left' : 'bottom'}
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
      onClose={() => closeLocationTab()}
    >
      <div className={classes.toolbar} />
      <PerfectScrollbar className={classes.inner}>
        <IconButton
          size='small'
          className={classes.close}
          aria-label='close'
          component={Link}
          to='/'
        ><Close /></IconButton>

        <Switch>
          <Route exact path='/search'>
            <SearchResults
              items={searchResults}
              setActiveMarker={setActiveMarker}
              setCachedLocation={location => {
                setCachedLocation(location)
                history.push(`/location/${location.id}`)
              }}
              history={history}
            />
          </Route>

          <Route exact path='/location/new'>
            <div className={classes.content}>
              <LocationFormContainer
                cachedLocation={cachedLocation}
                setCachedLocation={setCachedLocation}
                setActiveMarker={location => setActiveMarker(location)}
                isNew
              />
            </div>
          </Route>

          <Route exact path='/location/:id'>
            <SelectedLocationContainer
              cachedLocation={cachedLocation}
              setCachedLocation={setCachedLocation}
              showBackToSearch={!!searchResults}
              classes={classes}
            />
          </Route>

          <Route exact path='/location/:id/edit'>
            <div className={classes.content}>
              <LocationFormContainer
                cachedLocation={cachedLocation}
                setCachedLocation={setCachedLocation}
                setActiveMarker={location => setActiveMarker(location)}
              />
            </div>
          </Route>

          {/* {content === 'editPhotos' &&
            <div className={classes.content}>
              <Typography variant='h4' gutterBottom>{<Text id='actions.editPhotos}</Typography>
              <PhotosForm
                locationData={cachedLocation}
                onSubmitLocation={files => onImageUpload(files)}
                cancel={() => setLocationTabContent('markerInfo')}
              />
            </div>
          } */}
        </Switch>
      </PerfectScrollbar>
    </Drawer>
  )
}

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    height: '100vh',
    boxShadow: theme.shadows[3],
    [theme.breakpoints.up('sm')]: {
      width: 400,
      height: '100%',
      marginTop: 0,
    },
  },
  drawer: {
    flexShrink: 0,
  },
  toolbar: theme.mixins.toolbar,
  inner: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    padding: theme.spacing(2),
    boxShadow: theme.shadows[1],
    position: 'relative',
    flexGrow: 1,
  },
  close: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    zIndex: theme.zIndex.mobileStepper,
    backgroundColor: 'rgba(255, 255, 255, 0.67)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
  },
  backToSearch: {
    position: 'absolute',
    top: theme.spacing(1),
    left: theme.spacing(1),
    zIndex: theme.zIndex.mobileStepper,
  },
}))

export default withRouter(LocationTab)
