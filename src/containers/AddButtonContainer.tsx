import React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { MapPin, MapPinned, Pencil } from 'lucide-react'
import { useRecoilState } from 'recoil'
import { toast } from 'sonner'
import AddButton from '../components/AddButton'
import history from '../history'
import { editModeState } from '../state'
import useAuth0 from '../utils/useAuth0'
import useLanguage from '../utils/useLanguage'
import useUserLocation from '../utils/useUserLocation'

const AddButtonContainer = () => {
  const { translations } = useLanguage()
  const { requireAuth } = useAuth0()
  const { userLocation, error } = useUserLocation()
  const [editMode] = useRecoilState(editModeState)
  const queryClient = useQueryClient()

  if (editMode) return null
  return (
    <AddButton
      items={[
        {
          label: translations.pointOnMap,
          icon: <MapPin size={20} />,
          callback: () => {
            requireAuth(() => {
              queryClient.removeQueries({ queryKey: ['location'] })
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
              queryClient.removeQueries({ queryKey: ['location'] })
              history.push('/location/new')
            })
          },
        },
        ...(userLocation && !error
          ? [
              {
                label: translations.inCurrentLocation,
                icon: <MapPinned size={20} />,
                callback: () => {
                  requireAuth(() => {
                    const [lat, lon] = userLocation
                    history.push(`/location/new?lat=${lat}&lng=${lon}`)
                  })
                },
              },
            ]
          : []),
      ]}
    />
  )
}

export default AddButtonContainer
