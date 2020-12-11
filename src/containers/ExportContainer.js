import React from 'react'
import { Typography, Button, Grid } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import Loader from '../components/Loader'
import api from '../api'
import useLanguage from '../utils/useLanguage'
import serializeData from '../utils/serializeData'
import exportToKML from '../utils/exportToKML'

const ExportContainer = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { translations } = useLanguage()
  const [loading, setLoading] = React.useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const { data: { points } } = await api.post('get_points', {
        top_right: {
          lat: 90,
          lon: 180,
        },
        bottom_left: {
          lat: -90,
          lon: -180,
        },
      })
      const serializedPoints = points.map(item => serializeData(item))
      await exportToKML(serializedPoints)
      setLoading(false)
    } catch (err) {
      console.error(err)
      enqueueSnackbar('Error!', { variant: 'error' })
      setLoading(false)
    }
  }

  return (
    <>
      <Typography gutterBottom>{translations.exportSentence}</Typography>
      <Grid container alignItems='center' spacing={1}>
        <Grid item>
          <Button
            variant='contained'
            color='primary'
            disabled={loading}
            onClick={handleExport}
          >
            {loading && <Loader />}
            {translations.exportButton}
          </Button>
        </Grid>
        {loading &&
          <Grid item>
            <Typography>{translations.iAmWorking}</Typography>
          </Grid>
        }
      </Grid>
    </>
  )
}

export default ExportContainer
