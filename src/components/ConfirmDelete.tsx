import React from 'react'
import useLanguage from '../utils/useLanguage'
import Button from './Button'
import ButtonGroup from './ButtonGroup'
import Modal from './Modal'
import Typography from './Typography'

interface ConfirmDeleteProps {
  id: string | number
  name: string
  deleteCallback: (id: string | number, name: string) => void | Promise<void>
}

const ConfirmDelete = ({ id, name, deleteCallback }: ConfirmDeleteProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const { translations } = useLanguage()

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteCallback(id, name)
      setIsOpen(false)
      setLoading(false)
    } catch (_err) {
      setLoading(false)
    }
  }
  return (
    <>
      <Button variant="danger" onClick={() => setIsOpen(true)}>
        {translations.delete}
      </Button>
      {isOpen && (
        <Modal small>
          <Typography gutterBottom>{translations.confirmDeleteLocation}</Typography>
          <ButtonGroup>
            <Button variant="bare" onClick={() => setIsOpen(false)}>
              {translations.cancel}
            </Button>
            <Button variant="primary" onClick={handleDelete} disabled={loading}>
              {translations.delete}
            </Button>
          </ButtonGroup>
        </Modal>
      )}
    </>
  )
}

export default ConfirmDelete
