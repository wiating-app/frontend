import React from 'react'
import Modal from './Modal'
import useConfig from '../utils/useConfig'

const PrivacyPolicy = () => {
  const { privacyPolicy } = useConfig()
  return (
    <Modal>
      <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: privacyPolicy }} />
    </Modal>
  )
}

export default PrivacyPolicy
