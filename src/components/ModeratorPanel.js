import React from 'react'
import { Route, withRouter } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Tabs, Tab } from '@material-ui/core'
import ReportsContainer from '../containers/ReportsContainer'
import LogsContainer from '../containers/LogsContainer'
import LogDetailsContainer from '../containers/LogDetailsContainer'
import ExportContainer from '../containers/ExportContainer'
import Modal from './Modal'
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
    <Modal wide onClose={() => history.push('/')}>
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

      <Route exact path='/moderator/log/:id'>
        <LogDetailsContainer />
      </Route>
    </Modal>
  )
}

const useStyles = makeStyles(theme => ({
  tabs: {
    marginBottom: theme.spacing(3),
  },
}))

export default withRouter(ModeratorPanel)
