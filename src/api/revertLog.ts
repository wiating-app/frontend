import api from '../api'
import { LogDetails } from '../typings'

export const revertLog = async (logDetails: LogDetails): Promise<void> => {
  const { _source } = logDetails
  // Use another endpoint if change from given log refers to image.
  // eslint-disable-next-line camelcase
  if (_source.changes?.images?.new_value) {
    await api.delete(`delete_image/${_source.doc_id}/${_source.changes.images.new_value}`)
  } else {
    const dataObject = Object.entries(_source.changes || {}).reduce(
      (acc, [name, value]: [string, any]) => ({
        ...acc,
        [name]: value.old_value,
      }),
      {},
    )
    await api.put(`modify_point/${_source.doc_id}`, dataObject)
  }
}
