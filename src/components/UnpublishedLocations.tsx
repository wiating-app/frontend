import React from 'react'
import history from '../history'
import { Location } from '../typings'
import useConfig from '../utils/useConfig'
import useLanguage from '../utils/useLanguage'
import Button from './Button'
import ButtonGroup from './ButtonGroup'
import Heading from './Heading'
import Loader from './Loader'
import LocationLink from './LocationLink'
import Table from './Table'
import Typography from './Typography'

interface UnpublishedLocationsProps {
  loading: boolean
  error: boolean
  locations?: Location[]
}

const UnpublishedLocations = ({ loading, error, locations }: UnpublishedLocationsProps) => {
  const { translations, language } = useLanguage()
  const { locationTypes } = useConfig()

  return loading ? (
    <Loader big />
  ) : error ? (
    <Typography color="error">{translations.connectionProblemLogs}</Typography>
  ) : (
    <>
      <Heading level={6}>{translations.itemsFound.replace('#', locations?.length || 0)}:</Heading>
      <Table
        data={
          locations?.map(item => ({
            name: <LocationLink name={item.name} id={item.id} />,
            type: item.type ? locationTypes.find(type => type.id === item.type)?.label[language] || '' : '',
            actions: (
              <ButtonGroup>
                <Button variant="primary" onClick={() => history.push(`/location/${item.id}/edit`)}>
                  {translations.edit}
                </Button>
              </ButtonGroup>
            ),
          })) || []
        }
        labels={[
          { name: translations.name, field: 'name' },
          { name: translations.name, field: 'type' },
          { name: '', field: 'actions' },
        ]}
      />
    </>
  )
}

export default UnpublishedLocations
