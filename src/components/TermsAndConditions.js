import React from 'react'
import Modal from './Modal'
import useConfig from '../utils/useConfig'

const TermsAndConditions = () => {
  const { termsAndConditions } = useConfig()
  return (
    <Modal>
      <div dangerouslySetInnerHTML={{ __html: termsAndConditions }} />
    </Modal>
  )
}

export default TermsAndConditions
