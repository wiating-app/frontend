import React from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import {
  Drawer,
  Button,
  IconButton,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { Close, ViewList } from '@material-ui/icons'
import PerfectScrollbar from 'react-perfect-scrollbar'
import LocationForm from './LocationForm'
// import PhotosForm from './PhotosForm'
import LocationImages from './LocationImages'
import LocationInfo from './LocationInfo'
import SearchResults from './SearchResults'


const LocationTab = ({
  selectedLocation,
  closeLocationTab,
  searchResults,
  setActiveMarker,
  setSelectedLocation,
  loggedIn,
  onSubmitLocation,
  onImageUpload,
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
          <Route exact path='/search'> {/* searchResults */}
            <SearchResults
              items={searchResults}
              setActiveMarker={setActiveMarker}
              setSelectedLocation={location => setSelectedLocation(location)}
              history={history}
            />
          </Route>

          <Route exact path='/location/new'> {/* addMarker */}
            <div className={classes.content}>
              <LocationForm
                onSubmitLocation={fields => onSubmitLocation(fields)}
                setActiveMarker={location => setActiveMarker(location)}
                cancel={() => history.goBack()}
                isNew
              />
            </div>
          </Route>

          <Route exact path='/location/:id'> {/* markerInfo */}
            {selectedLocation &&
              <>
                <LocationImages
                  images={selectedLocation.images}
                  id={selectedLocation.id}
                />
                {searchResults &&
                  <Button
                    onClick={() => history.push('/search')}
                    className={classes.backToSearch}
                    variant='contained'
                    size='small'
                  ><ViewList /> Powrót do wyników</Button>
                }
                <div className={classes.content}>
                  <LocationInfo
                    selectedLocation={selectedLocation}
                    loggedIn={loggedIn}
                    onImageUpload={files => onImageUpload(files)}
                  />
                </div>
              </>
            }
          </Route>

          <Route exact path='/location/:id/edit'> {/* editMarker */}
            <div className={classes.content}>
              <LocationForm
                selectedLocation={selectedLocation}
                onSubmitLocation={fields => onSubmitLocation(fields, true)}
                setActiveMarker={location => setActiveMarker(location)}
                cancel={() => history.goBack()}
              />
            </div>
          </Route>

          {/* {content === 'editPhotos' &&
            <div className={classes.content}>
              <Typography variant='h4' gutterBottom>{<Text id='actions.editPhotos}</Typography>
              <PhotosForm
                selectedLocation={selectedLocation}
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

export default LocationTab
