import { formatDate, roundLatLng } from '../utils/helpers'
import React from 'react'
import Report from './Report'
import UtilityButtons from './UtilityButtons'
import useLanguage from '../utils/useLanguage'
import useConfig from '../utils/useConfig'
import { Location } from '../typings'
import Button from './Button'
import ButtonGroup from './ButtonGroup'
import Typography from './Typography'
import Chip from './Chip'

interface LocationInfoProps {
  loggedIn: boolean
  isModerator: boolean
  selectedLocation: Location
  handleReport: (fields: { reason: string; description: string }) => void | Promise<void>
}

const LocationInfo = ({
  loggedIn,
  isModerator,
  selectedLocation,
  handleReport,
}: LocationInfoProps) => {
  const { translations, language } = useLanguage()
  const {
    locationTypes, settings: {
      enableReport,
      enableDirectionsField,
      enableFireField,
      enableWaterField,
    },
  } = useConfig()
  const [reportIsOpen, setReportIsOpen] = React.useState(false)
  const updatedAt = selectedLocation.last_modified_timestamp || selectedLocation.created_timestamp
  const type = locationTypes.find(item => item.id === selectedLocation.type)
  const typeLabel = selectedLocation.type ? type?.label[language] || '' : ''
  const roundedLat = roundLatLng(selectedLocation.location.lat)
  const roundedLng = roundLatLng(selectedLocation.location.lng)

  return (
    <div className="relative flex flex-col p-4 pt-8 shadow-md flex-grow" id='cy-locationinfo'>
      <UtilityButtons
        id={selectedLocation.id}
        coords={selectedLocation.location}
      />
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-medium leading-tight">{selectedLocation.name}</div>
          {selectedLocation.is_disabled && (
            <Chip
              size='small'
              color='secondary'
              label={translations.isDisabled}
            />
          )}
        </div>
        <div className="text-sm text-gray-500 mt-0.5 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <div>{typeLabel}</div>
            <div>|</div>
            <div>{roundedLat}, {roundedLng}</div>
          </div>
        </div>

        <div className="text-sm font-medium text-gray-500 mt-4 mb-4">
          {translations.description}
        </div>
        <Typography gutterBottom>
          {selectedLocation.description}
        </Typography>

        {enableDirectionsField && selectedLocation.directions && (
          <>
            <div className="text-sm font-medium text-gray-500 mt-4 mb-4">
              {translations.directions}
            </div>
            <Typography gutterBottom>
              {selectedLocation.directions}
            </Typography>
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
                      : selectedLocation.water_comment || translations.available
                }
              </Typography>
            )}

            {enableFireField && (
              <Typography variant="body2">
                {translations.fireLabel}:{' '}
                {selectedLocation.fire_exists === null
                  ? translations.noData
                  : !selectedLocation.fire_exists
                      ? translations.unavailable
                      : selectedLocation.fire_comment || translations.available
                }
              </Typography>
            )}
          </div>
        )}
      </div>

      <div className="h-px bg-gray-200 mt-5 mb-4" />

      <div className="flex flex-col items-end">
        {updatedAt && (
          <div className="text-xs text-gray-600 text-right mb-2">
            {translations.lastUpdate}: {formatDate(updatedAt)}
          </div>
        )}
        {loggedIn && (
          <ButtonGroup>
            {isModerator
              ? (
                  <Button
                    to={`/moderator/log?id=${selectedLocation.id}`}
                  >
                    Wyświetl logi
                  </Button>
                )
              : enableReport && (
                <Button
                  onClick={() => setReportIsOpen(true)}
                >
                  {translations.report}
                </Button>
              )
            }
            <Button
              to={`/location/${selectedLocation.id}/edit`}
            >
              {translations.edit}
            </Button>
          </ButtonGroup>
        )}
      </div>
      {reportIsOpen && (
        <Report
          handleReport={handleReport}
          onClose={() => setReportIsOpen(false)}
        />
      )}
    </div>
  )
}

export default LocationInfo
