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
import CoordinatesInput from './CoordinatesInput'
import Hint from './Hint'
import Text from './Text'
import locationTypes from '../utils/locationTypes'


const LocationForm = ({
  locationData,
  onSubmitLocation,
  updateCurrentMarker,
  cancel,
  isNew,
}) => {
  const [loading, setLoading] = React.useState()
  const [hasWater, setHasWater] = React.useState()
  const [hasFire, setHasFire] = React.useState()

  const { lat, lon } = locationData.location
  const locationToString = [lat, lon]
    .toString()
    .replace(',', ', ')

  return <>
    <Typography variant='h4' gutterBottom>
      <Text id={`markerForm.heading.${isNew ? 'addMarker' : 'editMarker'}`} />
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

      <Input
        name='name'
        label={<Text id='markerForm.place' />}
        min={5}
        initialValue={locationData && locationData.name}
        addon={<Hint message='Postaraj się aby nazwa lokacji była krótka i unikatowa, związana z konkretnym miejscem które dodajesz, tak aby potem można je było łatwo znaleźć. Jeśli lokacja nie ma nazwy własnej (np. Schron Czumak) to warto nawiązać do charakterystycznych punktów znajdujących się w pobliżu. Staraj się unikać ogólnych nazw, takich jak „Wiata przy jeziorze”. Zamiast tego możesz napisać „Wiata przy jeziorze Bukowskim” albo „Chatka przy zielonym szlaku na Turbacz” co ułatwi przeglądanie i wyszukiwanie.' />}
      />

      <Input
        name='description'
        label={<Text id='markerForm.description' />}
        min={40}
        initialValue={locationData && locationData.description}
        addon={<Hint message='W opisie podaj przydatne dla odwiedzających informacje, takie jak wielkość, liczbę miejsc, dostępność, ochrona przed deszczem, jakie są zasady korzystania, dane właściciela i inne adekwatne do dodawanej lokacji. W opisie nie podawaj: współrzędnych lokacji (jest na nie osobne pole), wskazówek dojścia na miejsce (również jest na to osobne pole), informacji o dostępności wody i ognia (są na to osobne pola na końcu formularza).' />}
        multiline
      />

      <Input
        name='directions'
        label={<Text id='locationInfo.directions' />}
        min={20}
        initialValue={locationData && locationData.directions}
        addon={<Hint message='W polu wskazówki dojścia wpisz szczegóły gdzie leży dane miejsce i jak do niego dotrzeć, np. chatkowym szlakiem od odejścia zielonego, w kępie krzaków na łące, mostkiem od północy itp. Pomyśl, że jesteś już blisko, ale jest środek nocy i nic nie widać i ta informacja ma Cię doprowadzić do celu.' />}
        multiline
      />

      <Select
        name='type'
        label={<Text id='markerForm.type' />}
        options={Object.entries(locationTypes).map(([value, label]) => {
          return { value, label: <Text id={label} /> }
        })}
        addon={<Hint message='Wybierz odpowiedni typ miejsca. Dzięki temu na mapie pokaże się odpowiednia ikona i osoby zainteresowane, na przykład tylko wieżami widokowymi, będą mogły łatwo znaleźć Twoje miejsce.' />}
        initialValue={locationData && locationData.type}
      />
      <CoordinatesInput
        name='location'
        label={<Text id='markerForm.location' />}
        initialValue={locationData && locationToString}
        onChange={value => {
          updateCurrentMarker(value)
        }}
        addon={<Hint message='Postaraj się jak najdokładniej umieścić pinezkę lokacji na mapie. Podczas dodawania nowej lokacji możesz przesuwać pinezkę, aby wyznaczyć lokalizację jak najdokładniej. Możesz też wpisać współrzędne w odpowiednie pole, wtedy pinezka przeniesie się w podane miejsce.' />}
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
          addon={<Hint message='Podaj szczegóły, np. jak wydajny jest strumień.' />}
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
          addon={<Hint message='Podaj szczegóły, np. skąd wziąć drewno.' />}
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
            await onSubmitLocation(fields)
            setLoading(false)
          }}
          loading={loading}
        ><Text id='save' /></FormButton>
      </FormActions>
    </Form>
  </>
}

export default LocationForm
