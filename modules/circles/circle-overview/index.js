import React from 'react'
import {Text, View, Button} from 'react-native'
import {ConfirmDialog} from 'react-native-simple-dialogs'
import PropTypes from 'prop-types'
import _ from 'lodash/fp'
import styles from './styles'
import CircleSettings from './circle-settings'
import {circlesRef, auth, usersRef} from '../../../config/firebase'

export default class CircleOverview extends React.Component {
  static propTypes = {
    circleId: PropTypes.string.isRequired,
  }

  state = {
    settingsOpened: false,
    ready: false,
  }

  componentWillMount() {
    circlesRef.child(this.props.circleId).once('value', (circleSnapshot) => {
      const {ownerId, color} = circleSnapshot.val()
      const currentUser = auth.currentUser.uid
      const owner = ownerId === currentUser
      this.setState({
        owner,
        currentUser,
        color,
      })
    })
    circlesRef.child(`${this.props.circleId}/name`).on('value', (circleSnapshot) => {
      const name = circleSnapshot.val()
      this.setState({name})
    })
    circlesRef.child(`${this.props.circleId}/users`).on('child_removed', (circleSnapshot) => {
      const removedUserId = circleSnapshot.key
      this.setState({
        userData: this.state.userData.filter(({userId}) => userId !== removedUserId),
      })
    })
    circlesRef.child(`${this.props.circleId}/users`).on('child_added', (circleSnapshot) => {
      const userStatus = circleSnapshot.val()
      const userId = circleSnapshot.key
      usersRef.child(`${userId}/userInfo`).once('value', usersSnapshot =>
        this.setState({
          userData: [...(this.state.userData || []), {...usersSnapshot.val(), userId, userStatus}],
        }))
    })
    circlesRef.child(`${this.props.circleId}/users`).on('child_changed', (circleSnapshot) => {
      const userStatus = circleSnapshot.val()
      const userId = circleSnapshot.key
      this.setState({
        userData: this.state.userData.map(data => (data.userId === userId
          ? {...data, userStatus}
          : data)),
      })
    })
  }

  componentWillUnmount() {
    circlesRef.child(`${this.props.circleId}/users`).off()
    circlesRef.child(`${this.props.circleId}/name`).off()
  }

  kickMember = (uid) => {
    const {circleId} = this.props
    usersRef.child(`${uid}/circles/${circleId}`).remove()
    circlesRef.child(`${circleId}/users/${uid}`).remove()
    this.setState({confirmDelete: false})
  }

  editCircleName = () => (this.state.owner ? null : null)

  toggleReady = () => {
    const {currentUser, ready} = this.state
    const {circleId} = this.props
    circlesRef.child(`${circleId}/users/${currentUser}`).update({ready: !ready})
    this.setState({ready: !ready})
  }

  renderStub = () => <Text>loading circle data...</Text>

  renderConfirm = () => {
    const {confirmDelete} = this.state
    return (
      <ConfirmDialog
        title="Confirm kick"
        message={`Are you sure you want to kick ${_.get('name', confirmDelete)}?`}
        visible={!!this.state.confirmDelete}
        onTouchOutside={() => this.setState({confirmDelete: false})}
        positiveButton={{
          title: 'YES',
          onPress: () => this.kickMember(_.get('userId', confirmDelete)),
        }}
        negativeButton={{
          title: 'NO',
          onPress: () => this.setState({confirmDelete: false}),
        }}
      />
    )
  }

  renderCircleData = () => {
    const {
      name,
      color,
      settingsOpened,
      owner,
      currentUser,
    } = this.state
    const {circleId} = this.props
    return (
      <View style={{marginTop: 50}}>
        <Text onPress={() => this.setState({settingsOpened: !settingsOpened})}>
          {settingsOpened ? 'close settings' : 'open settings'}
        </Text>
        {settingsOpened && (
          <CircleSettings
            name={name}
            color={color}
            circleId={circleId}
            currentUser={currentUser}
            owner={owner}
          />)}
        <Text onPress={this.editCircleName}>{name}</Text>
        <Text>Circle members</Text>
        {this.renderMembers()}
      </View>
    )
  }

  renderMembers = () => {
    const {userData = [], currentUser, owner} = this.state
    return _.map(
      ({name, userId, userStatus: {ready}}) => (
        <View key={userId}>
          <Text style={ready ? styles.acive : styles.inactive}>{name}</Text>
          {owner &&
            currentUser !== userId && <Text onPress={() => this.setState({confirmDelete: {userId, name}})}>kick</Text>}
          {this.renderConfirm()}
        </View>
      ),
      userData,
    )
  }

  render() {
    const {ready} = this.state
    return (
      <View onLayout={this.getLayout} style={styles.container}>
        {this.state.name ? this.renderCircleData() : this.renderStub()}
        <Button title={ready ? 'busy again' : 'ready!'} onPress={this.toggleReady} />
      </View>
    )
  }
}
