import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { useSnackbar } from 'notistack'
import 'react-perfect-scrollbar/dist/css/styles.css'
import './App.css'
import {
  editModeState,
  cachedLocationState,
  isLocationTabOpenState,
  mapRefState,
} from './state'
import Layout from './components/Layout'
import LocationTab from './components/LocationTab'
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
  const [cachedLocation, setCachedLocation] = useRecoilState(cachedLocationState)
  const [editMode, setEditMode] = useRecoilState(editModeState)
  const [, setIsLocationTabOpen] = useRecoilState(isLocationTabOpenState)
  const [mapRef] = useRecoilState(mapRefState)
  const { closeSnackbar } = useSnackbar()

  React.useEffect(() => {
    if (mapRef) {
      if (cachedLocation) {
        const { lat, lon } = cachedLocation.location
        mapRef.setActiveMarker([lat, lon])
      } else {
        mapRef.setActiveMarker(null)
      }
    }
  }, [cachedLocation, mapRef])

  React.useEffect(() => {
    setEditMode(pathname.endsWith('/edit') || pathname.endsWith('/new') || pathname.endsWith('/pin'))
    setIsLocationTabOpen(pathname.startsWith('/location') || pathname.startsWith('/search'))
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

      <LocationTab>
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
                cancel={() => setLocationTabContent('markerInfo')}
              />
          </Route> */}
        </Switch>
      </LocationTab>

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
