import Button from './Button'
import Heading from './Heading'
import Typography from './Typography'
import Form from 'react-form-component'
import FormActions from './Inputs/FormActions'
import SubmitButton from './Inputs/SubmitButton'

import MultiImageUpload from './MultiImageUpload'
import React from 'react'
import useLanguage from '../utils/useLanguage'

interface PhotosFormProps {
  name?: string
  handleSubmit: (images: any[]) => void
  cancel: () => void
}

const PhotosForm = ({ name, handleSubmit, cancel }: PhotosFormProps) => {
  const { translations } = useLanguage()

  return (
    <Form fields={['images']} allMandatory>
      <Heading level={4} gutterBottom>{translations.sendNewPhotos}</Heading>
      <Typography gutterBottom>{name}</Typography>
      <MultiImageUpload
        name='images'
        mdHeight='160px'
        spacing={1}
        uploadLabel={translations.upload}
      />
      <FormActions>
        <Button variant="bare" onClick={() => cancel()}>{translations.cancel}</Button>
        <SubmitButton
          variant='primary'
          onClick={(fields: any) => handleSubmit(fields.images)}
        >{translations.send}</SubmitButton>
      </FormActions>
    </Form>
  )
}

export default PhotosForm
