import React from 'react'
import {Text, TextInput, View} from 'react-native'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {ConfirmDialog} from 'react-native-simple-dialogs'
import {Actions} from 'react-native-router-flux'
import styles from './styles'
import Palette from '../../../ui/palette'
import {circlesRef, usersRef} from '../../../../config/firebase'

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
  }

  componentWillUnmount() {
    const {color} = this.state
    circlesRef
      .child(this.props.circleId)
      .once('value', circleSnapshot => circleSnapshot.val() && circlesRef.child(this.props.circleId).update({color}))
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
          // there is still ownerId!
          : owner && circlesRef.child(`${circleId}/users`).update({ownerId: Object.keys(restUsers)[0]})
      }))
    usersRef
      .child(`${currentUser}/circles/${circleId}`)
      .onDisconnect()
      .cancel()
    usersRef
      .child(`${currentUser}/circles/${circleId}`)
      .remove()
      .then(() => Actions.pop('circleOverview'))
  }

  deleteCircle = () => {
    const {circleId} = this.props
    this.setState({confirmDeleteCircle: false})
    circlesRef
      .child(`${circleId}/users`)
      .once('value', (circleUsersRef) => {
        Object.keys(circleUsersRef.val())
          .filter(key => key !== 'ownerId')
          .forEach((userId) => {
            usersRef
              .child(`${userId}/circles/${circleId}`)
              .onDisconnect()
              .cancel()
            usersRef.child(`${userId}/circles/${circleId}`).remove()
          })
      })
      .then(() =>
        circlesRef
          .child(this.props.circleId)
          .remove()
          .then(Actions.pop('circleOverview')))
  }

  renameCircle = () => {
    const {name} = this.state
    circlesRef.child(this.props.circleId).update({name})
  }

  renderConfirmLeaveCircle = () => {
    const {name} = this.props
    const {confirmLeaveCircle} = this.state
    return (
      <ConfirmDialog
        title="Confirm leave"
        message={`Are you sure you want to leave ${name} circle?`}
        visible={!!confirmLeaveCircle}
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

  renderConfirmDeleteCircle = () => {
    const {name} = this.props
    const {confirmDeleteCircle} = this.state
    return (
      <ConfirmDialog
        title="Confirm delete"
        message={`Are you sure you want to delete ${name} circle?`}
        visible={!!confirmDeleteCircle}
        onTouchOutside={() => this.setState({confirmDeleteCircle: false})}
        positiveButton={{
          title: 'YES',
          onPress: this.deleteCircle,
        }}
        negativeButton={{
          title: 'NO',
          onPress: () => this.setState({confirmDeleteCircle: false}),
        }}
      />
    )
  }

  render() {
    const {name, color} = this.state
    const {owner} = this.props
    return (
      <View style={styles.container}>
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
        {owner && <Text onPress={() => this.setState({confirmDeleteCircle: true})}>Delete circle</Text>}
        {this.renderConfirmLeaveCircle()}
        {this.renderConfirmDeleteCircle()}
      </View>
    )
  }
}
