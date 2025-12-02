import React from 'react'
import Typography from '../components/Typography'
import Button from '../components/Button'
import { toast } from 'sonner'
import Loader from '../components/Loader'
import { getPoints } from '../api/getPoints'
import useLanguage from '../utils/useLanguage'
import exportToKML from '../utils/exportToKML'
import useConfig from '../utils/useConfig'

const ExportContainer = () => {
  const { translations } = useLanguage()
  const [loading, setLoading] = React.useState(false)
  const config = useConfig()

  const handleExport = async () => {
    setLoading(true)
    try {
      const points = await getPoints({
        top_right: {
          lat: 90,
          lon: 180,
        },
        bottom_left: {
          lat: -90,
          lon: -180,
        },
      })
      await exportToKML(points, config)
      setLoading(false)
    } catch (err) {
      console.error(err)
      toast.error('Error!')
      setLoading(false)
    }
  }

  return (
    <>
      <Typography gutterBottom>{translations.exportSentence}</Typography>
      <div className="flex items-center gap-2">
        <div>
          <Button
            variant='primary'
            disabled={loading}
            onClick={handleExport}
          >
            {loading && <Loader />}
            {translations.exportButton}
          </Button>
        </div>
        {loading &&
          <div>
            <Typography>{translations.iAmWorking}</Typography>
          </div>
        }
      </div>
    </>
  )
}

export default ExportContainer
