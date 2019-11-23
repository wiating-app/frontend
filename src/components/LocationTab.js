import React from 'react'
import {
  Drawer,
  Button,
  IconButton,
  Typography,
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
import { strings } from '../lang/strings.js'


const LocationTab = ({
  selectedLocation,
  content,
  setLocationTabContent,
  closeLocationTab,
  searchResults,
  setActiveMarker,
  setSelectedLocation,
  loggedIn,
  onSubmitLocation,
  onImageUpload,
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <Drawer
      open={!!content}
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
          onClick={() => closeLocationTab()}
        ><Close /></IconButton>
        {content === 'searchResults' &&
          <SearchResults
            items={searchResults}
            setActiveMarker={setActiveMarker}
            setSelectedLocation={location => setSelectedLocation(location)}
            setLocationTabContent={content => setLocationTabContent(content)}
          />
        }

        {content === 'markerInfo' && selectedLocation &&
          <>
            <LocationImages
              images={selectedLocation.images}
              id={selectedLocation.id}
            />
            {searchResults &&
              <Button
                onClick={() => setLocationTabContent('searchResults')}
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
                setLocationTabContent={content => setLocationTabContent(content)}
              />
            </div>
          </>
        }

        {['addMarker', 'editMarker'].includes(content) &&
          <div className={classes.content}>
            <Typography variant='h4' gutterBottom>{strings.markerForm.heading[content]}</Typography>
            <LocationForm
              selectedLocation={selectedLocation}
              onSubmitLocation={(fields, editExisting) => onSubmitLocation(fields, editExisting)}
              setActiveMarker={location => setActiveMarker(location)}
              cancel={() => setLocationTabContent('markerInfo')}
            />
          </div>
        }

        {/* {content === 'editPhotos' &&
          <div className={classes.content}>
            <Typography variant='h4' gutterBottom>{strings.actions.editPhotos}</Typography>
            <PhotosForm
              selectedLocation={selectedLocation}
              onSubmitLocation={files => onImageUpload(files)}
              cancel={() => setLocationTabContent('markerInfo')}
            />
          </div>
        } */}
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
