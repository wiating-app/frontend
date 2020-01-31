import React from 'react'
import Overlay from './Overlay'
import history from '../history'

const PolitykaPrywatnosci = () =>
  <Overlay onClose={() => history.goBack()}>
    <h2>Polityka prywatności</h2>
    <p>Dział w budowie</p>
  </Overlay>

export default PolitykaPrywatnosci
