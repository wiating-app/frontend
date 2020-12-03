import React from 'react'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { ViewList } from '@material-ui/icons'
import { useRecoilState } from 'recoil'
import useLanguage from '../utils/useLanguage'
import { searchResultsState, activeLocationState } from '../state'
import history from '../history'

const BackToSearch = () => {
  const classes = useStyles()
  const [searchResults] = useRecoilState(searchResultsState)
  const [, setActiveLocation] = useRecoilState(activeLocationState)
  const { translations } = useLanguage()

  if (!searchResults.length) return null
  return (
    <Button
      onClick={() => {
        history.push('/search')
        setActiveLocation(null)
      }}
      className={classes.root}
      variant='contained'
      size='small'
    ><ViewList /> {translations.backToResults}</Button>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: theme.spacing(1),
    left: theme.spacing(1),
    zIndex: theme.zIndex.mobileStepper,
  },
}))

export default BackToSearch
