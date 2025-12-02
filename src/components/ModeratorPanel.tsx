import React from 'react'
import { Route, useHistory, useLocation } from 'react-router-dom'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { X } from 'lucide-react'
import Heading from './Heading'
import Tabs, { Tab } from './Tabs'
import IconButton from './IconButton'
import ReportsContainer from '../containers/ReportsContainer'
import LogsContainer from '../containers/LogsContainer'
import LogDetailsContainer from '../containers/LogDetailsContainer'
import ExportContainer from '../containers/ExportContainer'
import UnpublishedContainer from '../containers/UnpublishedContainer'
import useLanguage from '../utils/useLanguage'
import useAuth0 from '../utils/useAuth0'

const ModeratorPanel: React.FC = () => {
  const history = useHistory()
  const location = useLocation()
  const { pathname } = location
  const { translations } = useLanguage()
  const { loading: loadingAuth, isModerator } = useAuth0()

  React.useEffect(() => {
    // Invisible guarding.
    if (!loadingAuth && !isModerator) {
      history.push('/')
    }
  }, [loadingAuth, isModerator, history])

  const pathArray = pathname.split('/')

  return (
    <PerfectScrollbar className="p-6 box-border w-full relative">
      <Heading level={5} gutterBottom>{translations.administration}</Heading>

      <Tabs
        value={`/${pathArray[1]}/${pathArray[2]}`}
        className="mb-6"
        onChange={(e: React.ChangeEvent<{}>, value: string) => history.push(value)}
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
        className="absolute top-2 right-2"
        onClick={() => history.push('/')}
      >
        <X size={24} />
      </IconButton>
    </PerfectScrollbar>
  )
}

export default ModeratorPanel
