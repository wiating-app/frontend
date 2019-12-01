import React from 'react'
import { Button } from '@material-ui/core'
import Form from 'react-standalone-form'
import {
  MultiImageUpload,
  FormButton,
  FormActions,
} from 'react-standalone-form-mui'
import Text from './Text'

const PhotosForm = ({ selectedLocation, onSubmitLocation, cancel }) => {
  return (
    <Form fields={['files']} allRequired>
      <MultiImageUpload
        name='files'
        mdHeight='160px'
        spacing={1}
        initialValue={selectedLocation && selectedLocation.images &&
          selectedLocation.images.map(image => `${process.env.REACT_APP_CDN_URL}/${selectedLocation.id}/${image.name}`)
        }
      />
      <FormActions>
        <Button onClick={() => cancel()}><Text id='cancel' /></Button>
        <FormButton
          variant='contained'
          color='primary'
          callback={fields => onSubmitLocation(fields.files)}
        ><Text id='markerForm.cta' /></FormButton>
      </FormActions>
    </Form>
  )
}

export default PhotosForm
