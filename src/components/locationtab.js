import React from 'react'
import styled from 'styled-components'
import Form, {
  Input,
  TextArea,
  FormButton,
  Select,
  Checkbox,
} from 'react-standalone-form'

import Button from 'react-bootstrap/Button'
import Dropzone from 'react-dropzone'
import { Carousel } from 'react-responsive-carousel'

import 'react-responsive-carousel/lib/styles/carousel.min.css'

import { API } from '../api'

import { roundLatLng } from '../utils/helpers.js'
import { strings } from '../lang/strings.js'

const api = new API()

const LocationTabContainer = styled.div`
  position: absolute;
  z-index: 99;
  max-width: 400px;
  width: 100%;
  height: 100vh;
  background: #fff;
  left: -400px;
  top: 0;
  box-shadow: 0, 0, 5px rgba(0,0,0,0.3);
  padding-top: 55px;
  box-sizing: border-box;
  transition: left .5s ease;
  overflow: auto;

  &.active {
    left: 0;
  }
`

const Image = styled.img`
  width: 100%;
`

const DescriptionContainer = styled.div`
  padding: 10px 25px 25px 25px;
`

const LocationName = styled.h3`

`

const ActionBar = styled.div`
  display: flex;
  margin-bottom: 10px;
`

const Text = styled.p`
  margin: 0;
  text-align: left;
`

const Label = styled.p`
  margin-bottom: 0;
  margin-top: 15px;
`

const CloseButton = styled.a`
  position: absolute;
  width: 32px;
  height: 32px;
  z-index: 1;
  cursor: pointer;
  background: #fff;
  opacity: 1;
  right: 0;
  top: 55px;
  z-index: 5;

  &:hover {
    opacity: 1;
  }

  &:before, &:after {
    position: absolute;
    left: 15px;
    top: 5px;
    content: ' ';
    height: 20px;
    width: 2px;
    background-color: #333;
  }

  &:before {
    transform: rotate(45deg);
  }

  &:after {
    transform: rotate(-45deg);
  }
`

const SearchResult = styled.div`
  padding: 5px 20px;
  cursor: pointer;

  &:hover {
    background: rgba(0,0,0,0.05);
  }
`

const SearchResults = styled.div`
  padding: 20px 0;
;`


export class LocationTab extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      content: props.content,
      selectedPoint: '',
    }
  }

  updatePlaceName = (e) => {
    this.setState({
      placeName: e.target.value,
    })
  }

  updatePlaceDescription = (e) => {
    this.setState({
      placeDescription: e.target.value,
    })
  }

  updateWaterDescription = (e) => {
    this.setState({
      waterDescription: e.target.value,
    })
  }

  updateFireDescription = (e) => {
    this.setState({
      fireDescription: e.target.value,
    })
  }

  onSubmitLocation = async fields => {
    const data = {
      ...fields,
      lat: this.props.addMarkerY,
      lon: this.props.addMarkerX,
    }

    if (this.state.content === 'editMarker') {
      data.id = this.props.selectedLocation
      data.lat = this.props.selectedLocation.x
      data.lon = this.props.selectedLocation.y
      await api.updatePoint(data)
    } else {
      await api.addPoint(data)
    }

    this.setState({ content: 'markerSubmitted' })

    this.props.refreshMap()
  }

  search = async phrase => {
    this.openLocationTab()

    const result = await api.search(phrase)

    this.setState({
      content: 'search',
      searchResults: result,
    })
  }

  focusPoint = (point) => {
    this.props.focusPoint(point)
  }

  onImageUpload = async (files) => {
    await api.uploadImages(this.state.selectedPoint, files)

    this.props.refreshMap()

    this.setState({
      submitted: true,
      content: 'upload',
    })
  }

  onEditClick = () => {
    this.setState({
      submitted: false,
      content: 'edit',
      placeName: this.props.location.name,
      placeDescription: this.props.location.description,
      fireDescription: this.props.location.fire.comment,
      waterDescription: this.props.location.water.comment,
      hasWater: this.props.location.water.exists,
      hasFire: this.props.location.fire.exists,
    })
  }

  componentDidUpdate(prevProps) {
    const { searchPhrase, content } = this.props
    if (prevProps.searchPhrase !== searchPhrase) {
      this.search(searchPhrase)
    }
    if (prevProps.content !== content) {
      this.setState({ content })
    }
  }

  render() {
    let water, fire

    if (this.props.location) {
      if (this.props.location.water.exists) {
        water = strings.yes
      } else {
        water = strings.no
      }

      if (this.props.location.fire.exists) {
        fire = strings.yes
      } else {
        fire = strings.no
      }
    }

    return (

      <LocationTabContainer className={(this.state.content ? 'active' : 'hidden')}>
        <CloseButton onClick={() => this.props.closeLocationTab} />

        {this.state.content && this.state.content === 'search' &&
          <SearchResults>
            {this.state.searchResults && this.state.searchResults.map((point, index) =>
              <SearchResult onClick={() => this.focusPoint(point._source)} key={index}>
                <h5>{point._source.name}</h5>
                <p>{point._source.description}</p>
              </SearchResult>
            )}
          </SearchResults>}

        {this.props.location && !this.state.content &&
          <div>
            {this.props.location.images &&
              <Carousel showArrows emulateTouch>
                {this.props.location.images.map((image, i) => {
                  const url = process.env.REACT_APP_S3_URL + '/' + this.state.selectedPoint + '/' + image.name
                  return <img key={i} src={url} alt='' />
                })}
              </Carousel>}

            {!this.props.location.images &&
              <Image src='/no-image.png' />}

            <DescriptionContainer>
              {this.props.loggedIn &&
                <ActionBar>
                  <Button variant='secondary' onClick={this.onEditClick} style={{ marginRight: 10 }}>{strings.actions.edit}</Button>
                  <Dropzone onDrop={this.onImageUpload}>
                    {({ getRootProps, getInputProps }) => (
                      <section>
                        <div {...getRootProps()}>
                          <input {...getInputProps()} />
                          <Button variant='secondary'>{strings.actions.addPhoto}</Button>
                        </div>
                      </section>
                    )}
                  </Dropzone>
                </ActionBar>}

              <LocationName>{this.props.location.name}</LocationName>
              <Text>{this.props.location.description}</Text>
              <Label>Dostęp do wody: <strong>{water}</strong></Label>
              {this.props.location.water.exists && <Text>{this.props.location.water.comment}</Text>}
              <Label>Dostęp do ognia: <strong>{fire}</strong></Label>
              {this.props.location.fire.exists && <Text>{this.props.location.fire.comment}</Text>}
            </DescriptionContainer>
          </div>}

        {this.state.content && this.state.content !== 'search' && <div style={{ padding: '20px' }}>
          {!this.state.submitted && <div>
            <h2>{strings.markerForm.heading[this.state.content]}</h2>

            <Form
              fields={[
                'name',
                'description',
                'type',
                'water_exists',
                'placeWaterDescription',
                'fire_exists',
                'placeFireDescription',
              ]}
              required={[
                'placeName',
                'placeDescription',
                'placeType',
              ]}
            >

              {this.state.content === 'addMarker' &&
                <>
                  <h3>{strings.markerForm.location}</h3>
                  <p>{roundLatLng(this.props.addMarkerY)} {roundLatLng(this.props.addMarkerX)}</p>
                </>
              }

              <Input
                name='name'
                label={strings.markerForm.place}
                min={5}
              />

              <TextArea
                name='description'
                label={strings.markerForm.description}
                rows={5}
                min={40}
              />

              <Select
                name='type'
                label={strings.markerForm.type}
                options={['Wiata', '2', '3', '4', '5']}
              />

              <Checkbox
                name='water_exists'
                label={strings.marker.waterAccess}
              />

              {this.state.hasWater &&
                <TextArea
                  name='water_description'
                  label={strings.markerForm.waterDescription}
                  rows={5}
                  min={40}
                />
              }

              <Checkbox
                name='fire_exists'
                label={strings.marker.fireAccess}
              />

              {this.state.hasFire &&
                <TextArea
                  name='fire_description'
                  label={strings.markerForm.fireDescription}
                  rows={5}
                  min={40}
                />
              }

              <FormButton
                callback={fields => this.onSubmitLocation(fields)}
              >{strings.markerForm.cta}</FormButton>
            </Form>
          </div>}

          {this.state.content === 'markerSubmitted' &&
            <div>
              <h3>{strings.markerForm.thankYouHeading}</h3>
              <p>{strings.markerForm.thankYouMessage}</p>
            </div>}
        </div>}
      </LocationTabContainer>
    )
  }
}

export default LocationTab
