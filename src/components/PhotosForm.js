import React from 'react'
import { Typography, Button } from '@material-ui/core'
import Form from 'react-standalone-form'
import {
  // MultiImageUpload,
  FormButton,
  FormActions,
} from 'react-standalone-form-mui'
import useLanguage from '../utils/useLanguage'
import MultiImageUpload from './MultiImageUpload'


const PhotosForm = ({ name, handleSubmit, cancel }) => {
  const { translations } = useLanguage()

  return (
    <Form fields={['images']} allRequired>
      <Typography variant='h4' gutterBottom>{translations.sendNewPhotos}</Typography>
      <Typography gutterBottom>{name}</Typography>
      <MultiImageUpload
        name='images'
        mdHeight='160px'
        spacing={1}
        uploadLabel={translations.upload}
      />
      <FormActions>
        <Button onClick={() => cancel()}>{translations.cancel}</Button>
        <FormButton
          variant='contained'
          color='primary'
          callback={fields => handleSubmit(fields.images)}
        >{translations.send}</FormButton>
      </FormActions>
    </Form>
  )
}

export default PhotosForm
