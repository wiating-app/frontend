import React from 'react'
import useAuth0 from '../utils/useAuth0'


const UnpublishedContainer = () => {
  const { isModerator } = useAuth0()
  return (
    isModerator
      ? <>Tutaj będzie lista lokacji, których publikacja została wstrzymana.</>
      : null
  )
}

export default UnpublishedContainer
