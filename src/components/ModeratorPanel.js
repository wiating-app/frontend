import React from 'react'
import { Route, withRouter } from 'react-router-dom'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Tabs, Tab, IconButton } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import ReportsContainer from '../containers/ReportsContainer'
import LogsContainer from '../containers/LogsContainer'
import LogDetailsContainer from '../containers/LogDetailsContainer'
import ExportContainer from '../containers/ExportContainer'
import UnpublishedContainer from '../containers/UnpublishedContainer'
import useLanguage from '../utils/useLanguage'
import useAuth0 from '../utils/useAuth0'


const ModeratorPanel = ({
  history,
  location: { pathname },
}) => {
  const { translations } = useLanguage()
  const { loading: loadingAuth, isModerator } = useAuth0()
  const classes = useStyles()

  React.useEffect(() => {
    // Invisible guarding.
    if (!loadingAuth && !isModerator) {
      history.push('/')
    }
  }, [loadingAuth])

  const pathArray = pathname.split('/')

  return (
    <PerfectScrollbar className={classes.root}>
      <Typography
        variant='h4'
        gutterBottom
      >{translations.administration}</Typography>

      <Tabs
        value={`/${pathArray[1]}/${pathArray[2]}`}
        className={classes.tabs}
        onChange={(e, value) => history.push(value)}
        indicatorColor='primary'
      >
        <Tab label={translations.changeLog} value='/moderator/log' />
        <Tab label={translations.reports} value='/moderator/reports' />
        <Tab label={translations.export} value='/moderator/export' />
        <Tab label={translations.unpublished} value='/moderator/unpublished' />
      </Tabs>

      <Route path='/moderator/log'>
        <LogsContainer />
      </Route>
      <Route path='/moderator/reports'>
        <ReportsContainer />
      </Route>
      <Route path='/moderator/export'>
        <ExportContainer />
      </Route>
      <Route path='/moderator/unpublished'>
        <UnpublishedContainer />
      </Route>

      <Route exact path='/moderator/log/:id'>
        <LogDetailsContainer />
      </Route>

      <IconButton
        className={classes.close}
        onClick={() => history.push('/')}
      ><Close /></IconButton>

    </PerfectScrollbar>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
    boxSizing: 'border-box',
    width: '100%',
  },
  tabs: {
    marginBottom: theme.spacing(3),
  },
  close: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
}))

export default withRouter(ModeratorPanel)
