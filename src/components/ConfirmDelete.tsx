import React from 'react'
import { Box, Typography, Button } from '@material-ui/core'
import Modal from './Modal'
import useLanguage from '../utils/useLanguage'

interface ConfirmDeleteProps {
  id: string | number
  name: string
  deleteCallback: (id: string | number, name: string) => void | Promise<void>
}

const ConfirmDelete = ({
  id,
  name,
  deleteCallback,
}: ConfirmDeleteProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const { translations } = useLanguage()

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteCallback(id, name)
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
            onClick={() => setIsOpen(false)}
            style={{ marginRight: '10px' }}
          >{translations.cancel}</Button>
          <Button
            variant='contained'
            color='primary'
            onClick={handleDelete}
            disabled={loading}
          >{translations.delete}</Button>
        </Modal>
      }
    </>
  )
}

export default ConfirmDelete
