import React from 'react'
import history from '../history'
import { Location } from '../typings'
import { formatDate, roundLatLng } from '../utils/helpers'
import useAuth0 from '../utils/useAuth0'
import useConfig from '../utils/useConfig'
import useLanguage from '../utils/useLanguage'
import Button from './Button'
import ButtonGroup from './ButtonGroup'
import Chip from './Chip'
import Report from './Report'
import Typography from './Typography'
import UtilityButtons from './UtilityButtons'

interface LocationInfoProps {
  isModerator: boolean
  selectedLocation: Location
  handleReport: (fields: { reason: string; description: string }) => void | Promise<void>
}

const LocationInfo = ({ isModerator, selectedLocation, handleReport }: LocationInfoProps) => {
  const { translations, language } = useLanguage()
  const {
    locationTypes,
    settings: { enableReport, enableDirectionsField, enableFireField, enableWaterField },
  } = useConfig()
  const { requireAuth } = useAuth0()
  const [reportIsOpen, setReportIsOpen] = React.useState(false)
  const updatedAt = selectedLocation.last_modified_timestamp || selectedLocation.created_timestamp
  const type = locationTypes.find(item => item.id === selectedLocation.type)
  const typeLabel = selectedLocation.type ? type?.label[language] || '' : ''
  const roundedLat = roundLatLng(selectedLocation.location.lat)
  const roundedLng = roundLatLng(selectedLocation.location.lng)

  const handleReportClick = () => {
    requireAuth(() => setReportIsOpen(true))
  }

  const handleEditClick = () => {
    requireAuth(() => history.push(`/location/${selectedLocation.id}/edit`))
  }

  return (
    <div className="relative flex flex-grow flex-col p-4 pt-8 shadow-md" id="cy-locationinfo">
      <UtilityButtons id={selectedLocation.id} coords={selectedLocation.location} />
      <div className="flex-grow">
        <div className="text-2xl font-medium leading-tight">{selectedLocation.name}</div>
        {selectedLocation.is_disabled && <Chip color="secondary" label={translations.isDisabled} className="mt-1" />}
        <div className="mb-4 mt-0.5 text-sm text-gray-500">
          <div className="flex flex-wrap items-center gap-1.5">
            <div>{typeLabel}</div>
            <div>|</div>
            <div>
              {roundedLat}, {roundedLng}
            </div>
          </div>
        </div>

        <div className="mb-4 mt-4 text-sm font-medium text-gray-500">{translations.description}</div>
        <Typography gutterBottom>{selectedLocation.description}</Typography>

        {enableDirectionsField && selectedLocation.directions && (
          <>
            <div className="mb-4 mt-4 text-sm font-medium text-gray-500">{translations.directions}</div>
            <Typography gutterBottom>{selectedLocation.directions}</Typography>
          </>
        )}

        {(enableFireField || enableWaterField) && (
          <div>
            {enableWaterField && (
              <Typography variant="body2">
                {translations.waterLabel}:{' '}
                {selectedLocation.water_exists === null
                  ? translations.noData
                  : !selectedLocation.water_exists
                    ? translations.unavailable
                    : selectedLocation.water_comment || translations.available}
              </Typography>
            )}

            {enableFireField && (
              <Typography variant="body2">
                {translations.fireLabel}:{' '}
                {selectedLocation.fire_exists === null
                  ? translations.noData
                  : !selectedLocation.fire_exists
                    ? translations.unavailable
                    : selectedLocation.fire_comment || translations.available}
              </Typography>
            )}
          </div>
        )}
      </div>

      <div className="mb-4 mt-5 h-px bg-gray-200" />

      <div className="flex flex-col items-end">
        {updatedAt && (
          <div className="mb-2 text-right text-xs text-gray-600">
            {translations.lastUpdate}: {formatDate(updatedAt)}
          </div>
        )}
        <ButtonGroup>
          {isModerator ? (
            <Button to={`/moderator/log?id=${selectedLocation.id}`}>Wyświetl logi</Button>
          ) : (
            enableReport && <Button onClick={handleReportClick}>{translations.report}</Button>
          )}
          <Button onClick={handleEditClick}>{translations.edit}</Button>
        </ButtonGroup>
      </div>
      {reportIsOpen && <Report handleReport={handleReport} onClose={() => setReportIsOpen(false)} />}
    </div>
  )
}

export default LocationInfo
