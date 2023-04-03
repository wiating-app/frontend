import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { useSnackbar } from 'notistack'
import useConfig from './utils/useConfig'
import 'react-perfect-scrollbar/dist/css/styles.css'
import './App.css'
import {
  editModeState,
  activeLocationState,
  isDrawerOpenState,
} from './state'
import Layout from './components/Layout'
import Drawer from './components/Drawer'
import SearchResults from './components/SearchResults'
import BackToSearch from './components/BackToSearch'
import Info from './components/Info'
import LegendPage from './components/LegendPage'
import TermsAndConditions from './components/TermsAndConditions'
import PrivacyPolicy from './components/PrivacyPolicy'
import AcceptDataPrivacy from './components/AcceptDataPrivacy'
import FaqPage from './components/FaqPage'
import ModeratorPanel from './components/ModeratorPanel'
import NavBarContainer from './containers/NavBarContainer'
import MapContainer from './containers/MapContainer'
import LocationInfoContainer from './containers/LocationInfoContainer'
import LocationFormContainer from './containers/LocationFormContainer'
import PhotosFormContainer from './containers/PhotosFormContainer'
import LogDetailsContainer from './containers/LogDetailsContainer'
import HistoryContainer from '././containers/HistoryContainer'


const App = ({ history, location: { pathname } }) => {
  const [, setActiveLocation] = useRecoilState(activeLocationState)
  const [editMode, setEditMode] = useRecoilState(editModeState)
  const [, setIsDrawerOpen] = useRecoilState(isDrawerOpenState)
  const { closeSnackbar } = useSnackbar()
  const { faq } = useConfig()

  React.useEffect(() => {
    setEditMode(pathname.endsWith('/edit') || pathname.endsWith('/new') || pathname.endsWith('/pin'))
    setIsDrawerOpen(pathname.startsWith('/location') || pathname.startsWith('/search'))
    if (!pathname.startsWith('/location/')) {
      setActiveLocation(null)
    }
  }, [pathname])

  React.useEffect(() => {
    !editMode && closeSnackbar() // Dismiss all snackbars when exiting the edit mode.
  }, [editMode])

  React.useEffect(() => {
    // Show info screen when user visits a site for the first time,
    // but only if first view is on a location page.
    if (!localStorage.getItem('seenInitialInfo') && !pathname.startsWith('/location')) {
      history.push('/info')
    }
  }, [])

  return (
    <Layout appBar={<NavBarContainer />}>

      <Drawer>
        <Switch>
          <Route exact path='/search' component={SearchResults} />

          <Route exact path='/location/new'>
            <LocationFormContainer isNew />
          </Route>

          <Route exact path='/location/:id'>
            <LocationInfoContainer />
            <BackToSearch />
          </Route>

          <Route exact path='/location/:id/edit'>
            <LocationFormContainer />
          </Route>

          <Route exact path='/location/:id/photos'>
            <PhotosFormContainer />
          </Route>
        </Switch>
      </Drawer>

      {/* Show only map or moderator panel at once. */}
      <Switch>
        <Route path='/moderator' component={ModeratorPanel} />
        <Route component={MapContainer} />
      </Switch>

      <AcceptDataPrivacy />

      <Switch>
        <Route exact path='/info' component={Info} />
        <Route exact path='/legend' component={LegendPage} />
        <Route exact path='/terms-and-conditions' component={TermsAndConditions} />
        <Route exact path='/privacy-policy' component={PrivacyPolicy} />
        {faq && <Route exact path='/faq' component={FaqPage} />}
      </Switch>

      <Route path='/history' component={HistoryContainer} />
      <Route exact path='/history/:id' component={LogDetailsContainer} />

    </Layout>
  )
}

export default withRouter(App)
