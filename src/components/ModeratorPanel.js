import React from 'react'
import { Route, withRouter } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Tabs, Tab } from '@material-ui/core'
import ReportsContainer from '../containers/ReportsContainer'
import LogsContainer from '../containers/LogsContainer'
import LogDetailsContainer from '../containers/LogDetailsContainer'
import Modal from './Modal'
import useLanguage from '../utils/useLanguage'
import useAuth0 from '../utils/useAuth0'


const ModeratorPanel = ({
  cachedLogDetails,
  setCachedLogDetails,
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

  return (
    <Modal wide onClose={() => history.push('/')}>
      <Typography
        variant='h4'
        gutterBottom
      >{translations.administration}</Typography>

      <Tabs
        value={pathname}
        className={classes.tabs}
        onChange={(e, value) => history.push(value)}
        indicatorColor='primary'
      >
        <Tab label='Dziennik zmian' value='/moderator/log' />
        <Tab label='Zgłoszenia' value='/moderator/zgloszenia' />
      </Tabs>

      <Route path='/moderator/log'>
        <LogsContainer setCachedLogDetails={setCachedLogDetails} />
      </Route>
      <Route path='/moderator/zgloszenia'>
        <ReportsContainer />
      </Route>

      <Route exact path='/moderator/log/:id'>
        <LogDetailsContainer
          cachedLogDetails={cachedLogDetails}
          setCachedLogDetails={setCachedLogDetails}
        />
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
