import React from 'react'
import {
  Typography,
  Button,
  ButtonGroup,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Dropzone from 'react-dropzone'
import Loader from './Loader'
import { roundLatLng, formatDate } from '../utils/helpers'
import locationTypes from '../utils/locationTypes'
import Text from './Text'


const LocationInfo = ({
  loggedIn,
  selectedLocation,
  setLocationTabContent,
  onImageUpload,
}) => {
  const classes = useStyles()
  const [imagesLoading, setImagesLoading] = React.useState()
  const updatedAt = selectedLocation.last_modified_timestamp || selectedLocation.created_timestamp
  return (
    <div className={classes.root}>
      <div className={classes.main}>
        <Typography
          variant='h5'
        >{selectedLocation.name}</Typography>

        <Typography
          variant='body2'
          color='textSecondary'
          gutterBottom
        >{locationTypes[selectedLocation.type]} | {roundLatLng(selectedLocation.location.lat)}, {roundLatLng(selectedLocation.location.lon)}</Typography>

        <Typography
          variant='body1'
          gutterBottom
        >{selectedLocation.description}</Typography>

        <div>
          <Typography
            variant='subtitle2'
            component='span'
          ><Text id='locationInfo.waterAccess' />: </Typography>

          {selectedLocation.water &&
            <Typography
              variant='body2'
              gutterBottom
              component='span'
            >
              {!selectedLocation.water.exists
                ? 'Brak.'
                : selectedLocation.water.comment || 'Jest.'
              }
            </Typography>
          }
        </div>

        <div>
          <Typography
            variant='subtitle2'
            component='span'
          ><Text id='locationInfo.waterAccess' />: </Typography>

          {selectedLocation.fire &&
            <Typography
              variant='body2'
              gutterBottom
              component='span'
            >
              {!selectedLocation.fire.exists
                ? <Text id='none' />
                : selectedLocation.fire.comment || <Text id='is' />
              }.
            </Typography>
          }
        </div>

      </div>

      <div className={classes.footer}>
        {updatedAt &&
          <Typography
            component='div'
            variant='caption'
            align='right'
            color='textSecondary'
          ><Text id='locationInfo.lastUpdate' />: {formatDate(updatedAt)}</Typography>
        }
        {loggedIn &&
          <ButtonGroup
            size='small'
            variant='text'
            align='right'
          >
            <Button
              onClick={() => setLocationTabContent('editMarker')}
            ><Text id='actions.edit' /></Button>
            {imagesLoading
              ? <Button disabled><Text id='actions.addPhoto' /> <Loader /></Button>
              : <Button>
                <Dropzone onDrop={async files => {
                  setImagesLoading(true)
                  await onImageUpload(files)
                  setImagesLoading(false)
                }}>
                  {({ getRootProps, getInputProps }) => (
                    <section>
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <Text id='actions.addPhoto' />
                      </div>
                    </section>
                  )}
                </Dropzone>
              </Button>
            }
          </ButtonGroup>
        }
      </div>
    </div>
  )
}


const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    flexGrow: 1,
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: theme.spacing(2),
  },
}))

export default LocationInfo
