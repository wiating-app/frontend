import React from 'react'
import { Typography } from '@material-ui/core'
import Table from './Table'
import Actions from './Actions'
import Loader from './Loader'
import OpenInNewCard from './OpenInNewCard'
import useLanguage from '../utils/useLanguage'
import locationTypes from '../utils/locationTypes'
import history from '../history'


const UnpublishedLocations = ({
  loading,
  error,
  locations,
}) => {
  const { translations } = useLanguage()
  return loading
    ? <Loader dark big />
    : error
      ? <Typography color='error'>{translations.connectionProblem.logs}</Typography>
      : <>
        <Typography variant='h6'>{translations.itemsFound.replace('#', locations.length)}:</Typography>
        <Table
          data={locations.map(item => ({
            name: <OpenInNewCard path={`/location/${item.id}`}>{item.name}</OpenInNewCard>,
            type: item.type ? translations.locationType[locationTypes[item.type].label] : '',
            actions: <Actions
              primary={[
                {
                  label: translations.actions.edit,
                  action: () => history.push(`/location/${item.id}/edit`),
                },
              ]}
            />,
          }))}
          labels={[
            { name: translations.name, field: 'name' },
            { name: translations.name, field: 'type' },
            { name: '', field: 'actions' },
          ]}
        />
      </>
}

export default UnpublishedLocations
