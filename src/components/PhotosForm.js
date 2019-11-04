import React from 'react'
import { Button } from '@material-ui/core'
import Form from 'react-standalone-form'
import {
  MultiImageUpload,
  FormButton,
  FormActions,
} from 'react-standalone-form-mui'
import { strings } from '../lang/strings.js'

const PhotosForm = ({ selectedLocation, onSubmitLocation, cancel }) => {
  console.log('selectedLocation: ', selectedLocation.images.map(image => image.name))
  return (
    <Form fields={['files']} allRequired>
      <MultiImageUpload
        name='files'
        mdHeight='160px'
        spacing={1}
        initialValue={selectedLocation && selectedLocation.images &&
          selectedLocation.images.map(image => `${process.env.REACT_APP_S3_URL}/${selectedLocation.id}/${image.name}`)
        }
      />
      <FormActions>
        <Button onClick={() => cancel()}>Anuluj</Button>
        <FormButton
          variant='contained'
          color='primary'
          callback={fields => onSubmitLocation(fields.files)}
        >{strings.markerForm.cta}</FormButton>
      </FormActions>
    </Form>
  )
}

export default PhotosForm
