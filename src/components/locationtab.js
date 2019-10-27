import React from 'react'
import styled from 'styled-components'
import Form from 'react-standalone-form'
import {
  Input,
  TextArea,
  FormButton,
  Select,
  Checkbox,
} from 'react-standalone-form-mui'

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
  top: 0;
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

const LocationTab = props => {
  const [content, setContent] = React.useState()
  const [hasWater, setHasWater] = React.useState()
  const [hasFire, setHasFire] = React.useState()

  React.useEffect(() => {
    setContent(props.content)
  }, [props.content])

  return (

    <LocationTabContainer className={(content ? 'active' : 'hidden')}>
      <CloseButton onClick={() => props.closeLocationTab()} />

      {console.log('searchResults: ', props.searchResults)}
      {content === 'searchResults' &&
        <SearchResults>
          {props.searchResults && props.searchResults.map((point, index) =>
            <SearchResult onClick={() => props.setMapCenter(point._source)} key={index}>
              <h5>{point._source.name}</h5>
              <p>{point._source.description}</p>
            </SearchResult>
          )}
        </SearchResults>}

      {content === 'markerInfo' && props.selectedLocation &&
        <div>
          {props.selectedLocation.images &&
            <Carousel showArrows emulateTouch>
              {props.selectedLocation.images.map((image, i) => {
                const url = process.env.REACT_APP_S3_URL + '/' + props.selectedLocation + '/' + image.name
                return <img key={i} src={url} alt='' />
              })}
            </Carousel>}

          {!props.selectedLocation.images &&
            <Image src='/no-image.png' />}

          <DescriptionContainer>
            {props.loggedIn &&
              <ActionBar>
                <Button variant='secondary' onClick={() => setContent('editMarker')} style={{ marginRight: 10 }}>{strings.actions.edit}</Button>
                <Dropzone onDrop={files => props.onImageUpload(files)}>
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

            <LocationName>{props.selectedLocation.name}</LocationName>
            <Text>{props.selectedLocation.description}</Text>

            <Label>Dostęp do wody: <strong>
              {props.selectedLocation.water && props.selectedLocation.water.exists ? strings.yes : strings.no}
            </strong></Label>
            {props.selectedLocation.water.exists && <Text>{props.selectedLocation.water.comment}</Text>}
            <Label>Dostęp do ognia: <strong>
              {props.selectedLocation.fire && props.selectedLocation.fire.exists ? strings.yes : strings.no}
            </strong></Label>
            {props.selectedLocation.fire.exists && <Text>{props.selectedLocation.fire.comment}</Text>}
          </DescriptionContainer>
        </div>
      }

      {['addMarker', 'editMarker'].includes(content) &&
        <div style={{ padding: '20px' }}>
          <h2>{strings.markerForm.heading[content]}</h2>

          <Form
            fields={[
              'name',
              'description',
              'type',
              'water_exists',
              'water_description',
              'fire_exists',
              'fire_description',
            ]}
            required={[
              'placeName',
              'placeDescription',
              'placeType',
            ]}
            callbackOnChange={fields => {
              setHasWater(fields.water_exists)
              setHasFire(fields.fire_exists)
            }}
          >

            {content === 'addMarker' &&
              <>
                <h3>{strings.markerForm.location}</h3>
                <p>{roundLatLng(props.selectedLocation.lat)} {roundLatLng(props.selectedLocation.lon)}</p>
              </>
            }

            <Input
              name='name'
              label={strings.markerForm.place}
              min={5}
              initialValue={props.selectedLocation.name}
            />

            <TextArea
              name='description'
              label={strings.markerForm.description}
              rows={5}
              min={40}
              initialValue={props.selectedLocation.description}
            />

            <Select
              name='type'
              label={strings.markerForm.type}
              options={['Wiata', '2', '3', '4', '5']}
              initialValue={props.selectedLocation.type}
            />

            <Checkbox
              name='water_exists'
              text={strings.marker.waterAccess}
              initialValue={props.selectedLocation.water.exists}
            />

            {hasWater &&
              <TextArea
                name='water_description'
                label={strings.markerForm.waterDescription}
                rows={5}
                min={40}
                initialValue={props.selectedLocation.water.comment}
              />
            }

            <Checkbox
              name='fire_exists'
              text={strings.marker.fireAccess}
              initialValue={props.selectedLocation.fire.exists}
            />

            {hasFire &&
              <TextArea
                name='fire_description'
                label={strings.markerForm.fireDescription}
                rows={5}
                min={40}
                initialValue={props.selectedLocation.fire.comment}
              />
            }

            <FormButton
              callback={fields => props.onSubmitLocation(fields)}
            >{strings.markerForm.cta}</FormButton>
          </Form>
        </div>
      }

      {/* TODO: Change it to notification */}
      {content === 'markerSubmitted' &&
        <div>
          <h3>{strings.markerForm.thankYouHeading}</h3>
          <p>{strings.markerForm.thankYouMessage}</p>
        </div>
      }
    </LocationTabContainer>
  )
}

export default LocationTab
