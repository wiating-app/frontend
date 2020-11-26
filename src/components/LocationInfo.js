import React from 'react'
import { Link } from 'react-router-dom'
import {
  Typography,
  Button,
  ButtonGroup,
  Chip,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ShareButton from './ShareButton'
import Report from './Report'
import { roundLatLng, formatDate } from '../utils/helpers'
import locationTypes from '../utils/locationTypes'
import useLanguage from '../utils/useLanguage'


const LocationInfo = ({
  loggedIn,
  isModerator,
  selectedLocation,
  handleReport,
}) => {
  const classes = useStyles()
  const { translations } = useLanguage()
  const [reportIsOpen, setReportIsOpen] = React.useState()
  const updatedAt = selectedLocation.last_modified_timestamp || selectedLocation.created_timestamp
  const type = selectedLocation.type ? translations.locationType[locationTypes[selectedLocation.type].label] : ''

  return (
    <div className={classes.root}>
      <div className={classes.main}>
        <Typography
          variant='h5'
        >{selectedLocation.name}</Typography>
        {selectedLocation.is_disabled &&
          <Chip
            size='small'
            color='secondary'
            label={translations.locationInfo.isDisabled}
          />
        }
        <Typography
          variant='body2'
          color='textSecondary'
          gutterBottom
        >
          {type} | {roundLatLng(selectedLocation.location.lat)}, {roundLatLng(selectedLocation.location.lng)} <ShareButton id={selectedLocation.id} />
        </Typography>

        <Typography
          variant='body1'
          gutterBottom
        ><strong>{translations.locationInfo.description}:</strong> {selectedLocation.description}</Typography>

        {selectedLocation.directions &&
          <Typography
            variant='body1'
            gutterBottom
          ><strong>{translations.locationInfo.directions}:</strong> {selectedLocation.directions}</Typography>
        }

        <div>
          <Typography
            variant='subtitle2'
            component='span'
          >{translations.locationInfo.water.label}: </Typography>

          <Typography
            variant='body2'
            gutterBottom
            component='span'
          >
            {selectedLocation.water_exists === null
              ? translations.noData
              : !selectedLocation.water_exists
                ? translations.unavailable
                : selectedLocation.water_comment || translations.available
            }
          </Typography>
        </div>

        <div>
          <Typography
            variant='subtitle2'
            component='span'
          >{translations.locationInfo.fire.label}: </Typography>

          <Typography
            variant='body2'
            gutterBottom
            component='span'
          >
            {selectedLocation.fire_exists === null
              ? translations.noData
              : !selectedLocation.fire_exists
                ? translations.unavailable
                : selectedLocation.fire_comment || translations.available
            }
          </Typography>
        </div>

      </div>

      <div className={classes.footer}>
        {updatedAt &&
          <Typography
            component='div'
            variant='caption'
            align='right'
            color='textSecondary'
          >{translations.locationInfo.lastUpdate}: {formatDate(updatedAt)}</Typography>
        }
        {loggedIn &&
          <ButtonGroup
            size='small'
            variant='text'
            align='right'
          >
            {isModerator
              ? <Button
                component={Link}
                to={`/moderator/log?id=${selectedLocation.id}`}
              >Wyświetl logi</Button>
              : <Button
                onClick={() => setReportIsOpen(true)}
              >{translations.actions.report}</Button>
            }
            <Button
              component={Link}
              to={`/location/${selectedLocation.id}/edit`}
            >{translations.actions.edit}</Button>
          </ButtonGroup>
        }
      </div>
      {reportIsOpen &&
        <Report
          handleReport={handleReport}
          onClose={() => setReportIsOpen(false)}
        />
      }
    </div>
  )
}


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    boxShadow: theme.shadows[1],
    flexGrow: 1,
  },
  main: {
    flexGrow: 1,
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: theme.spacing(2),
  },
}))

export default LocationInfo
