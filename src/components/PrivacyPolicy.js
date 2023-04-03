import React from 'react'
import Modal from './Modal'
import useConfig from '../utils/useConfig'

const PrivacyPolicy = () =>{
  const { privacyPolicy } = useConfig()
  return (
    <Modal>
      <div dangerouslySetInnerHTML={{ __html: privacyPolicy }} />
    </Modal>
  )
}

export default PrivacyPolicy
