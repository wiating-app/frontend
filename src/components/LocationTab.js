import React from 'react'
import {
  Drawer,
  Button,
  IconButton,
  ButtonGroup,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Close } from '@material-ui/icons'
import Dropzone from 'react-dropzone'
import PerfectScrollbar from 'react-perfect-scrollbar'
import LocationForm from './LocationForm'
import LocationImages from './LocationImages'
import LocationInfo from './LocationInfo'
import SearchResults from './SearchResults'
import { roundLatLng } from '../utils/helpers'
import { strings } from '../lang/strings.js'


const LocationTab = ({
  selectedLocation,
  content: contentProp,
  closeLocationTab,
  searchResults,
  setMapCenter,
  setSelectedLocation,
  loggedIn,
  onSubmitLocation,
  onImageUpload,
}) => {
  const [content, setContent] = React.useState()
  const classes = useStyles()

  React.useEffect(() => {
    if (['addMarker', 'editMarker'].includes(content)) {
      setContent('markerInfo')
    }
  }, [selectedLocation])

  React.useEffect(() => {
    setContent(contentProp)
  }, [contentProp])

  return (
    <Drawer
      open={!!content}
      variant='persistent'
      anchor='left'
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
            setMapCenter={setMapCenter}
            setSelectedLocation={location => setSelectedLocation(location)}
            setContent={content => setContent(content)}
          />
        }

        {content === 'markerInfo' && selectedLocation &&
          <>
            <LocationImages
              images={selectedLocation.images}
              id={selectedLocation.id}
            />
            <div className={classes.content}>
              {loggedIn &&
                <ButtonGroup size='small' className={classes.actions}>
                  <Button
                    onClick={() => setContent('editMarker')}
                  >{strings.actions.edit}</Button>
                  <Button>
                    <Dropzone onDrop={files => onImageUpload(files)}>
                      {({ getRootProps, getInputProps }) => (
                        <section>
                          <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            {strings.actions.addPhoto}
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </Button>
                </ButtonGroup>
              }
              <LocationInfo selectedLocation={selectedLocation} />
            </div>
          </>
        }

        {['addMarker', 'editMarker'].includes(content) &&
          <div className={classes.content}>
            <Typography variant='h4' gutterBottom>{strings.markerForm.heading[content]}</Typography>

            {content === 'addMarker' &&
              <Typography gutterBottom>
                <strong>{strings.markerForm.location}:</strong> {roundLatLng(selectedLocation.location.lat)} {roundLatLng(selectedLocation.location.lon)}
              </Typography>
            }
            <LocationForm
              selectedLocation={selectedLocation}
              onSubmitLocation={(fields, editExisting) => onSubmitLocation(fields, editExisting)}
              cancel={() => setContent('markerInfo')}
            />
          </div>
        }
      </PerfectScrollbar>
    </Drawer>
  )
}

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    width: 400,
    boxShadow: theme.shadows[2],
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
  actions: {
    marginBottom: theme.spacing(),
  },
}))

export default LocationTab
