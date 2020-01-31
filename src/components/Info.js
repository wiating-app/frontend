import React from 'react'
import Overlay from './Overlay'
import history from '../history'

const Info = () =>
  <Overlay onClose={() => history.goBack()}>
    <h2>Informacje</h2>
    <p>Dział w budowie</p>
  </Overlay>

export default Info
