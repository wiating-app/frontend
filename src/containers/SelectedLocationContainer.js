import React from 'react'
import { withRouter } from 'react-router-dom'
import { Button } from '@material-ui/core'
import { ViewList } from '@material-ui/icons'
import Resizer from 'react-image-file-resizer'
import dataUriToBuffer from 'data-uri-to-buffer'
import api from '../api'
import { useAuth0 } from '../auth0'
import LocationImages from '../components/LocationImages'
import LocationInfo from '../components/LocationInfo'
import Loader from '../components/Loader'


const SelectedLocationContainer = ({ match, history }) => {
  const { params: { id } } = match
  const { isLoggedIn } = useAuth0()
  const [loading, setLoading] = React.useState(true)
  const [location, setLocation] = React.useState()
  const [error, setError] = React.useState()

  React.useEffect(() => {
    const handleAsync = async () => {
      setLoading(true)
      try {
        const { data } = await api.post('get_point', { id })
        console.log('data: ', data);
        setLocation(data)
      } catch (error) {
        setError(true)
      }
      setLoading(false)
    }
    handleAsync()
  }, [])

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
          const { data: { _id, _source } } = await api.post(`add_image/${selectedLocation.id}`, data)
          console.log('response: ', _id, _source)
          setSelectedLocation({ id: _id, ..._source })
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
      ? <Loader />
      : error
        ? <div>Error!</div>
        : <>
          <LocationImages
            images={location.images}
            id={id}
          />
          {searchResults &&
            <Button
              onClick={() => history.push('/search')}
              className={classes.backToSearch}
              variant='contained'
              size='small'
            ><ViewList /> Powrót do wyników</Button>
          }
          <div className={classes.content}>
            <LocationInfo
              selectedLocation={location}
              loggedIn={isLoggedIn}
              onImageUpload={files => onImageUpload(files)}
            />
          </div>
        </>
  )
}

export default withRouter(SelectedLocationContainer)
