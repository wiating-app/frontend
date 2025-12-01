import React from 'react'
import Button from '../components/Button'
import {
  PinDrop,
  BorderColor,
  PersonPinCircle,
} from '@material-ui/icons'
import { useSnackbar } from 'notistack'
import { useRecoilState } from 'recoil'
import { editModeState, activeLocationState } from '../state'
import AddButton from '../components/AddButton'
import useLanguage from '../utils/useLanguage'
import useUserLocation from '../utils/useUserLocation'
import useAuth0 from '../utils/useAuth0'
import history from '../history'
import { Location } from '../typings'

const AddButtonContainer = () => {
  const { translations } = useLanguage()
  const { isLoggedIn } = useAuth0()
  const { userLocation, error } = useUserLocation()
  const [editMode] = useRecoilState(editModeState)
  const [, setActiveLocation] = useRecoilState(activeLocationState)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  if (editMode) return null
  return (
    <AddButton
      items={[
        {
          label: translations.pointOnMap,
          icon: <PinDrop />,
          callback: () => {
            setActiveLocation(null)
            history.push('/pin')
            enqueueSnackbar(translations.pointOnMap, {
              variant: 'info',
              anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
              persist: true,
              action: (key: string | number) =>
                <Button
                  size='small'
                  variant='primary'
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
            setActiveLocation(null)
            history.push('/location/new')
          },
        },
        ...userLocation && !error
          ? [{
              label: translations.inCurrentLocation,
              icon: <PersonPinCircle />,
              callback: async () => {
                const [lat, lon] = userLocation
                await history.push('/location/new')
                // Partial location will be completed by the form
                setActiveLocation({ location: { lat, lng: lon } } as any as Location)
              },
            }]
          : [],
      ]}
      isLoggedIn={isLoggedIn}
    />
  )
}

export default AddButtonContainer
