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
  selectedLocation,
  onSubmitLocation,
  setActiveMarker,
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
        if (selectedLocation.location.lat !== location[0] || selectedLocation.location.lon !== location[1]) {
          setActiveMarker(location)
        }
      }}
    >

      <Input
        name='name'
        label={<Text id='markerForm.place' />}
        min={5}
        initialValue={selectedLocation && selectedLocation.name}
      />

      <Input
        name='description'
        label={<Text id='markerForm.description' />}
        min={40}
        initialValue={selectedLocation && selectedLocation.description}
        multiline
      />

      <Select
        name='type'
        label={<Text id='markerForm.type' />}
        options={Object.entries(locationTypes).map(([value, label]) => {
          return { value, label: <Text id={label} /> }
        })}
        initialValue={selectedLocation && selectedLocation.type}
      />

      <Input
        name='location'
        label={<Text id='markerForm.location' />}
        min={5}
        initialValue={selectedLocation && `${selectedLocation.location.lat}, ${selectedLocation.location.lon}`}
        help='Format: 00.0000, 00.0000'
      />

      <Checkbox
        name='water_exists'
        text={<Text id='locationInfo.waterAccess' />}
        initialValue={selectedLocation && selectedLocation.water && selectedLocation.water.exists}
      />

      {hasWater &&
        <Input
          name='water_comment'
          label={<Text id='markerForm.waterDescription' />}
          min={40}
          initialValue={selectedLocation && selectedLocation.water && selectedLocation.water.comment}
          multiline
        />
      }

      <Checkbox
        name='fire_exists'
        text={<Text id='locationInfo.fireAccess' />}
        initialValue={selectedLocation && selectedLocation.fire && selectedLocation.fire.exists}
      />

      {hasFire &&
        <Input
          name='fire_comment'
          label={<Text id='markerForm.fireDescription' />}
          min={40}
          initialValue={selectedLocation && selectedLocation.fire && selectedLocation.fire.comment}
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
            await onSubmitLocation(fields, !!selectedLocation.id)
            setLoading(false)
          }}
          loading={loading}
        ><Text id='save' /></FormButton>
      </FormActions>
    </Form>
  </>
}

export default LocationForm
