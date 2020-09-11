import React from 'react'
import { withRouter } from 'react-router-dom'
import Resizer from 'react-image-file-resizer'
import dataUriToBuffer from 'data-uri-to-buffer'
import { useSnackbar } from 'notistack'
import api from '../api'
import useAuth0 from '../utils/useAuth0'
import LocationImages from '../components/LocationImages'
import LocationInfo from '../components/LocationInfo'
import Loader from '../components/Loader'
import useLanguage from '../utils/useLanguage'


const LocationInfoContainer = ({
  cachedLocation,
  setCachedLocation,
  match: { params: { id } },
  history,
}) => {
  const { translations } = useLanguage()
  const { isLoggedIn } = useAuth0()
  const { enqueueSnackbar } = useSnackbar()
  const [location, setLocation] = React.useState()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState()

  // Use cached location data if avaliable, otherwise load data from endpoint.
  React.useEffect(() => {
    if (cachedLocation) {
      setLocation(cachedLocation)
      setLoading(false)
    } else {
      const handleAsync = async () => {
        try {
          const { data } = await api.post('get_point', { id })
          setLocation(data)
          setCachedLocation(data)
        } catch (error) {
          setError(true)
          enqueueSnackbar(translations.connectionProblem.location, { variant: 'error' })
        }
        setLoading(false)
      }
      handleAsync()
    }
  }, [cachedLocation])

  // Update the component if cached location changes.
  React.useEffect(() => {
    setLocation(cachedLocation)
  }, [cachedLocation])

  const onImageUpload = async files => {
    try {
      await files.forEach(async file => {
        await Resizer.imageFileResizer(
          file,
          1080, // Maximum width
          1080, // Maximum height
          'JPEG', // Format
          80, // Quality 1-100
          0, // Rotation
          async uri => {
            const decoded = dataUriToBuffer(uri)
            const resizedFile = new File([decoded], file.name, { type: file.type })
            const fileObject = new FormData()
            fileObject.append('file', resizedFile)
            const { data } = await api.post(`add_image/${location.id}`, fileObject)
            setLocation(data)
            setCachedLocation(data)
          },
        )
      })
      history.push(`/location/${location.id}`)
      enqueueSnackbar(translations.notifications.photoAdded, { variant: 'success' })
    } catch (error) {
      console.error(error)
      enqueueSnackbar(translations.notifications.couldNotSavePhoto, { variant: 'error' })
    }
  }

  return (
    loading
      ? <Loader dark big />
      : error
        ? <div>Error!</div>
        : <>
          <LocationImages
            images={location.images}
            id={id}
          />
          <LocationInfo
            selectedLocation={location}
            loggedIn={isLoggedIn}
            onImageUpload={files => onImageUpload(files)}
          />
        </>
  )
}

export default withRouter(LocationInfoContainer)
