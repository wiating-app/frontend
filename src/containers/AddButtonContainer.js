import React from 'react'
import { Button } from '@material-ui/core'
import {
  PinDrop,
  BorderColor,
  PersonPinCircle,
} from '@material-ui/icons'
import { useSnackbar } from 'notistack'
import AddButton from '../components/AddButton'
import useLanguage from '../utils/useLanguage'
import useCurrentLocation from '../utils/useCurrentLocation'
import useAuth0 from '../utils/useAuth0'
import history from '../history'


const AddButtonContainer = ({ setCachedLocation }) => {
  const { translations } = useLanguage()
  const { isLoggedIn } = useAuth0()
  const { location, error } = useCurrentLocation()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  return (
    <AddButton
      items={[
        {
          label: translations.pointOnMap,
          icon: <PinDrop />,
          callback: () => {
            setCachedLocation(null)
            history.push('/pin')
            enqueueSnackbar(translations.notifications.pointOnMap, {
              variant: 'info',
              anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
              persist: true,
              action: key =>
                <Button
                  size='small'
                  variant='contained'
                  color='primary'
                  onClick={() => {
                    closeSnackbar(key)
                    history.push('/')
                  }}
                >{translations.cancel}</Button>,
            })
          },
        },
        {
          label: translations.enterCoordinates,
          icon: <BorderColor />,
          callback: () => {
            history.push('/location/new')
          },
        },
        ...location && !error ? [{
          label: translations.inCurrentLocation,
          icon: <PersonPinCircle />,
          callback: async () => {
            const [lat, lon] = location
            await history.push('/location/new')
            setCachedLocation({ location: { lat, lon } })
          },
        }] : [],
      ]}
      isLoggedIn={isLoggedIn}
    />
  )
}

export default AddButtonContainer
