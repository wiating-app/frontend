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
import history from '../history'
import { Location } from '../typings'
import useAuth0 from '../utils/useAuth0'

const AddButtonContainer = () => {
  const { translations } = useLanguage()
  const { requireAuth } = useAuth0()
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
            requireAuth(() => {
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
            })
          },
        },
        {
          label: translations.enterCoordinates,
          icon: <Pencil size={20} />,
          callback: () => {
            requireAuth(() => {
              setActiveLocation(null)
              history.push('/location/new')
            })
          },
        },
        ...userLocation && !error
          ? [{
              label: translations.inCurrentLocation,
              icon: <MapPinned size={20} />,
              callback: async () => {
                requireAuth(() => {
                  async () => {
                    const [lat, lon] = userLocation
                    await history.push('/location/new')
                    // Partial location will be completed by the form
                    setActiveLocation({ location: { lat, lng: lon } } as any as Location)
                  }
                })
              },
            }]
          : [],
      ]}
    />
  )
}

export default AddButtonContainer
