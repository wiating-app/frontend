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


import { roundLatLng } from '../utils/helpers.js'
import { strings } from '../lang/strings.js'


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
    }
  }

  focusPoint = (point) => {
    this.props.focusPoint(point)
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
        <CloseButton onClick={() => this.props.closeLocationTab()} />

        {this.state.content === 'searchResults' &&
          <SearchResults>
            {this.props.searchResults && this.props.searchResults.map((point, index) =>
              <SearchResult onClick={() => this.focusPoint(point._source)} key={index}>
                <h5>{point._source.name}</h5>
                <p>{point._source.description}</p>
              </SearchResult>
            )}
          </SearchResults>}

        {this.state.content === 'markerInfo' &&
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
                  <Button variant='secondary' onClick={this.setState({ content: 'editMarker' })} style={{ marginRight: 10 }}>{strings.actions.edit}</Button>
                  <Dropzone onDrop={files => this.props.onImageUpload(files)}>
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

        {['addMarker', 'editMarker'].includes(this.state.content) &&
          <div style={{ padding: '20px' }}>
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
                  <p>{roundLatLng(this.props.selectedLocation.lat)} {roundLatLng(this.props.selectedLocation.lon)}</p>
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
                text={strings.marker.waterAccess}
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
                text={strings.marker.fireAccess}
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
                callback={fields => this.props.onSubmitLocation(fields)}
              >{strings.markerForm.cta}</FormButton>
            </Form>
          </div>
        }

        {/* TODO: Change it to notification */}
        {this.state.content === 'markerSubmitted' &&
          <div>
            <h3>{strings.markerForm.thankYouHeading}</h3>
            <p>{strings.markerForm.thankYouMessage}</p>
          </div>
        }
      </LocationTabContainer>
    )
  }
}

export default LocationTab
