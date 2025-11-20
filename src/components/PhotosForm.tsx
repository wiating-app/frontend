import { Button, Typography } from '@material-ui/core'
import Form, {
  FormActions,
  SubmitButton,
} from '@react-form-component/mui'

import MultiImageUpload from './MultiImageUpload'
import React from 'react'
import useLanguage from '../utils/useLanguage'

interface PhotosFormProps {
  name?: string
  images?: any[]
  handleSubmit: (images: any[]) => void
  cancel: () => void
}

const PhotosForm = ({ name, images, handleSubmit, cancel }: PhotosFormProps) => {
  const { translations } = useLanguage()

  return (
    <Form fields={['images']} allMandatory>
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
        <SubmitButton
          {...({ variant: 'contained' } as any)}
          color='primary'
          onClick={(fields: any) => handleSubmit(fields.images)}
        >{translations.send}</SubmitButton>
      </FormActions>
    </Form>
  )
}

export default PhotosForm

