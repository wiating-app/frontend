import React from 'react'
import { useMutation } from '@tanstack/react-query'
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
  const config = useConfig()

  const exportMutation = useMutation({
    mutationFn: () => getPoints({
      top_right: {
        lat: 90,
        lon: 180,
      },
      bottom_left: {
        lat: -90,
        lon: -180,
      },
    }),
    onSuccess: (points) => {
      exportToKML(points, config)
    },
    onError: () => {
      toast.error('Error!')
    },
  })

  const handleExport = () => {
    exportMutation.mutate()
  }

  return (
    <>
      <Typography gutterBottom>{translations.exportSentence}</Typography>
      <div className="flex items-center gap-2">
        <div>
          <Button
            variant='primary'
            size='large'
            disabled={exportMutation.isLoading}
            onClick={handleExport}
          >
            {exportMutation.isLoading && <Loader />}
            {translations.exportButton}
          </Button>
        </div>
        {exportMutation.isLoading &&
          <div>
            <Typography>{translations.iAmWorking}</Typography>
          </div>
        }
      </div>
    </>
  )
}

export default ExportContainer
