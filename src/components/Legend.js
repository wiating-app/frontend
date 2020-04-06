import React from 'react'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import locationTypes from '../utils/locationTypes'
import { getIconUrl } from '../utils/helpers'
import useLanguage from '../utils/useLanguage'


const Legend = ({ boxed }) => {
  const classes = useStyles(boxed)
  const { translations } = useLanguage()
  return (
    <div className={classes.root}>
      <Typography variant={boxed ? 'subtitle2' : 'h5'}>
        {translations.legend}:
      </Typography>
      {Object.entries(locationTypes).map(([key, label]) =>
        <div className={classes.item} key={key}>
          <img src={getIconUrl(key)} alt='' className={classes.icon} />
          <Typography variant={boxed ? 'caption' : 'body1'}>
            {translations.locationType[label]}
          </Typography>
        </div>
      )}
    </div>
  )
}

Legend.defaultProps = {
  boxed: false,
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: boxed => boxed ? 'rgba(255,255,255,0.85)' : 'transparent',
    padding: boxed => boxed ? theme.spacing(1) : 0,
    boxShadow: boxed => boxed ? theme.shadows[1] : 0,
    borderRadius: 4,
    marginBottom: theme.spacing(0.5),
  },
  item: {
    marginTop: boxed => boxed ? theme.spacing(1) : theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    height: boxed => boxed ? 24 : 30,
    marginRight: theme.spacing(1),
  },
}))

export default Legend
