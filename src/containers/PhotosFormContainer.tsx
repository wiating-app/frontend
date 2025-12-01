import React from 'react'
import { useSnackbar } from 'notistack'
import { useRecoilState } from 'recoil'
import { useHistory, useParams } from 'react-router-dom'
import Resizer from 'react-image-file-resizer'
import dataUriToBuffer from 'data-uri-to-buffer'
import ContentWrapper from '../components/ContentWrapper'
import PhotosForm from '../components/PhotosForm'
import Loader from '../components/Loader'
import useAuth0 from '../utils/useAuth0'
import useLanguage from '../utils/useLanguage'
import { asyncForEach } from '../utils/helpers'
import { addImage } from '../api/addImage'
import { getPoint } from '../api/getPoint'
import { activeLocationState } from '../state'

const PhotosFormContainer = () => {
  const history = useHistory()
  const { id } = useParams<{ id: string }>()
  const [activeLocation, setActiveLocation] = useRecoilState(activeLocationState)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)
  const { isLoggedIn, loading: loadingAuth } = useAuth0()
  const { enqueueSnackbar } = useSnackbar()
  const { translations } = useLanguage()

  const asyncResizeFile = (file: File): Promise<void> => new Promise(resolve => {
    Resizer.imageFileResizer(
      file,
      1080, // Maximum width
      1080, // Maximum height
      'JPEG', // Format
      80, // Quality 1-100
      0, // Rotation
      async (uri: string) => {
        const decoded = dataUriToBuffer(uri)
        const resizedFile = new File([decoded as any], file.name, { type: file.type })
        if (!activeLocation?.id) {
          resolve()
          return
        }
        const data = await addImage(activeLocation.id, resizedFile)
        setActiveLocation(data)
        resolve()
      },
    )
  })

  const handleImageUpload = async (files: any[]) => {
    if (!activeLocation) return
    try {
      history.push(`/location/${activeLocation.id}?imageLoading=true`)
      await asyncForEach(files, async (file: any) => {
        file?.dataFile && await asyncResizeFile(file.dataFile)
      })
      history.push(`/location/${activeLocation.id}`)
      enqueueSnackbar(translations.photoAdded, { variant: 'success' })
    } catch (err) {
      console.error(err)
      enqueueSnackbar(translations.couldNotSavePhoto, { variant: 'error' })
      history.push(`/location/${activeLocation.id}`)
    }
  }

  React.useEffect(() => {
    if (!loadingAuth && !isLoggedIn) {
      history.push(`/location/${id}`)
      enqueueSnackbar('Dodawanie lub edycja lokalizacji wymaga bycia zalogowanym.', { variant: 'warning' })
    }
  }, [loadingAuth])

  // Use cached location data if avaliable, otherwise load data from endpoint.
  React.useEffect(() => {
    if (!activeLocation) {
      const handleAsync = async () => {
        try {
          const data = await getPoint(id)
          setActiveLocation(data)
        } catch (error) {
          setError(true)
          setLoading(false)
          enqueueSnackbar(translations.connectionProblemLocation, { variant: 'error' })
        }
      }
      handleAsync()
    } else {
      setLoading(false)
    }
  }, [activeLocation])

  return (
    <ContentWrapper>
      {loading || loadingAuth
        ? <Loader dark big />
        : error
          ? <div>Error!</div>
          : <>
            <PhotosForm
              name={activeLocation?.name}
              handleSubmit={handleImageUpload}
              cancel={() => {
                history.push(`/location/${id}`)
              }}
            />
          </>
      }
    </ContentWrapper>
  )
}

export default PhotosFormContainer
