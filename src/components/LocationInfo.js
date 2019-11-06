import React from 'react'
import { Typography } from '@material-ui/core'
import { roundLatLng, formatDate } from '../utils/helpers'
import locationTypes from '../utils/locationTypes'


const LocationInfo = ({ selectedLocation }) =>
  <>
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
      >Dostęp do wody: </Typography>

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
      >Dostęp do ognia: </Typography>

      {selectedLocation.fire &&
        <Typography
          variant='body2'
          gutterBottom
          component='span'
        >
          {!selectedLocation.fire.exists
            ? 'Brak.'
            : selectedLocation.fire.comment || 'Jest.'
          }
        </Typography>
      }
    </div>

    {selectedLocation.created_timestamp &&
      <Typography
        component='div'
        variant='caption'
        align='right'
        color='textSecondary'
      ><br />Ostatnia aktualizacja: {formatDate(selectedLocation.created_timestamp)}</Typography>
    }
  </>

export default LocationInfo
