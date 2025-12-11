import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dataUriToBuffer from 'data-uri-to-buffer'
import Resizer from 'react-image-file-resizer'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { addImage } from '../api/addImage'
import { getPoint } from '../api/getPoint'
import ContentWrapper from '../components/ContentWrapper'
import Loader from '../components/Loader'
import PhotosForm from '../components/PhotosForm'
import { asyncForEach } from '../utils/helpers'
import useAuth0 from '../utils/useAuth0'
import useLanguage from '../utils/useLanguage'

const PhotosFormContainer = () => {
  const history = useHistory()
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { isLoggedIn, loading: loadingAuth } = useAuth0()
  const { translations } = useLanguage()

  // Use cached location data from react-query cache
  const {
    data: locationData,
    isLoading: loadingLocation,
    isError: locationError,
  } = useQuery({
    queryKey: ['activeLocation'],
    queryFn: () => getPoint(id!),
    enabled: !!id && !loadingAuth,
  })

  // Show error toast when query fails
  React.useEffect(() => {
    if (locationError && !loadingAuth) {
      toast.error(translations.connectionProblemLocation)
    }
  }, [locationError, loadingAuth, translations.connectionProblemLocation])

  const addImageMutation = useMutation({
    mutationFn: ({ locationId, file }: { locationId: string | number; file: File }) => addImage(locationId, file),
    onSuccess: data => {
      queryClient.setQueryData(['activeLocation'], data)
    },
  })

  const asyncResizeFile = (file: File, locationId: string | number): Promise<void> =>
    new Promise((resolve, reject) => {
      Resizer.imageFileResizer(
        file,
        1080, // Maximum width
        1080, // Maximum height
        'JPEG', // Format
        80, // Quality 1-100
        0, // Rotation
        async (uri: string) => {
          try {
            const decoded = dataUriToBuffer(uri)
            const resizedFile = new File([decoded as any], file.name, { type: file.type })
            await addImageMutation.mutateAsync({ locationId, file: resizedFile })
            resolve()
          } catch (err) {
            reject(err)
          }
        },
      )
    })

  const handleImageUpload = async (files: any[]) => {
    if (!locationData || !id) return
    try {
      history.push(`/location/${id}?imageLoading=true`)
      await asyncForEach(files, async (file: any) => {
        if (file?.dataFile) {
          await asyncResizeFile(file.dataFile, id)
        }
      })
      history.push(`/location/${id}`)
      toast.success(translations.photoAdded)
    } catch (err) {
      console.error(err)
      toast.error(translations.couldNotSavePhoto)
      history.push(`/location/${id}`)
    }
  }

  React.useEffect(() => {
    if (!loadingAuth && !isLoggedIn) {
      history.push(`/location/${id}`)
      toast.warning('Dodawanie lub edycja lokalizacji wymaga bycia zalogowanym.')
    }
  }, [loadingAuth, isLoggedIn, id, history])

  return (
    <ContentWrapper>
      {loadingLocation ? (
        <Loader dark big />
      ) : locationError ? (
        <div>Error!</div>
      ) : (
        <>
          <PhotosForm
            name={locationData?.name}
            handleSubmit={handleImageUpload}
            cancel={() => {
              history.push(`/location/${id}`)
            }}
          />
        </>
      )}
    </ContentWrapper>
  )
}

export default PhotosFormContainer
