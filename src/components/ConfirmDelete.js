import React from 'react'
import { Box, Typography, Button } from '@material-ui/core'
import Modal from './Modal'
import useLanguage from '../utils/useLanguage'

const ConfirmDelete = ({
  id,
  name,
  deleteCallback,
}) => {
  const [isOpen, setIsOpen] = React.useState()
  const [loading, setLoading] = React.useState()
  const { translations } = useLanguage()

  const handleDelete = async () => {
    setLoading(true)
    try {
      deleteCallback(id, name)
      setIsOpen(false)
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }
  return (
    <>
      <Button
        variant='text'
        onClick={() => setIsOpen(true)}
      ><Box color='error.main'>{translations.delete}</Box></Button>
      {isOpen &&
        <Modal small>
          <Typography gutterBottom>{translations.confirmDeleteLocation}</Typography>
          <Button
            variant='contained'
            onClick={() => setIsOpen()}
            style={{ marginRight: '10px' }}
          >{translations.cancel}</Button>
          <Button
            variant='contained'
            color='primary'
            onClick={handleDelete}
            loading={loading}
          >{translations.delete}</Button>
        </Modal>
      }
    </>
  )
}

export default ConfirmDelete