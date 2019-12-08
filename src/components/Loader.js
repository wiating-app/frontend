import React from 'react'
import ReactLoading from 'react-loading'

const Loader = ({ dark, big }) =>
  <ReactLoading
    type='spinningBubbles'
    width={big ? 80 : 18}
    height={big ? 80 : 18}
    color={dark ? 'inherit' : 'white'}
  />

export default Loader
