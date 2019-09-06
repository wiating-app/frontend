import React from 'react';
import styled from 'styled-components';

import { strings } from '../lang/strings.js';

const ContextMenuContainer = styled.div`
  position: absolute;
  z-index: 99;
  background: #fff;
  padding: 10px;
  left: ${props => props.posX}px;
  top: ${props => props.posY}px;
`;

export class ContextMenu extends React.Component {
  render() {
    return(
      <ContextMenuContainer posX={this.props.x} posY={this.props.y}>
        <button onClick={() => this.props.addMarker(this.props.x, this.props.y)} className="link">{ strings.map.add }</button>
      </ContextMenuContainer>
    )
  }
}

export default ContextMenu;
