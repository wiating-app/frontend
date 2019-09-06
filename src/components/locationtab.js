import React from 'react';
import styled from 'styled-components'

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import Dropzone from 'react-dropzone'

import { roundLatLng } from '../utils/helpers.js';

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
  padding: 25px;
`;

const Text = styled.p`
  margin: 0;
  text-align: left;
`;

const CloseButton = styled.a`
  position: absolute;
  right: 10px;
  top: 65px;
  width: 32px;
  height: 32px;
  opacity: 0.7;
  z-index: 1;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }

  &:before, &:after {
    position: absolute;
    left: 15px;
    content: ' ';
    height: 33px;
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
     placeDescription: ''
    };
  }

  closeLocationTab = () => {
    this.setState({
      open: false
    })
  }

  openLocationTab = () => {
    this.setState({
      open: true,
      action: false
    })
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

  onSubmitLocation = (e) => {
    e.preventDefault();

    // TODO API Call

    this.setState({
      submitted: true
    })
  }

  render() {


    return(
      <LocationTabContainer className={(this.state.open ? 'active' : 'hidden')}>
        <CloseButton onClick={this.closeLocationTab}></CloseButton>

        { this.props.location && !this.state.action && <div>
          <Image src="https://lh5.googleusercontent.com/-68keLBRSsV4/T-c50F3J-cI/AAAAAAAADfI/NXFoKwiUPeE/s640/DSC_1919.JPG"/>

          <DescriptionContainer>
            <Text>{ this.props.location.name }</Text>
          </DescriptionContainer>
        </div> }

        { this.state.action && <div style={{padding: "20px"}}>
          { !this.state.submitted && <div>
            <h2>Dodaj nowe miejsce</h2>

            <Form onSubmit={this.onSubmitLocation}>
              <Form.Group controlId="placeLocation">
                <Form.Label>Położenie</Form.Label>
                <p>{ roundLatLng(this.props.addMarkerX) } { roundLatLng(this.props.addMarkerY) }</p>
              </Form.Group>

              <Form.Group controlId="placeName">
                <Form.Label>Nazwa miejsca</Form.Label>
                <Form.Control type="text" placeholder="" value={this.state.placeName} onChange={this.updatePlaceName} name="name" />
              </Form.Group>

              <Form.Group controlId="placeDescription">
                <Form.Label>Opis miejsca</Form.Label>
                <Form.Control as="textarea" rows="5" value={this.state.placeDescription} onChange={this.updatePlaceDescription} name="description"/>
              </Form.Group>

              <Form.Group controlId="placeImage">
                <Form.Label>Wgraj zdjęcie</Form.Label>

                <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
                  {({getRootProps, getInputProps}) => (
                    <section>
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p>Przeciągnij i upuść plik tutaj lub kliknij aby wybrać</p>
                      </div>
                    </section>
                  )}
                </Dropzone>
              </Form.Group>

              <Button variant="primary" type="submit">
                Zapisz
              </Button>
            </Form>
          </div>
          }

            { this.state.submitted && <div>
                <h3>Dzięki!</h3>
                <p>Punkt został dodany i będzie widoczny po akceptacji moderatora.</p>
              </div>
            }
        </div> }
      </LocationTabContainer>
    )
  }
}

export default LocationTab;
