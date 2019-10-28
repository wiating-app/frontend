import React from 'react'
import { Typography } from '@material-ui/core'

const LocationInfo = ({ selectedLocation }) =>
  <>
    <Typography
      variant='h5'
      gutterBottom
    >{selectedLocation.name}</Typography>
    <Typography
      variant='body1'
      gutterBottom
    >{selectedLocation.description}</Typography>

    {selectedLocation.water && selectedLocation.water.exists
      ? <Typography
        variant='subtitle2'
      >Dostęp do wody</Typography>
      : <Typography
        variant='subtitle2'
        color='textSecondary'
      >Brak dostępu do wody</Typography>
    }

    {selectedLocation.water && selectedLocation.water.exists &&
      <Typography
        variant='body2'
        gutterBottom
      >{selectedLocation.water.comment}</Typography>
    }
    {selectedLocation.fire && selectedLocation.fire.exists
      ? <Typography
        variant='subtitle2'
      >Dostęp do ognia</Typography>
      : <Typography
        variant='subtitle2'
        color='textSecondary'
      >Brak dostępu do ognia</Typography>
    }
    {selectedLocation.fire && selectedLocation.fire.exists &&
      <Typography
        variant='body2'
        gutterBottom
      >{selectedLocation.fire.comment}</Typography>
    }
  </>

export default LocationInfo
