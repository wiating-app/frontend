import {
  Button,
  ButtonGroup,
  Chip,
  Grid,
  Typography,
  Divider,
} from '@material-ui/core'
import { formatDate, roundLatLng } from '../utils/helpers'

import { Link } from 'react-router-dom'
import React from 'react'
import Report from './Report'
import UtilityButtons from './UtilityButtons'
import { makeStyles } from '@material-ui/core/styles'
import useLanguage from '../utils/useLanguage'
import useConfig from '../utils/useConfig'

const LocationInfo = ({
  loggedIn,
  isModerator,
  selectedLocation,
  handleReport,
}) => {
  const classes = useStyles()
  const { translations, language } = useLanguage()
  const { locationTypes, settings: {
    enableReport,
    enableDirectionsField,
    enableFireField,
    enableWaterField,
  } } = useConfig()
  const [reportIsOpen, setReportIsOpen] = React.useState()
  const updatedAt = selectedLocation.last_modified_timestamp || selectedLocation.created_timestamp
  const type = locationTypes.find(item => item.id === selectedLocation.type)
  const typeLabel = selectedLocation.type ? type.label[language] : ''
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
            label={translations.isDisabled}
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

        <Typography variant='subtitle2' className={classes.paddedText}>
          {translations.description}
        </Typography>

        <Typography variant='body1' className={classes.paddedText}>
          {selectedLocation.description}
        </Typography>

        {enableDirectionsField && selectedLocation.directions &&
          <>
            <Typography variant='subtitle2' className={classes.paddedText}>
              {translations.directions}
            </Typography>
            <Typography variant='body1' className={classes.paddedText}>
              {selectedLocation.directions}
            </Typography>
          </>
        }

        <Divider />

        {(enableFireField || enableWaterField) &&
          <div className={classes.paddedText}>

            {enableWaterField &&
              <Typography variant='body2' gutterBottom>
                {translations.waterLabel}:{' '}
                {selectedLocation.water_exists === null
                  ? translations.noData
                  : !selectedLocation.water_exists
                    ? translations.unavailable
                    : selectedLocation.water_comment || translations.available
                }
              </Typography>
            }

            {enableFireField &&
              <Typography variant='body2'>
                {translations.fireLabel}:{' '}
                {selectedLocation.fire_exists === null
                  ? translations.noData
                  : !selectedLocation.fire_exists
                    ? translations.unavailable
                    : selectedLocation.fire_comment || translations.available
                }
              </Typography>
            }

          </div>
        }

      </div>

      <div className={classes.footer}>
        {updatedAt &&
          <Typography
            component='div'
            variant='caption'
            align='right'
            color='textSecondary'
          >{translations.lastUpdate}: {formatDate(updatedAt)}</Typography>
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
              : enableReport && <Button
                onClick={() => setReportIsOpen(true)}
              >{translations.report}</Button>
            }
            <Button
              component={Link}
              to={`/location/${selectedLocation.id}/edit`}
            >{translations.edit}</Button>
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
  paddedText: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: theme.spacing(2),
  },
}))

export default LocationInfo
