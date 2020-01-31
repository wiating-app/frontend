import React from 'react'
import Overlay from './Overlay'
import history from '../history'

const Regulamin = () =>
  <Overlay onClose={() => history.goBack()}>
    <h2>Regulamin</h2>
    <p>Dział w budowie</p>
  </Overlay>

export default Regulamin
