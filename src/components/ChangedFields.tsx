import React from 'react'
import Chip from './Chip'
import useLanguage from '../utils/useLanguage'
import { Log } from '../typings'

interface ChangedFieldsProps {
  item: Log
}

const ChangedFields = ({ item }: ChangedFieldsProps) => {
  const { translations } = useLanguage()

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {item._source.changes?.action && item._source.changes.action === 'created'
        ? <Chip size="small" label={translations.newLocation} />
        : Object.keys(item._source.changes || {}).map((key, index) => (
          <Chip key={index} size="small" label={key} />
        ))
      }
    </div>
  )
}

export default ChangedFields
