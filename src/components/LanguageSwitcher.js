import React from 'react'
import { Typography, Button } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import Modal from './Modal'
import Text from './Text'


const LanguageSwitcher = ({
  language,
  languages,
  setLanguage,
  onClose,
}) => {
  const { enqueueSnackbar } = useSnackbar()
  return (
    <Modal small onClose={onClose}>
      <div style={{ textAlign: 'center' }}>
        <Typography variant='h6' gutterBottom><Text id='selectLanguage' />:</Typography>
        {languages.map(item =>
          <Button
            onClick={() => {
              onClose()
              setLanguage(item)
              enqueueSnackbar(<Text id='languageChanged' />, { variant: 'success' })
            }}
            variant={item === language ? 'contained' : 'text'}
            disabled={item === language}
            key={item}
          >{item.toUpperCase()}</Button>
        )}
      </div>
    </Modal>
  )
}

export default LanguageSwitcher
