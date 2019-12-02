import React from 'react'
import { Button, Typography } from '@material-ui/core'
import Form from 'react-standalone-form'
import {
  Input,
  FormButton,
  Select,
  Checkbox,
  FormActions,
} from 'react-standalone-form-mui'
import Text from './Text'
import locationTypes from '../utils/locationTypes'


const LocationForm = ({
  locationData,
  onSubmitLocation,
  setCachedLocation,
  cancel,
  isNew,
}) => {
  const [loading, setLoading] = React.useState()
  const [hasWater, setHasWater] = React.useState()
  const [hasFire, setHasFire] = React.useState()

  return <>
    <Typography variant='h4' gutterBottom>
      <Text id={`markerForm.heading.${isNew ? 'addMarker' : 'editMarker'}`} />
    </Typography>
    <Form
      fields={[
        'name',
        'description',
        'type',
        'location',
        'water_exists',
        'water_comment',
        'fire_exists',
        'fire_comment',
      ]}
      required={[
        'name',
        'description',
        'type',
        'location',
      ]}
      callbackOnChange={fields => {
        setHasWater(fields.water_exists)
        setHasFire(fields.fire_exists)
        const location = fields.location.split(', ')
        if (locationData.location.lat !== location[0] || locationData.location.lon !== location[1]) {
          setCachedLocation(location)
        }
      }}
    >

      <Input
        name='name'
        label={<Text id='markerForm.place' />}
        min={5}
        initialValue={locationData && locationData.name}
      />

      <Input
        name='description'
        label={<Text id='markerForm.description' />}
        min={40}
        initialValue={locationData && locationData.description}
        multiline
      />

      <Select
        name='type'
        label={<Text id='markerForm.type' />}
        options={Object.entries(locationTypes).map(([value, label]) => {
          return { value, label: <Text id={label} /> }
        })}
        initialValue={locationData && locationData.type}
      />

      <Input
        name='location'
        label={<Text id='markerForm.location' />}
        min={5}
        initialValue={locationData && `${locationData.location.lat}, ${locationData.location.lon}`}
        help='Format: 00.0000, 00.0000'
      />

      <Checkbox
        name='water_exists'
        text={<Text id='locationInfo.waterAccess' />}
        initialValue={locationData && locationData.water && locationData.water.exists}
      />

      {hasWater &&
        <Input
          name='water_comment'
          label={<Text id='markerForm.waterDescription' />}
          min={40}
          initialValue={locationData && locationData.water && locationData.water.comment}
          multiline
        />
      }

      <Checkbox
        name='fire_exists'
        text={<Text id='locationInfo.fireAccess' />}
        initialValue={locationData && locationData.fire && locationData.fire.exists}
      />

      {hasFire &&
        <Input
          name='fire_comment'
          label={<Text id='markerForm.fireDescription' />}
          min={40}
          initialValue={locationData && locationData.fire && locationData.fire.comment}
          multiline
        />
      }

      <FormActions>
        <Button onClick={() => cancel()}><Text id='cancel' /></Button>
        <FormButton
          variant='contained'
          color='primary'
          callback={async fields => {
            setLoading(true)
            await onSubmitLocation(fields, !!locationData.id)
            setLoading(false)
          }}
          loading={loading}
        ><Text id='save' /></FormButton>
      </FormActions>
    </Form>
  </>
}

export default LocationForm
