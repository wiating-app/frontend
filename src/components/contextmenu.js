import React from 'react'
import styled from 'styled-components'

import { strings } from '../lang/strings.js'

const ContextMenuContainer = styled.div`
  position: absolute;
  z-index: 99;
  background: #fff;
  padding: 10px;
  left: ${props => props.posX}px;
  top: ${props => props.posY}px;
`

const ContextMenu = props => {
  const { x = 0, y = 0 } = props.coordinates
  return (
    <ContextMenuContainer posX={x} posY={y}>
      <button onClick={() => addMarker(this.props.x, this.props.y)} className='link'>{strings.map.add}</button>
    </ContextMenuContainer>
  )
}

export default ContextMenu
