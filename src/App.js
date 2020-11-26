import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { useSnackbar } from 'notistack'
import 'react-perfect-scrollbar/dist/css/styles.css'
import './App.css'
import {
  editModeState,
  cachedLocationState,
  isDrawerOpenState,
} from './state'
import Layout from './components/Layout'
import Drawer from './components/Drawer'
import SearchResults from './components/SearchResults'
import BackToSearch from './components/BackToSearch'
// import PhotosForm from './components/PhotosForm'
import Info from './components/Info'
import LegendPage from './components/LegendPage'
import Regulamin from './components/Regulamin'
import PolitykaPrywatnosci from './components/PolitykaPrywatnosci'
import AcceptDataPrivacy from './components/AcceptDataPrivacy'
import FaqPage from './components/FaqPage'
import ModeratorPanel from './components/ModeratorPanel'
import NavBarContainer from './containers/NavBarContainer'
import MapContainer from './containers/MapContainer'
import AddButtonContainer from './containers/AddButtonContainer'
import LocationInfoContainer from './containers/LocationInfoContainer'
import LocationFormContainer from './containers/LocationFormContainer'
import LogDetailsContainer from './containers/LogDetailsContainer'
import HistoryContainer from '././containers/HistoryContainer'


const App = ({ history, location: { pathname } }) => {
  const [, setCachedLocation] = useRecoilState(cachedLocationState)
  const [editMode, setEditMode] = useRecoilState(editModeState)
  const [, setIsDrawerOpen] = useRecoilState(isDrawerOpenState)
  const { closeSnackbar } = useSnackbar()

  React.useEffect(() => {
    setEditMode(pathname.endsWith('/edit') || pathname.endsWith('/new') || pathname.endsWith('/pin'))
    setIsDrawerOpen(pathname.startsWith('/location') || pathname.startsWith('/search'))
    if (!pathname.startsWith('/location/')) {
      setCachedLocation(null)
    }
  }, [pathname])

  React.useEffect(() => {
    !editMode && closeSnackbar() // Dismiss all snackbars when exiting the edit mode.
  }, [editMode])

  React.useEffect(() => {
    // Show info page when user visits the site first time.
    if (!localStorage.getItem('seenInitialInfo')) {
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

          {/* <Route exact path='/location/:id/photos'>
              <Typography variant='h4' gutterBottom>{translations.actions.editPhotos}</Typography>
              <PhotosForm
                onSubmitLocation={files => onImageUpload(files)}
                cancel={() => setDrawerContent('markerInfo')}
              />
          </Route> */}
        </Switch>
      </Drawer>

      <MapContainer />

      <AddButtonContainer />

      <AcceptDataPrivacy />

      <Switch>
        <Route exact path='/info' component={Info} />
        <Route exact path='/legend' component={LegendPage} />
        <Route exact path='/regulations' component={Regulamin} />
        <Route exact path='/privacy-policy' component={PolitykaPrywatnosci} />
        <Route exact path='/faq' component={FaqPage} />
      </Switch>

      <Route path='/moderator' component={ModeratorPanel} />
      <Route path='/history' component={HistoryContainer} />
      <Route exact path='/history/:id' component={LogDetailsContainer} />

    </Layout>
  )
}

export default withRouter(App)
