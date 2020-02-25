import React from 'react'
import dot from 'dot-object'
import { TranslationsContext } from '../utils/TranslationsProvider'


const Text = ({ id }) => {
  const [translations] = React.useContext(TranslationsContext)
  const string = dot.pick(id, translations)
  return string || '[No string]'
}


export default Text
