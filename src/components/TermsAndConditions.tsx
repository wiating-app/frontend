import React from 'react'
import Modal from './Modal'
import useConfig from '../utils/useConfig'

const TermsAndConditions = () => {
  const { termsAndConditions } = useConfig()
  return (
    <Modal>
      <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: termsAndConditions }} />
    </Modal>
  )
}

export default TermsAndConditions
