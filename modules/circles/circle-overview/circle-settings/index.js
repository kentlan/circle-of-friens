import React from 'react'
import {Text, TextInput, View} from 'react-native'
import PropTypes from 'prop-types'
import styles from './styles'
import Palette from '../../../ui/palette';
import { circlesRef } from '../../../../config/firebase';

const container = {
  justifyContent: 'center',
  alignItems: 'center',
}

export default class CircleSettings extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    circleId: PropTypes.string.isRequired,
  }

  state = {
    name: this.props.name,
    color: this.props.color,
  }

  componentWillUnmount() {
    const {color} = this.state
    circlesRef.child(this.props.circleId).update({color})
  }

  changeName = name => this.setState({name})

  selectColor = color => this.setState({color})

  renameCircle = () => {
    const {name} = this.state
    circlesRef.child(this.props.circleId).update({name})
  }

  render() {
    const {name, color} = this.state
    return (
      <View style={container}>
        <Text>Circle name</Text>
        <TextInput
          style={styles.nameInput}
          placeholder="Leave circle unnamed, great"
          onChangeText={this.changeName}
          value={name}
          maxLength={40}
          onBlur={this.renameCircle}
        />
        <Text>Circle color</Text>
        <Palette onColorPick={this.selectColor} activeColor={color} />
        <Text>Leave circle</Text>
        <Text>Delete circle</Text>
      </View>
    )
  }
}
