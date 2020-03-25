import React from 'react'
import { Button, Typography } from '@material-ui/core'
import Form from 'react-standalone-form'
import {
  Input,
  FormButton,
  Checkbox,
  FormActions,
} from 'react-standalone-form-mui'
import CoordinatesInput from './CoordinatesInput'
import HintWrapper from './HintWrapper'
import Select from './Select'
import ConfirmDelete from './ConfirmDelete'
import locationTypes from '../utils/locationTypes'
import { getIconUrl } from '../utils/helpers'
import useLanguage from '../utils/useLanguage'


const LocationForm = ({
  locationData,
  onSubmitLocation,
  updateCurrentMarker,
  cancel,
  isModerator,
  onDeleteLocation,
  isNew,
}) => {
  const [loading, setLoading] = React.useState()
  const [hasWater, setHasWater] = React.useState()
  const [hasFire, setHasFire] = React.useState()
  const { translations } = useLanguage()

  const locationToString = () => {
    const { lat, lon } = locationData.location
    return [lat, lon].toString().replace(',', ', ')
  }

  return <>
    <Typography variant='h4' gutterBottom>
      {translations[`markerForm.heading.${isNew ? 'addMarker' : 'editMarker'}`]}
    </Typography>
    <Form
      fields={[
        'name',
        'description',
        'directions',
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
        'directions',
        'type',
        'location',
      ]}
      callbackOnChange={fields => {
        setHasWater(fields.water_exists)
        setHasFire(fields.fire_exists)
      }}
    >

      <HintWrapper message={translations.markerForm.placeHint}>
        <Input
          name='name'
          label={translations.markerForm.place}
          min={5}
          initialValue={locationData && locationData.name}
        />
      </HintWrapper>

      <HintWrapper message={translations.markerForm.descriptionHint}>
        <Input
          name='description'
          label={translations.markerForm.description}
          min={40}
          initialValue={locationData && locationData.description}
          multiline
        />
      </HintWrapper>

      <HintWrapper message={translations.markerForm.directionsHint}>
        <Input
          name='directions'
          label={translations.locationInfo.directions}
          min={20}
          initialValue={locationData && locationData.directions}
          multiline
        />
      </HintWrapper>

      <HintWrapper message={translations.markerForm.typeHint}>
        <Select
          name='type'
          label={translations.markerForm.type}
          options={Object.entries(locationTypes).map(([value, label]) => ({
            value,
            label: translations.locationType[label],
            icon: <img src={getIconUrl(value)} alt='' height='30' />,
          }))}
          initialValue={locationData && locationData.type}
        />
      </HintWrapper>

      <HintWrapper message={translations.markerForm.locationHint}>
        <CoordinatesInput
          name='location'
          label={translations.markerForm.location}
          initialValue={locationData && locationToString()}
          onChange={value => {
            updateCurrentMarker(value)
          }}
        />
      </HintWrapper>

      <Checkbox
        name='water_exists'
        text={translations.locationInfo.waterAccess}
        initialValue={locationData && locationData.water_exists}
      />

      {hasWater &&
        <HintWrapper message={translations.markerForm.waterDescriptionHint}>
          <Input
            name='water_comment'
            label={translations.markerForm.waterDescription}
            min={40}
            initialValue={locationData && locationData.water_comment}
            multiline
          />
        </HintWrapper>
      }

      <Checkbox
        name='fire_exists'
        text={translations.locationInfo.fireAccess}
        initialValue={locationData && locationData.fire_exists}
      />

      {hasFire &&
        <HintWrapper message={translations.markerForm.fireDescriptionHint}>
          <Input
            name='fire_comment'
            label={translations.markerForm.fireDescription}
            min={40}
            initialValue={locationData && locationData.fire_comment}
            multiline
          />
        </HintWrapper>
      }

      <FormActions>
        <Button onClick={() => cancel()}>{translations.cancel}</Button>
        {isModerator &&
          <ConfirmDelete
            id={locationData.id}
            title={translations.deleteThisEntry}
            name={locationData.name}
            deleteCallback={onDeleteLocation}
          />
        }
        <FormButton
          variant='contained'
          color='primary'
          callback={async fields => {
            setLoading(true)
            await onSubmitLocation(fields)
            setLoading(false)
          }}
          loading={loading}
        >{translations.save}</FormButton>
      </FormActions>
    </Form>
  </>
}

export default LocationForm
