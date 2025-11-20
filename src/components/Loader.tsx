import React from 'react'
import ReactLoading from 'react-loading'

interface LoaderProps {
  dark?: boolean
  big?: boolean
}

const Loader = ({ dark, big }: LoaderProps) =>
  <ReactLoading
    type='spinningBubbles'
    width={big ? 80 : 18}
    height={big ? 80 : 18}
    color={dark ? 'inherit' : 'white'}
  />

export default Loader
