import React from 'react'
import useConfig from '../utils/useConfig'
import Modal from './Modal'

const TermsAndConditions = () => {
  const { termsAndConditions } = useConfig()
  return (
    <Modal>
      <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: termsAndConditions }} />
    </Modal>
  )
}

export default TermsAndConditions
