import React from 'react'
import {Text, TextInput, View} from 'react-native'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {ConfirmDialog} from 'react-native-simple-dialogs'
import {Actions} from 'react-native-router-flux'
import styles from './styles'
import Palette from '../../../ui/palette'
import {circlesRef, usersRef} from '../../../../config/firebase'

const container = {
  justifyContent: 'center',
  alignItems: 'center',
}

export default class CircleSettings extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    circleId: PropTypes.string.isRequired,
    owner: PropTypes.bool.isRequired,
    currentUser: PropTypes.string.isRequired,
  }

  state = {
    name: this.props.name,
    color: this.props.color,
    confirmLeaveCircle: false,
  }

  componentWillUnmount() {
    const {color} = this.state
    circlesRef.child(this.props.circleId).update({color})
  }

  changeName = name => this.setState({name})

  selectColor = color => this.setState({color})

  leaveCircle = () => {
    const {owner, circleId, currentUser} = this.props

    this.setState({confirmLeaveCircle: false})
    circlesRef
      .child(`${circleId}/users/${currentUser}`)
      .remove()
      .then(circlesRef.child(`${circleId}/users`).once('value', (usersSnapshot) => {
        const restUsers = usersSnapshot.val()
        return _.isEmpty(restUsers)
          ? this.deleteCircle()
          : owner && circlesRef.child(`${circleId}/users`).update({ownerId: Object.keys(restUsers)[0]})
      }))
    usersRef
      .child(`${currentUser}/circles/${circleId}`)
      .remove()
      .then(Actions.pop('circleOverview'))
  }

  deleteCircle = () => {
    circlesRef.child(this.props.circleId).remove()
  }

  renameCircle = () => {
    const {name} = this.state
    circlesRef.child(this.props.circleId).update({name})
  }

  renderConfirm = () => {
    const {name} = this.props
    const {confirmLeaveCircle} = this.state
    return (
      <ConfirmDialog
        title="Confirm leave"
        message={`Are you sure you want to leave ${name} circle?`}
        visible={confirmLeaveCircle}
        onTouchOutside={() => this.setState({confirmLeaveCircle: false})}
        positiveButton={{
          title: 'YES',
          onPress: this.leaveCircle,
        }}
        negativeButton={{
          title: 'NO',
          onPress: () => this.setState({confirmLeaveCircle: false}),
        }}
      />
    )
  }

  render() {
    const {name, color} = this.state
    const {owner} = this.props
    return (
      <View style={container}>
        {owner && (
          <View>
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
            <View style={{maxHeight: 50}}>
              <Palette onColorPick={this.selectColor} activeColor={color} />
            </View>
          </View>
        )}
        <Text onPress={() => this.setState({confirmLeaveCircle: true})}>Leave circle</Text>
        {owner && <Text>Delete circle</Text>}
        {this.renderConfirm()}
      </View>
    )
  }
}
