import React from 'react'
import { Button, Typography } from '@material-ui/core'
import Form, {
  Input,
  Select,
  SubmitButton,
  Checkbox,
  FormActions,
} from '@react-form-component/mui'
import CoordinatesInput from './CoordinatesInput'
import HintWrapper from './HintWrapper'
import ConfirmDelete from './ConfirmDelete'
import locationTypes from '../utils/locationTypes'
import generateMarkerIcon from '../utils/generateMarkerIcon'
import useLanguage from '../utils/useLanguage'
import { locationToString } from '../utils/helpers'


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
        'unpublished',
      ]}
      mandatory={[
        'name',
        'description',
        'directions',
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
          initialValue={locationData?.name}
        />
      </HintWrapper>

      <HintWrapper message={translations.markerForm.locationHint}>
        <CoordinatesInput
          name='location'
          label={translations.markerForm.location}
          initialValue={locationData && locationToString(locationData.location)}
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
          initialValue={locationData?.description}
          multiline
        />
      </HintWrapper>

      <HintWrapper message={translations.markerForm.directionsHint}>
        <Input
          name='directions'
          label={translations.locationInfo.directions}
          min={20}
          initialValue={locationData?.directions}
          multiline
        />
      </HintWrapper>

      <HintWrapper message={translations.markerForm.typeHint}>
        <Select
          name='type'
          label={translations.markerForm.type}
          options={Object.entries(locationTypes).map(([value, type]) => ({
            value,
            label: translations.locationType[type.label],
            icon: <div
              dangerouslySetInnerHTML={{ __html: generateMarkerIcon(value, 24) }}
            />,
          }))}
          initialValue={locationData?.type}
        />
      </HintWrapper>

      <Select
        name='water_exists'
        label={translations.locationInfo.water.label}
        initialValue={locationData && mapBoolToOptions(locationData.water_exists)}
        placeholder={translations.noData}
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
            initialValue={locationData?.water_comment}
            multiline
          />
        </HintWrapper>
      }

      <Select
        name='fire_exists'
        label={translations.locationInfo.fire.label}
        initialValue={locationData && mapBoolToOptions(locationData.fire_exists)}
        placeholder={translations.noData}
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
            initialValue={locationData?.fire_comment}
            multiline
          />
        </HintWrapper>
      }

      <Checkbox
        name='is_disabled'
        text={translations.locationInfo.setAsDisabled}
        initialValue={locationData?.is_disabled}
      />

      {!isNew && isModerator &&
        <Checkbox
          name='unpublished'
          text={translations.locationInfo.unpublish}
          initialValue={locationData?.unpublished}
        />
      }

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
        <SubmitButton
          variant='contained'
          color='primary'
          onClick={async fields => {
            setLoading(true)
            await onSubmitLocation(fields)
            setLoading(false)
          }}
          loading={loading}
        >{translations.save}</SubmitButton>
      </FormActions>
    </Form>
  </>
}

export default LocationForm
