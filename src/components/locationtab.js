import React from 'react';
import styled from 'styled-components'

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Dropzone from 'react-dropzone'
import { Carousel } from 'react-responsive-carousel';

import "react-responsive-carousel/lib/styles/carousel.min.css";

import { API } from '../api';

import { roundLatLng } from '../utils/helpers.js';
import { strings } from '../lang/strings.js';

const api = new API();

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
`;

const Image = styled.img`
  width: 100%;
`;

const DescriptionContainer = styled.div`
  padding: 10px 25px 25px 25px;
`;

const LocationName = styled.h3`

`;

const ActionBar = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const Text = styled.p`
  margin: 0;
  text-align: left;
`;

const Label = styled.p`
  margin-bottom: 0;
  margin-top: 15px;
`;

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
`;


export class LocationTab extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
     open: false,
     placeName: '',
     placeDescription: '',
     fireDescription: '',
     waterDescription: '',
     selectedPoint: ''
    };
  }

  closeLocationTab = () => {
    this.setState({
      open: false
    })
  }

  openLocationTab = (point) => {
    let state = {
      open: true,
      action: false,
      submitted: false
    }

    if(point) {
      state.selectedPoint = point.id;
      state.selectedPointLat = point.location.lat;
      state.selectedPointLon = point.location.lon;
    }

    this.setState(state)
  }

  showMarkerForm = () => {
    this.openLocationTab();

    this.setState({
      action: 'addMarker'
    })
  }

  updatePlaceName = (e) => {
    this.setState({
      placeName: e.target.value
    })
  }

  updatePlaceDescription = (e) => {
    this.setState({
      placeDescription: e.target.value
    })
  }

  updateWaterDescription = (e) => {
    this.setState({
      waterDescription: e.target.value
    })
  }

  updateFireDescription = (e) => {
    this.setState({
      fireDescription: e.target.value
    })
  }

  onSubmitLocation = async (e) => {
    e.preventDefault();

    let data = {
      name: e.target.elements.placeName.value,
      description: e.target.elements.placeDescription.value,
      lat: this.props.addMarkerY,
      lon: this.props.addMarkerX,
      type: e.target.elements.placeType.value.toLowerCase(),
      water_exists: e.target.elements.placeWater.checked,
      fire_exists: e.target.elements.placeFire.checked
    }

    if(data.water_exists) {
      data.water_comment = e.target.elements.placeWaterDescription.value
    } else {
      data.water_comment = '';
    }

    if(data.fire_exists) {
      data.fire_comment = e.target.elements.placeFireDescription.value
    } else {
      data.fire_comment = '';
    }

    if(this.state.action === 'edit') {
      data.id = this.state.selectedPoint
      data.lat = this.state.selectedPointLat
      data.lon = this.state.selectedPointLon
      await api.updatePoint(data);
    } else {
      await api.addPoint(data);
    }

    this.setState({
      submitted: true,
      placeName: '',
      placeDescription: '',
      fireDescription: '',
      waterDescription: ''
    })

    this.props.refreshMap();
  }

  onChangeWater = (e) => {
    this.setState({
      hasWater: e.target.checked
    })
  }

  onChangeFire = (e) => {
    this.setState({
      hasFire: e.target.checked
    })
  }

  onImageUpload = async (files) => {
    await api.uploadImages(this.state.selectedPoint, files);

    this.props.refreshMap();

    this.setState({
      submitted: true,
      action: 'upload'
    })
  }

  onEditClick = () => {
    this.setState({
      submitted: false,
      action: 'edit',
      placeName: this.props.location.name,
      placeDescription: this.props.location.description,
      fireDescription: this.props.location.fire.comment,
      waterDescription: this.props.location.water.comment,
      hasWater: this.props.location.water.exists,
      hasFire: this.props.location.fire.exists
    })
  }

  render() {
    let water, fire;

    if(this.props.location) {
      if(this.props.location.water.exists) {
        water = "Tak"
      } else {
        water = "Nie"
      }

      if(this.props.location.fire.exists) {
        fire = "Tak"
      } else {
        fire = "Nie"
      }
    }

    return(
      <LocationTabContainer className={(this.state.open ? 'active' : 'hidden')}>
        <CloseButton onClick={this.closeLocationTab}></CloseButton>

        { this.props.location && !this.state.action && <div>
          {this.props.location.images &&
          <Carousel showArrows={true} emulateTouch={true}>
            {this.props.location.images.map((image) => {
              const url = "https://wiating-dev.s3.eu-central-1.amazonaws.com/"+this.state.selectedPoint+"/" + image.name
              return <img src={url} alt=""/>
            })}
          </Carousel> }

          {!this.props.location.images &&
          <Image src="/no-image.png"/> }

          <DescriptionContainer>
            {this.props.loggedIn && <ActionBar>
              <Button variant="secondary" onClick={this.onEditClick} style={{marginRight: 10}}>Edytuj</Button>
              <Dropzone onDrop={this.onImageUpload}>
                {({getRootProps, getInputProps}) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <Button variant="secondary">Dodaj zdjęcie</Button>
                    </div>
                  </section>
                )}
              </Dropzone>
            </ActionBar> }

            <LocationName>{ this.props.location.name }</LocationName>
            <Text>{ this.props.location.description }</Text>
            <Label>Dostęp do wody: <strong>{ water }</strong></Label>
            { this.props.location.water.exists && <Text>{ this.props.location.water.comment }</Text>}
            <Label>Dostęp do ognia: <strong>{ fire }</strong></Label>
            { this.props.location.fire.exists && <Text>{ this.props.location.fire.comment }</Text>}
          </DescriptionContainer>
        </div> }

        { this.state.action && <div style={{padding: "20px"}}>
          { !this.state.submitted && <div>
            <h2>{ strings.markerForm.heading[this.state.action] }</h2>

            <Form onSubmit={this.onSubmitLocation}>

              { this.state.action === "addMarker" && <Form.Group controlId="placeLocation">
                <Form.Label>{ strings.markerForm.location }</Form.Label>
                <p>{ roundLatLng(this.props.addMarkerY) } { roundLatLng(this.props.addMarkerX) }</p>
              </Form.Group> }

              <Form.Group controlId="placeName">
                <Form.Label>{ strings.markerForm.place }</Form.Label>
                <Form.Control type="text" placeholder="" value={this.state.placeName} onChange={this.updatePlaceName} name="name" />
              </Form.Group>

              <Form.Group controlId="placeDescription">
                <Form.Label>{ strings.markerForm.description }</Form.Label>
                <Form.Control as="textarea" rows="5" value={this.state.placeDescription} onChange={this.updatePlaceDescription} name="description"/>
              </Form.Group>

              <Form.Group controlId="placeType">
                <Form.Label>{ strings.markerForm.description }</Form.Label>
                <Form.Control as="select">
                  <option>Wiata</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="placeWater">
                <Form.Check type="checkbox" label="Dostęp do wody" onChange={this.onChangeWater} defaultChecked={this.state.hasWater } />
              </Form.Group>

              { this.state.hasWater && <Form.Group controlId="placeWaterDescription">
                <Form.Label>{ strings.markerForm.description }</Form.Label>
                <Form.Control as="textarea" rows="5" value={this.state.waterDescription} onChange={this.updateWaterDescription} name="description"/>
              </Form.Group> }

              <Form.Group controlId="placeFire">
                <Form.Check type="checkbox" label="Dostęp do ognia" onChange={this.onChangeFire} defaultChecked={this.state.hasFire}/>
              </Form.Group>

              { this.state.hasFire && <Form.Group controlId="placeFireDescription">
                <Form.Label>{ strings.markerForm.description }</Form.Label>
                <Form.Control as="textarea" rows="5" value={this.state.fireDescription} onChange={this.updateFireDescription} name="description"/>
              </Form.Group> }

              <Button variant="primary" type="submit">
                { strings.markerForm.cta }
              </Button>
            </Form>
          </div>
          }

            { this.state.submitted && <div>
                <h3>{ strings.markerForm.thankYouHeading }</h3>
                <p>{ strings.markerForm.thankYouMessage }</p>
              </div>
            }
        </div> }
      </LocationTabContainer>
    )
  }
}

export default LocationTab;
