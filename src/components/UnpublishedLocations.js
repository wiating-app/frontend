import React from 'react'
import { Typography } from '@material-ui/core'
import Table from './Table'
import Actions from './Actions'
import Loader from './Loader'
import OpenInNewCard from './OpenInNewCard'
import useLanguage from '../utils/useLanguage'
import useConfig from '../utils/useConfig'
import history from '../history'


const UnpublishedLocations = ({
  loading,
  error,
  locations,
}) => {
  const { translations, language } = useLanguage()
  const { locationTypes } = useConfig()

  return loading
    ? <Loader dark big />
    : error
      ? <Typography color='error'>{translations.connectionProblemLogs}</Typography>
      : <>
        <Typography variant='h6'>{translations.itemsFound.replace('#', locations.length)}:</Typography>
        <Table
          data={locations.map(item => ({
            name: <OpenInNewCard path={`/location/${item.id}`}>{item.name}</OpenInNewCard>,
            type: item.type ? locationTypes.find(type => type.id === item.type).label[language] : '',
            actions: <Actions
              primary={[
                {
                  label: translations.edit,
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
