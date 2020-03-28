import React from 'react'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import locationTypes from '../utils/locationTypes'
import { getIconUrl } from '../utils/helpers'
import useLanguage from '../utils/useLanguage'


const Legend = () => {
  const classes = useStyles()
  const { translations } = useLanguage()
  return (
    <div className={classes.root}>
      <Typography variant='subtitle2'>
        {translations.legend}:
      </Typography>
      {Object.entries(locationTypes).map(([key, label]) =>
        <div className={classes.item} key={key}>
          <img src={getIconUrl(key)} alt='' className={classes.icon} />
          <Typography variant='caption'>
            {translations.locationType[label]}
          </Typography>
        </div>
      )}
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    padding: theme.spacing(1),
    boxShadow: theme.shadows[1],
    borderRadius: 4,
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  item: {
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    height: 20,
    marginRight: theme.spacing(1),
  },
}))

export default Legend
