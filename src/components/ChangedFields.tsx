import React from 'react'
import { Log } from '../typings'
import useLanguage from '../utils/useLanguage'
import Chip from './Chip'

interface ChangedFieldsProps {
  item: Log
}

const ChangedFields = ({ item }: ChangedFieldsProps) => {
  const { translations } = useLanguage()

  return (
    <div className="mt-1 flex flex-wrap gap-1">
      {item._source.changes?.action && item._source.changes.action === 'created' ? (
        <Chip size="small" label={translations.newLocation} />
      ) : (
        Object.keys(item._source.changes || {}).map((key, index) => <Chip key={index} size="small" label={key} />)
      )}
    </div>
  )
}

export default ChangedFields
