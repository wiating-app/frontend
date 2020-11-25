import React from 'react'
import classNames from 'classnames'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useRecoilState } from 'recoil'
import { activeTypesState } from '../state'
import locationTypes from '../utils/locationTypes'
import generateMarkerIcon from '../utils/generateMarkerIcon'
import useLanguage from '../utils/useLanguage'


const Legend = ({ boxed }) => {
  const classes = useStyles(boxed)
  const [activeTypes, setActiveTypes] = useRecoilState(activeTypesState)
  const { translations } = useLanguage()

  const handleOnClick = key => {
    if (activeTypes.includes(key) && activeTypes.length) {
      setActiveTypes(activeTypes.filter(item => item !== key))
    } else {
      setActiveTypes([
        ...activeTypes,
        key,
      ])
    }
  }

  return (
    <div className={classes.root}>
      <Typography
        variant={boxed ? 'subtitle2' : 'h5'}
        className={classes.label}
      >{translations.legend}:</Typography>
      {Object.entries(locationTypes).map(([key, { label }]) =>
        <div
          className={classNames(classes.item, {
            [classes.active]: activeTypes.includes(key) || !activeTypes.length,
          })}
          key={key}
          onClick={() => handleOnClick(key)}
        >
          <div
            dangerouslySetInnerHTML={{ __html: generateMarkerIcon(key, boxed ? 24 : 30) }}
            className={classes.icon}
          />
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
    paddingTop: boxed => boxed ? theme.spacing(1) : 0,
    paddingBottom: boxed => boxed ? theme.spacing(1) : 0,
    boxShadow: boxed => boxed ? theme.shadows[1] : 0,
    borderRadius: 4,
    marginBottom: theme.spacing(0.5),
    minWidth: 168,
  },
  label: {
    paddingLeft: boxed => boxed ? theme.spacing(1) : 0,
    paddingBottom: boxed => boxed ? 4 : theme.spacing(1),
  },
  icon: {
    marginRight: 6,
    marginBottom: -5,
    marginLeft: -2,
  },
  item: {
    paddingTop: boxed => boxed ? 4 : theme.spacing(1),
    paddingBottom: boxed => boxed ? 4 : theme.spacing(1),
    paddingLeft: boxed => boxed ? theme.spacing(1) : 0,
    paddingRight: boxed => boxed ? theme.spacing(1) : 0,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    opacity: 0.5,
    '&:hover': {
      backgroundColor: 'white',
    },
  },
  active: {
    opacity: 1,
    '& span': {
      fontWeight: theme.typography.fontWeightMedium,
    },
  },
}))

export default Legend
