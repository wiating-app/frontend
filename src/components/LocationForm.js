import React from 'react'
import { Button } from '@material-ui/core'
import Form from 'react-standalone-form'
import {
  Input,
  FormButton,
  Select,
  Checkbox,
  FormActions,
} from 'react-standalone-form-mui'
import texts from '../utils/texts'
import locationTypes from '../utils/locationTypes'


const LocationForm = ({
  selectedLocation,
  onSubmitLocation,
  setActiveMarker,
  cancel,
}) => {
  const [loading, setLoading] = React.useState()
  const [hasWater, setHasWater] = React.useState()
  const [hasFire, setHasFire] = React.useState()

  return (
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
        label={texts.markerForm.place}
        min={5}
        initialValue={selectedLocation && selectedLocation.name}
      />

      <Input
        name='description'
        label={texts.markerForm.description}
        min={40}
        initialValue={selectedLocation && selectedLocation.description}
        multiline
      />

      <Select
        name='type'
        label={texts.markerForm.type}
        options={Object.entries(locationTypes).map(([value, label]) => ({ value, label }))}
        initialValue={selectedLocation && selectedLocation.type}
      />

      <Input
        name='location'
        label={texts.markerForm.coordinates}
        min={5}
        initialValue={selectedLocation && `${selectedLocation.location.lat}, ${selectedLocation.location.lon}`}
        help='Format: 00.0000, 00.0000'
      />

      <Checkbox
        name='water_exists'
        text={texts.marker.waterAccess}
        initialValue={selectedLocation && selectedLocation.water && selectedLocation.water.exists}
      />

      {hasWater &&
        <Input
          name='water_comment'
          label={texts.markerForm.waterDescription}
          min={40}
          initialValue={selectedLocation && selectedLocation.water && selectedLocation.water.comment}
          multiline
        />
      }

      <Checkbox
        name='fire_exists'
        text={texts.marker.fireAccess}
        initialValue={selectedLocation && selectedLocation.fire && selectedLocation.fire.exists}
      />

      {hasFire &&
        <Input
          name='fire_comment'
          label={texts.markerForm.fireDescription}
          min={40}
          initialValue={selectedLocation && selectedLocation.fire && selectedLocation.fire.comment}
          multiline
        />
      }

      <FormActions>
        <Button onClick={() => cancel()}>Anuluj</Button>
        <FormButton
          variant='contained'
          color='primary'
          callback={async fields => {
            setLoading(true)
            await onSubmitLocation(fields, !!selectedLocation.id)
            setLoading(false)
          }}
          loading={loading}
        >{texts.markerForm.cta}</FormButton>
      </FormActions>
    </Form>
  )
}

export default LocationForm
