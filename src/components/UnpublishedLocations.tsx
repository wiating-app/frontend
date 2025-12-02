import React from 'react'
import Heading from './Heading'
import Typography from './Typography'
import Table from './Table'
import Button from './Button'
import ButtonGroup from './ButtonGroup'
import Loader from './Loader'
import LocationLink from './LocationLink'
import useLanguage from '../utils/useLanguage'
import useConfig from '../utils/useConfig'
import history from '../history'
import { Location } from '../typings'


interface UnpublishedLocationsProps {
  loading: boolean
  error: boolean
  locations?: Location[]
}

const UnpublishedLocations = ({
  loading,
  error,
  locations,
}: UnpublishedLocationsProps) => {
  const { translations, language } = useLanguage()
  const { locationTypes } = useConfig()

  return loading
    ? <Loader dark big />
    : error
      ? <Typography color='error'>{translations.connectionProblemLogs}</Typography>
      : <>
        <Heading level={6}>{translations.itemsFound.replace('#', locations?.length || 0)}:</Heading>
        <Table
          data={locations?.map(item => ({
            name: <LocationLink name={item.name} id={item.id} />,
            type: item.type ? locationTypes.find(type => type.id === item.type)?.label[language] || '' : '',
            actions: <ButtonGroup>
              <Button variant='primary' size='small' onClick={() => history.push(`/location/${item.id}/edit`)}>
                {translations.edit}
              </Button>
            </ButtonGroup>,
          })) || []}
          labels={[
            { name: translations.name, field: 'name' },
            { name: translations.name, field: 'type' },
            { name: '', field: 'actions' },
          ]}
        />
      </>
}

export default UnpublishedLocations
