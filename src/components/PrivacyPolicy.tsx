import React from 'react'
import useConfig from '../utils/useConfig'
import Modal from './Modal'

const PrivacyPolicy = () => {
  const { privacyPolicy } = useConfig()
  return (
    <Modal>
      <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: privacyPolicy }} />
    </Modal>
  )
}

export default PrivacyPolicy
