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
import generateMarkerIcon from '../utils/generateMarkerIcon'
import useLanguage from '../utils/useLanguage'
import useConfig from '../utils/useConfig'
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
  const { translations, language } = useLanguage()
  const { locationTypes, settings: {
    enableDirectionsField,
    enableFireField,
    enableWaterField,
  } } = useConfig()

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
      {translations[isNew ? 'addMarker' : 'editMarker']}
    </Typography>
    <Form
      fields={[
        'name',
        'description',
        ...enableDirectionsField ? ['directions'] : [],
        'type',
        'location',
        ...enableWaterField ? ['water_exists', 'water_comment'] : [],
        ...enableFireField ? ['fire_exists', 'fire_comment'] : [],
        'is_disabled',
        'unpublished',
      ]}
      mandatory={[
        'name',
        'description',
        ...enableDirectionsField ? ['directions'] : [],
        'type',
        'location',
      ]}
      onChange={fields => {
        setHasWater(fields.water_exists === 1)
        setHasFire(fields.fire_exists === 1)
      }}
    >

      <HintWrapper message={translations.locationNameHint}>
        <Input
          name='name'
          label={translations.locationName}
          min={5}
          initialValue={locationData?.name}
        />
      </HintWrapper>

      <HintWrapper message={translations.locationHint}>
        <CoordinatesInput
          name='location'
          label={translations.coordinates}
          initialValue={locationData && locationToString(locationData.location)}
          onChange={value => {
            updateCurrentMarker(value)
          }}
        />
      </HintWrapper>

      <HintWrapper message={translations.descriptionHint}>
        <Input
          name='description'
          label={translations.description}
          min={40}
          initialValue={locationData?.description}
          multiline
        />
      </HintWrapper>

      {enableDirectionsField &&
        <HintWrapper message={translations.markerForm.directionsHint}>
          <Input
            name='directions'
            label={translations.directions}
            min={20}
            initialValue={locationData?.directions}
            multiline
          />
        </HintWrapper>
      }

      <HintWrapper message={translations.locationTypeHint}>
        <Select
          name='type'
          label={translations.locationType}
          options={locationTypes.map(({ id, label }) => ({
            value: id,
            label: label[language],
            icon: <div
              dangerouslySetInnerHTML={{ __html: generateMarkerIcon(id, 24) }}
            />,
          }))}
          initialValue={locationData?.type}
        />
      </HintWrapper>

      {enableWaterField &&
        <>
          <Select
            name='water_exists'
            label={translations.waterLabel}
            initialValue={locationData && mapBoolToOptions(locationData.water_exists)}
            placeholder={translations.noData}
            options={[
              { label: translations.waterTrue, value: 1 },
              { label: translations.waterFalse, value: 2 },
            ]}
          />

          {hasWater &&
            <HintWrapper message={translations.waterDescriptionHint}>
              <Input
                name='water_comment'
                label={translations.waterDescription}
                min={20}
                initialValue={locationData?.water_comment}
                multiline
              />
            </HintWrapper>
          }
        </>
      }

      {enableFireField &&
        <>
          <Select
            name='fire_exists'
            label={translations.fireLabel}
            initialValue={locationData && mapBoolToOptions(locationData.fire_exists)}
            placeholder={translations.noData}
            options={[
              { label: translations.fireTrue, value: 1 },
              { label: translations.fireFalse, value: 2 },
            ]}
          />

          {hasFire &&
            <HintWrapper message={translations.fireDescriptionHint}>
              <Input
                name='fire_comment'
                label={translations.fireDescription}
                min={20}
                initialValue={locationData?.fire_comment}
                multiline
              />
            </HintWrapper>
          }
        </>
      }

      <Checkbox
        name='is_disabled'
        text={translations.setAsDisabled}
        initialValue={locationData?.is_disabled}
      />

      {!isNew && isModerator &&
        <Checkbox
          name='unpublished'
          text={translations.unpublish}
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
