import {
  Button,
  ButtonGroup,
  Chip,
  Grid,
  Typography,
} from '@material-ui/core'
import { formatDate, roundLatLng } from '../utils/helpers'

import { Link } from 'react-router-dom'
import React from 'react'
import Report from './Report'
import UtilityButtons from './UtilityButtons'
import locationTypes from '../utils/locationTypes'
import { makeStyles } from '@material-ui/core/styles'
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
  const type = locationTypes[selectedLocation.type]
  const typeLabel = selectedLocation.type ? translations.locationType[type.label] : ''
  const roundedLat = roundLatLng(selectedLocation.location.lat)
  const roundedLng = roundLatLng(selectedLocation.location.lng)

  return (
    <div className={classes.root}>
      <UtilityButtons
        id={selectedLocation.id}
        coords={selectedLocation.location}
      />
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
          className={classes.meta}
        >
          <Grid container spacing={1}>
            <Grid item>{typeLabel}</Grid>
            <Grid item>|</Grid>
            <Grid item>{roundedLat}, {roundedLng}</Grid>
          </Grid>
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
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    paddingTop: theme.spacing(4),
    boxShadow: theme.shadows[1],
    flexGrow: 1,
  },
  main: {
    flexGrow: 1,
  },
  meta: {
    marginTop: 2,
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: theme.spacing(2),
  },
}))

export default LocationInfo
