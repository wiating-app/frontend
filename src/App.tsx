import React from 'react'
import { Switch, Route, useHistory, useLocation } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { toast } from 'sonner'
import useConfig from './utils/useConfig'
import 'react-perfect-scrollbar/dist/css/styles.css'
import {
  editModeState,
  activeLocationState,
  isDrawerOpenState,
} from './state'
import Layout from './components/Layout'
import Drawer from './components/Drawer'
import SearchResultsContainer from './containers/SearchResultsContainer'
import BackToSearchContainer from './containers/BackToSearchContainer'
import Info from './components/Info'
import TermsAndConditions from './components/TermsAndConditions'
import PrivacyPolicy from './components/PrivacyPolicy'
import AcceptDataPrivacy from './components/AcceptDataPrivacy'
import FaqPage from './components/FaqPage'
import WrappedContainer from './containers/WrappedContainer'
import ModeratorPanel from './components/ModeratorPanel'
import NavBarContainer from './containers/NavBarContainer'
import MapContainer from './containers/MapContainer'
import LocationInfoContainer from './containers/LocationInfoContainer'
import LocationFormContainer from './containers/LocationFormContainer'
import PhotosFormContainer from './containers/PhotosFormContainer'
import LogDetailsContainer from './containers/LogDetailsContainer'
import HistoryContainer from '././containers/HistoryContainer'
import RequireAuth from './utils/RequireAuth'
import useAuth0 from './utils/useAuth0'


const App = () => {
  const history = useHistory()
  const location = useLocation()
  const { pathname } = location
  const [, setActiveLocation] = useRecoilState(activeLocationState)
  const [editMode, setEditMode] = useRecoilState(editModeState)
  const [, setIsDrawerOpen] = useRecoilState(isDrawerOpenState)
  const { faq } = useConfig()
  const { canSeeWrapped } = useAuth0()

  React.useEffect(() => {
    setEditMode(pathname.endsWith('/edit') || pathname.endsWith('/new') || pathname.endsWith('/pin'))
    setIsDrawerOpen(pathname.startsWith('/location') || pathname.startsWith('/search'))
    if (!pathname.startsWith('/location')) {
      setActiveLocation(null)
    }
  }, [pathname])

  React.useEffect(() => {
    !editMode && toast.dismiss() // Dismiss all snackbars when exiting the edit mode.
  }, [editMode])

  React.useEffect(() => {
    // Show info screen when user visits a site for the first time,
    // but only if first view is on a location page.
    if (!localStorage.getItem('seenInitialInfo') && !pathname.startsWith('/location')) {
      history.push('/info')
      return
    }
    // Redirect to wrapped page if user has seen initial info and can see wrapped
    // Only redirect if not already on wrapped page, not on info page, and not dismissed
    if (localStorage.getItem('seenInitialInfo') && canSeeWrapped && pathname !== '/wrapped' && pathname !== '/info') {
      // Check if already dismissed for wrapped year (previous year if before December, current year in December)
      const now = new Date()
      const currentMonth = now.getMonth()
      const wrappedYear = currentMonth < 11 ? now.getFullYear() - 1 : now.getFullYear()
      const dismissedKey = `wrappedDismissed_${wrappedYear}`
      const isDismissed = !!localStorage.getItem(dismissedKey)
      if (!isDismissed) {
        // history.push('/wrapped')
      }
    }
  }, [canSeeWrapped, history, pathname])

  return (
    <Layout appBar={<NavBarContainer />}>

      <Drawer>
        <Switch>
          <Route exact path='/search' component={SearchResultsContainer} />

          <Route exact path='/location/new'>
            <LocationFormContainer isNew />
          </Route>

          <Route exact path='/location/:id'>
            <LocationInfoContainer />
            <BackToSearchContainer />
          </Route>

          <Route exact path='/location/:id/edit'>
            <RequireAuth redirect>
              <LocationFormContainer />
            </RequireAuth>
          </Route>

          <Route exact path='/location/:id/photos'>
            <RequireAuth redirect>
              <PhotosFormContainer />
            </RequireAuth>
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
        <Route exact path='/terms-and-conditions' component={TermsAndConditions} />
        <Route exact path='/privacy-policy' component={PrivacyPolicy} />
        {faq && <Route exact path='/faq' component={FaqPage} />}
        <Route exact path='/wrapped' component={WrappedContainer} />
        <Route path='/history' component={HistoryContainer} />
        <Route exact path='/history/:id' component={LogDetailsContainer} />
      </Switch>

    </Layout>
  )
}

export default App
