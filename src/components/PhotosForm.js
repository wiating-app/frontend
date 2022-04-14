import { Button, Typography } from '@material-ui/core'
import {
  FormActions,
  FormButton,
} from 'react-standalone-form-mui'

import Form from 'react-standalone-form'
import MultiImageUpload from './MultiImageUpload'
import React from 'react'
import useLanguage from '../utils/useLanguage'

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
          onClick={fields => handleSubmit(fields.images)}
        >{translations.send}</FormButton>
      </FormActions>
    </Form>
  )
}

export default PhotosForm
