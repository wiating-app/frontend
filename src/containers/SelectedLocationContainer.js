import React from 'react'
import { withRouter } from 'react-router-dom'
import Resizer from 'react-image-file-resizer'
import dataUriToBuffer from 'data-uri-to-buffer'
import { useSnackbar } from 'notistack'
import api from '../api'
import { useAuth0 } from '../auth0'
import LocationImages from '../components/LocationImages'
import LocationInfo from '../components/LocationInfo'
import Loader from '../components/Loader'
import Text from '../components/Text'


const SelectedLocationContainer = ({
  cachedLocation,
  setCachedLocation,
  match,
  history,
}) => {
  const { params: { id } } = match
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
          const { data: { _id, _source } } = await api.post('get_point', { id })
          const newData = { id: _id, ..._source }
          setLocation(newData)
          setCachedLocation(newData)
        } catch (error) {
          setError(true)
          enqueueSnackbar(<Text id='connectionProblem.location' />, { variant: 'error' })
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
      const file = files[0]
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
          const data = new FormData()
          data.append('file', resizedFile)
          const { data: { _id, _source } } = await api.post(`add_image/${location.id}`, data)
          console.log('response: ', _id, _source)
          const newData = { id: _id, ..._source }
          setLocation(newData)
          setCachedLocation(newData)
          history.push(`/location/${_id}`)
          enqueueSnackbar(<Text id='notifications.photoAdded' />, { variant: 'success' })
        },
      )
    } catch (error) {
      console.error(error)
      enqueueSnackbar(<Text id='notifications.couldNotSavePhoto' />, { variant: 'error' })
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

export default withRouter(SelectedLocationContainer)
