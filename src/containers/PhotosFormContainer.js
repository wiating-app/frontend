import React from 'react'
import { useSnackbar } from 'notistack'
import { useRecoilState } from 'recoil'
import { withRouter } from 'react-router-dom'
import Resizer from 'react-image-file-resizer'
import dataUriToBuffer from 'data-uri-to-buffer'
import ContentWrapper from '../components/ContentWrapper'
import PhotosForm from '../components/PhotosForm'
import Loader from '../components/Loader'
import useAuth0 from '../utils/useAuth0'
import useLanguage from '../utils/useLanguage'
import serializeData from '../utils/serializeData'
import { asyncForEach } from '../utils/helpers'
import api from '../api'
import { activeLocationState } from '../state'


const PhotosFormContainer = ({
  match: { params: { id } },
  history,
}) => {
  const [activeLocation, setActiveLocation] = useRecoilState(activeLocationState)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState()
  const { isLoggedIn, loading: loadingAuth } = useAuth0()
  const { enqueueSnackbar } = useSnackbar()
  const { translations } = useLanguage()

  const asyncResizeFile = file => new Promise(resolve => {
    Resizer.imageFileResizer(
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
        const { data } = await api.post(`add_image/${activeLocation.id}`, fileObject)
        setActiveLocation(serializeData(data))
        resolve()
      },
    )
  })

  const handleImageUpload = async files => {
    try {
      history.push(`/location/${activeLocation.id}?imageLoading=true`)
      await asyncForEach(files, async file => {
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
          const { data } = await api.get(`get_point/${id}`)
          setActiveLocation(serializeData(data))
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
              name={activeLocation.name}
              images={activeLocation?.images}
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

export default withRouter(PhotosFormContainer)
