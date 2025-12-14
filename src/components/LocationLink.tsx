import React from 'react'
import { Location } from '../typings'
import OpenInNewCard from './OpenInNewCard'

interface LocationLinkProps {
  name: Location['name']
  id: Location['id']
}

const LocationLink = ({ name, id }: LocationLinkProps) => {
  return <OpenInNewCard path={`/location/${id}`}>{name}</OpenInNewCard>
}

export default LocationLink
