import React from 'react'
import { withRouter } from 'react-router-dom'
import Resizer from 'react-image-file-resizer'
import dataUriToBuffer from 'data-uri-to-buffer'
import { useRecoilState } from 'recoil'
import { useSnackbar } from 'notistack'
import api from '../api'
import { activeLocationState } from '../state'
import useAuth0 from '../utils/useAuth0'
import LocationImages from '../components/LocationImages'
import LocationInfo from '../components/LocationInfo'
import Loader from '../components/Loader'
import useLanguage from '../utils/useLanguage'
import serializeData from '../utils/serializeData'


const LocationInfoContainer = ({
  match: { params: { id } },
  history,
}) => {
  const [activeLocation, setActiveLocation] = useRecoilState(activeLocationState)
  const { translations } = useLanguage()
  const { isLoggedIn, isModerator } = useAuth0()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState()
  const [imageUploading, setImageUploading] = React.useState(false)

  // Use cached location data if avaliable, otherwise load data from endpoint.
  React.useEffect(() => {
    if (!activeLocation) {
      const handleAsync = async () => {
        try {
          const { data } = await api.post('get_point', { id })
          setActiveLocation(serializeData(data))
        } catch (error) {
          setError(true)
          enqueueSnackbar(translations.connectionProblem.location, { variant: 'error' })
        }
      }
      handleAsync()
    } else {
      setLoading(false)
    }
  }, [activeLocation])

  const onImageUpload = async files => {
    setImageUploading(true)
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
            const { data } = await api.post(`add_image/${activeLocation.id}`, fileObject)
            setActiveLocation(data)
            setImageUploading(false)
            history.push(`/location/${activeLocation.id}`)
            enqueueSnackbar(translations.notifications.photoAdded, { variant: 'success' })
          },
        )
      })
    } catch (error) {
      console.error(error)
      setImageUploading(false)
      enqueueSnackbar(translations.notifications.couldNotSavePhoto, { variant: 'error' })
    }
  }

  const handleReport = async fields => {
    try {
      const { reason, description } = fields
      const summary = `${translations.reportReasons[reason]}: ${description}`
      await api.post('report', {
        id: activeLocation.id,
        report_reason: summary,
      })
      enqueueSnackbar('Punkt zgłoszony do moderacji', { variant: 'success' })
    } catch (err) {
      console.error(err)
      enqueueSnackbar(translations.notifications.couldNotReport, { variant: 'error' })
    }
  }

  return (
    loading
      ? <Loader dark big />
      : error
        ? <div>Error!</div>
        : <>
          <LocationImages
            images={activeLocation.images}
            id={id}
            uploading={imageUploading}
            onImageUpload={files => onImageUpload(files)}
          />
          <LocationInfo
            selectedLocation={activeLocation}
            loggedIn={isLoggedIn}
            isModerator={isModerator}
            handleReport={handleReport}
          />
        </>
  )
}

export default withRouter(LocationInfoContainer)
