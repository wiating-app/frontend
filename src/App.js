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
} from './state'
import Layout from './components/Layout'
import ContentWrapper from './components/ContentWrapper'
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
  const mapRef = React.useRef()
  const { closeSnackbar } = useSnackbar()

  React.useEffect(() => {
    if (cachedLocation) {
      const { lat, lon } = cachedLocation.location
      mapRef.current.setActiveMarker([lat, lon])
    } else {
      mapRef.current.setActiveMarker(null)
    }
  }, [cachedLocation])

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

      <LocationTab
        refreshMap={async () => {
          await mapRef.current.loadMapMarkers()
        }}
      >
        <Switch>
          <Route exact path='/search' component={SearchResults} />

          <Route exact path='/location/new'>
            <ContentWrapper>
              <LocationFormContainer
                isNew
                refreshMap={async () => {
                  await mapRef.current.loadMapMarkers()
                }}
              />
            </ContentWrapper>
          </Route>

          <Route exact path='/location/:id'>
            <LocationInfoContainer />
            <BackToSearch />
          </Route>

          <Route exact path='/location/:id/edit'>
            <ContentWrapper>
              <LocationFormContainer
                setActiveMarker={location => mapRef.current.setActiveMarker(location)}
                refreshMap={async () => {
                  await mapRef.current.loadMapMarkers()
                }}
              />
            </ContentWrapper>
          </Route>

          {/* <Route exact path='/location/:id/photos'>
            <ContentWrapper>
              <Typography variant='h4' gutterBottom>{translations.actions.editPhotos}</Typography>
              <PhotosForm
                onSubmitLocation={files => onImageUpload(files)}
                cancel={() => setLocationTabContent('markerInfo')}
              />
            </ContentWrapper>
          </Route> */}
        </Switch>
      </LocationTab>

      <MapContainer
        ref={mapRef}
      />

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
