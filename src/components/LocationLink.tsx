import React from 'react'
import OpenInNewCard from './OpenInNewCard'
import { Location } from '../typings'

interface LocationLinkProps {
  name: Location['name']
  id: Location['id']
}

const LocationLink = ({ name, id }: LocationLinkProps) => {
  return (
    <OpenInNewCard path={`/location/${id}`}>{name}</OpenInNewCard>
  )
}

export default LocationLink
