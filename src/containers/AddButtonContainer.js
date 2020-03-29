import React from 'react'
import {
  PinDrop,
  BorderColor,
  PersonPinCircle,
} from '@material-ui/icons'
import AddButton from '../components/AddButton'
import useLanguage from '../utils/useLanguage'
import useCurrentLocation from '../utils/useCurrentLocation'
import useAuth0 from '../utils/useAuth0'
import history from '../history'


const AddButtonContainer = ({ setCachedLocation }) => {
  const { translations } = useLanguage()
  const { isLoggedIn } = useAuth0()
  const { location, error } = useCurrentLocation()
  return (
    <AddButton
      items={[
        {
          label: translations.pointOnMap,
          icon: <PinDrop />,
          callback: () => {
            history.push('/location/new')
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
            await history.push(`/location/new`)
            setCachedLocation({ location: { lat, lon } })
          },
        }] : [],
      ]}
      isLoggedIn={isLoggedIn}
    />
  )
}

export default AddButtonContainer
