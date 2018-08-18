import React from 'react'
import Draggable from 'react-native-draggable'
import PropTypes from 'prop-types'
import {Actions} from 'react-native-router-flux'
import {auth, usersRef} from '../../../config/firebase'

export default class Circles extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    color: PropTypes.string.isRequired,
    circleId: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    x: PropTypes.number,
    y: PropTypes.number,
  }

  static defaultProps = {
    x: 0,
    y: 0,
    name: '',
  }

  state = {
    x: this.props.x,
    y: this.props.y,
  }

  updatePosition = (x, y) => {
    const {circleId} = this.props
    this.setState({x, y})
    usersRef.child(`${auth.currentUser.uid}/circles/${circleId}`).onDisconnect().update({x, y})
  }

  render() {
    const {
      name,
      color,
      circleId,
      index,
      x,
      y,
    } = this.props
    return (
      <Draggable
        pressDragRelease={(event, {dx, dy}) =>
          this.updatePosition(this.state.x + dx, this.state.y + dy)
        }
        pressDrag={() => Actions.push('circleOverview', {circleId})}
        reverse={false}
        renderSize={56}
        renderColor={color}
        x={x}
        y={y}
        z={index}
        renderText={name}
        key={circleId}
      />
    )
  }
}
