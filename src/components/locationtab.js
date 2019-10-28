import React from 'react'
import styled from 'styled-components'
import {
  Drawer,
  Button,
  IconButton,
  ButtonGroup,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Close } from '@material-ui/icons'
import Dropzone from 'react-dropzone'
import LocationForm from './LocationForm'
import LocationImages from './LocationImages'
import LocationInfo from './LocationInfo'
import { roundLatLng } from '../utils/helpers.js'
import { strings } from '../lang/strings.js'


const SearchResult = styled.div`
  padding: 5px 20px;
  cursor: pointer;

  &:hover {
    background: rgba(0,0,0,0.05);
  }
`

const SearchResults = styled.div`
  padding: 20px 0;
;`

const LocationTab = ({
  selectedLocation,
  content: retrievedContent,
  closeLocationTab,
  searchResults,
  setMapCenter,
  loggedIn,
  onImageUpload,
}) => {
  const [content, setContent] = React.useState()

  React.useEffect(() => {
    setContent(retrievedContent)
  }, [retrievedContent])

  const classes = useStyles()

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
      <div className={classes.inner}>
        <IconButton
          size='small'
          className={classes.close}
          aria-label='close'
          onClick={() => closeLocationTab()}
        ><Close /></IconButton>
        {content === 'searchResults' &&
          <SearchResults>
            {searchResults && searchResults.map((point, index) =>
              <SearchResult onClick={() => setMapCenter(point._source)} key={index}>
                <h5>{point._source.name}</h5>
                <p>{point._source.description}</p>
              </SearchResult>
            )}
          </SearchResults>}

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
            <h2>{strings.markerForm.heading[content]}</h2>

            {content === 'addMarker' &&
              <>
                <h3>{strings.markerForm.location}</h3>
                <p>{roundLatLng(selectedLocation.lat)} {roundLatLng(selectedLocation.lon)}</p>
              </>
            }
            <LocationForm
              selectedLocation={selectedLocation}
              onSubmitLocation={() => onSubmitLocation()}
              cancel={() => setContent('markerInfo')}
            />
          </div>
        }

        {/* TODO: Change it to notification */}
        {content === 'markerSubmitted' &&
          <div>
            <h3>{strings.markerForm.thankYouHeading}</h3>
            <p>{strings.markerForm.thankYouMessage}</p>
          </div>
        }
      </div>
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
  },
  content: {
    padding: theme.spacing(2),
  },
  close: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    zIndex: theme.zIndex.mobileStepper,
    backgroundColor: 'rgba(255, 255, 255, 0.67)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
  },
  actions: {
    marginBottom: theme.spacing(),
  },
}))

export default LocationTab
