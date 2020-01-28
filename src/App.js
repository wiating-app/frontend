import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import 'react-perfect-scrollbar/dist/css/styles.css'
import './App.css'
import Layout from './components/Layout'
import ContentWrapper from './components/ContentWrapper'
import LocationTab from './components/LocationTab'
import SearchResults from './components/SearchResults'
import BackToSearch from './components/BackToSearch'
// import PhotosForm from './components/PhotosForm'
import NavBarContainer from './containers/NavBarContainer'
import MapContainer from './containers/MapContainer'
import SelectedLocationContainer from './containers/SelectedLocationContainer'
import LocationFormContainer from './containers/LocationFormContainer'


const App = ({ history, location: { pathname } }) => {
  const [cachedLocation, setCachedLocation] = React.useState()
  const [searchResults, setSearchResults] = React.useState([])
  const editMode = pathname.endsWith('/edit') || pathname.endsWith('/new')

  const mapRef = React.useRef()

  React.useEffect(() => {
    if (cachedLocation) {
      const { lat, lon } = cachedLocation.location
      mapRef.current.setActiveMarker([lat, lon])
    } else {
      mapRef.current.setActiveMarker(null)
    }
  }, [cachedLocation])

  return (
    <Layout appBar={
      <NavBarContainer setSearchResults={results => {
        setSearchResults(results)
        setCachedLocation(null)
      }} />
    }>

      <LocationTab
        closeLocationTab={() => {
          setCachedLocation(null)
          history.push('/')
        }}
        refreshMap={async () => {
          await mapRef.current.loadMapMarkers()
        }}
      >
        <Switch>
          <Route exact path='/search'>
            <SearchResults
              items={searchResults}
              setCachedLocation={location => {
                setCachedLocation(location)
                history.push(`/location/${location.id}`)
              }}
              history={history}
            />
          </Route>

          <Route exact path='/location/new'>
            <ContentWrapper>
              <LocationFormContainer
                cachedLocation={cachedLocation}
                setCachedLocation={setCachedLocation}
                isNew
                refreshMap={async () => {
                  await mapRef.current.loadMapMarkers()
                }}
              />
            </ContentWrapper>
          </Route>

          <Route exact path='/location/:id'>
            <SelectedLocationContainer
              cachedLocation={cachedLocation}
              setCachedLocation={setCachedLocation}
            />
            {searchResults.length &&
              <BackToSearch onClick={() => {
                history.push('/search')
                setCachedLocation(null)
              }} />
            }
          </Route>

          <Route exact path='/location/:id/edit'>
            <ContentWrapper>
              <LocationFormContainer
                cachedLocation={cachedLocation}
                setCachedLocation={setCachedLocation}
                setActiveMarker={location => mapRef.current.setActiveMarker(location)}
                refreshMap={async () => {
                  await mapRef.current.loadMapMarkers()
                }}
              />
            </ContentWrapper>
          </Route>

          {/* <Route exact path='/location/:id/photos'>
            <ContentWrapper>
              <Typography variant='h4' gutterBottom>{<Text id='actions.editPhotos}</Typography>
              <PhotosForm
                locationData={cachedLocation}
                onSubmitLocation={files => onImageUpload(files)}
                cancel={() => setLocationTabContent('markerInfo')}
              />
            </ContentWrapper>
          </Route> */}
        </Switch>
      </LocationTab>

      <MapContainer
        openLocationTab={point => {
          setSearchResults(null)
          setCachedLocation(point)
          history.push(`/location/${point.id}`)
        }}
        closeTab={() => history.push('/')}
        openAddMarkerTab={({ lat, lng: lon }) => {
          setCachedLocation({ location: { lat, lon } })
          history.push('/location/new')
        }}
        updateCoordinates={({ lat, lng: lon }) => {
          setCachedLocation({ ...cachedLocation, location: { lon, lat } })
        }}
        ref={mapRef}
        editMode={editMode}
      />

    </Layout>
  )
}

export default withRouter(App)
