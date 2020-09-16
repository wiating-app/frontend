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

  // Convert bool to Select option. null = null, true = 1, false = 2.
  const mapBoolToOptions = value => {
    switch (value) {
      case true:
        return 1
      case false:
        return 2
      default:
        return null
    }
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
        'is_disabled',
      ]}
      required={[
        'name',
        'description',
        !locationData && 'directions',
        'type',
        'location',
      ]}
      onChange={fields => {
        setHasWater(fields.water_exists === 1)
        setHasFire(fields.fire_exists === 1)
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

      <Select
        name='water_exists'
        label={translations.locationInfo.water.label}
        initialValue={locationData && mapBoolToOptions(locationData.water_exists)}
        noneLabel={translations.noData}
        options={[
          { label: translations.locationInfo.water.true, value: 1 },
          { label: translations.locationInfo.water.false, value: 2 },
        ]}
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

      <Select
        name='fire_exists'
        label={translations.locationInfo.fire.label}
        initialValue={locationData && mapBoolToOptions(locationData.fire_exists)}
        noneLabel={translations.noData}
        options={[
          { label: translations.locationInfo.fire.true, value: 1 },
          { label: translations.locationInfo.fire.false, value: 2 },
        ]}
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

      <Checkbox
        name='is_disabled'
        text={translations.locationInfo.setAsDisabled}
        initialValue={locationData && locationData.is_disabled}
      />

      <FormActions>
        <Button onClick={() => cancel()}>{translations.cancel}</Button>
        {!isNew && isModerator &&
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
