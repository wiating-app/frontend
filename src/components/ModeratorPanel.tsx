import React from 'react'
import { X } from 'lucide-react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Route, useHistory, useLocation } from 'react-router-dom'
import ExportContainer from '../containers/ExportContainer'
import LogDetailsContainer from '../containers/LogDetailsContainer'
import LogsContainer from '../containers/LogsContainer'
import ReportsContainer from '../containers/ReportsContainer'
import UnpublishedContainer from '../containers/UnpublishedContainer'
import useAuth0 from '../utils/useAuth0'
import useLanguage from '../utils/useLanguage'
import Heading from './Heading'
import IconButton from './IconButton'
import Tabs, { Tab } from './Tabs'

const ModeratorPanel: React.FC = () => {
  const history = useHistory()
  const location = useLocation()
  const { pathname } = location
  const { translations } = useLanguage()
  const { isModerator } = useAuth0()

  React.useEffect(() => {
    // Invisible guarding.
    if (!isModerator) {
      history.push('/')
    }
  }, [isModerator, history])

  const pathArray = pathname.split('/')

  return (
    <PerfectScrollbar className="relative box-border w-full px-4 py-6 lg:px-6">
      <Heading level={4} gutterBottom>
        {translations.administration}
      </Heading>

      <Tabs
        value={`/${pathArray[1]}/${pathArray[2]}`}
        className="mb-6"
        onChange={(e: React.ChangeEvent<{}>, value: string) => history.push(value)}
      >
        <Tab label={translations.changeLog} value="/moderator/log" />
        <Tab label={translations.reports} value="/moderator/reports" />
        <Tab label={translations.export} value="/moderator/export" />
        <Tab label={translations.unpublished} value="/moderator/unpublished" />
      </Tabs>

      <Route path="/moderator/log">
        <LogsContainer />
      </Route>
      <Route path="/moderator/reports">
        <ReportsContainer />
      </Route>
      <Route path="/moderator/export">
        <ExportContainer />
      </Route>
      <Route path="/moderator/unpublished">
        <UnpublishedContainer />
      </Route>

      <Route exact path="/moderator/log/:id">
        <LogDetailsContainer />
      </Route>

      <IconButton className="absolute right-2 top-2" onClick={() => history.push('/')}>
        <X size={24} />
      </IconButton>
    </PerfectScrollbar>
  )
}

export default ModeratorPanel
