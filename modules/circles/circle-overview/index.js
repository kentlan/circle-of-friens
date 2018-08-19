import React from 'react'
import {Text, View, Button} from 'react-native'
import {ConfirmDialog} from 'react-native-simple-dialogs'
import _ from 'lodash/fp'
import styles from './styles'
import CircleSettings from './circle-settings'
import {circlesRef, auth, usersRef} from '../../../config/firebase'

const NOT_BUSY = true

export default class CircleOverview extends React.Component {
  state = {
    settingsOpened: false,
    ready: false,
  }

  componentWillMount() {
    circlesRef.child(this.props.circleId).once('value', (circleSnapshot) => {
      const {name, ownerId} = circleSnapshot.val()
      const currentUser = auth.currentUser.uid
      const owner = ownerId === currentUser
      this.setState({
        name,
        owner,
        currentUser,
      })
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
      console.log(userStatus, userId)
    })
  }

  componentWillUnmount() {
    circlesRef.child(`${this.props.circleId}/users`).off()
  }

  kickMember = (uid) => {
    const {circleId} = this.props
    usersRef.child(`${uid}/circles/${circleId}`).remove()
    circlesRef.child(`${circleId}/users/${uid}`).remove()
    this.setState({confirmDelete: false})
  }

  editCircleName = () => (this.state.owner ? null : null)

  renderStub = () => <Text>loading circle data...</Text>

  renderMate = ({name}) => (
    <View>
      <Text style={NOT_BUSY ? styles.acive : styles.inactive}>{name}</Text>
    </View>
  )

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
    const {name, settingsOpened} = this.state
    return (
      <View style={{marginTop: 10}}>
        <Text onPress={() => this.setState({settingsOpened: !settingsOpened})}>
          {settingsOpened ? 'close settings' : 'open settings'}
        </Text>
        {settingsOpened && <CircleSettings />}
        <Text onPress={this.editCircleName}>{name}</Text>
        <Text>Circle members</Text>
        {this.renderMembers()}
      </View>
    )
  }

  renderMembers = () => {
    const {userData = [], currentUser, owner} = this.state
    return _.map(
      ({name, userId}) =>
        (
          <View key={userId}>
            <Text>{name}</Text>
            {owner &&
              currentUser !== userId && (
                <Text onPress={() => this.setState({confirmDelete: {userId, name}})}>kick</Text>
              )}
            {this.renderConfirm()}
          </View>
        ),
      userData,
    )
  }

  toggleReady = () => {
    const {currentUser, ready} = this.state
    const {circleId} = this.props
    circlesRef.child(`${circleId}/users/${currentUser}`).update({ready: !ready})
    this.setState({ready: !ready})
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
