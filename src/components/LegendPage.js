import React from 'react'
import Modal from './Modal'
import Legend from './Legend'

const LegendPage = ({
  activeTypes,
  setActiveTypes,
}) =>
  <Modal>
    <Legend
      activeTypes={activeTypes}
      onChange={key => setActiveTypes(key)}
    />
  </Modal>

export default LegendPage
