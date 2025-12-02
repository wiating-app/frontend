import React from 'react'
import {
  MapPin,
  Pencil,
  MapPinned,
} from 'lucide-react'
import { toast } from 'sonner'
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

  if (editMode) return null
  return (
    <AddButton
      items={[
        {
          label: translations.pointOnMap,
          icon: <MapPin size={20} />,
          callback: () => {
            setActiveLocation(null)
            history.push('/pin')
            toast(translations.pointOnMap, {
              duration: Infinity,
              action: {
                label: translations.cancel,
                onClick: () => {
                  toast.dismiss()
                  history.push('/')
                },
              },
            })
          },
        },
        {
          label: translations.enterCoordinates,
          icon: <Pencil size={20} />,
          callback: () => {
            setActiveLocation(null)
            history.push('/location/new')
          },
        },
        ...userLocation && !error
          ? [{
              label: translations.inCurrentLocation,
              icon: <MapPinned size={20} />,
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
