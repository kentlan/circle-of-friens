import React from 'react'
import {Text, View, Button} from 'react-native'
import {ConfirmDialog} from 'react-native-simple-dialogs'
import _ from 'lodash/fp'
import styles from './styles'
import {circlesRef, auth, usersRef} from '../../../config/firebase'

const NOT_BUSY = true

export default class CircleOverview extends React.Component {
  state = {}

  componentWillMount() {
    circlesRef.child(this.props.circleId).once('value', (circleSnapshot) => {
      const {
        color, name, ownerId,
      } = circleSnapshot.val()
      const currentUser = auth.currentUser.uid
      const owner = ownerId === currentUser
      this.setState({
        color,
        name,
        owner,
        currentUser,
      })
    })
    circlesRef.child(`${this.props.circleId}/users`).on('child_removed', (circleSnapshot) => {
      const removedUserId = circleSnapshot.val()
      this.setState({
        userData: this.state.userData.filter(({userId}) => userId !== removedUserId),
      })
    })
    circlesRef.child(`${this.props.circleId}/users`).on('child_added', (circleSnapshot) => {
      const userId = circleSnapshot.val()
      usersRef.child(userId).once('value', usersSnapshot =>
        this.setState({
          userData: [...(this.state.userData || []), {...usersSnapshot.val().userInfo, userId}],
        }))
    })
  }

  componentWillUnmount() {
    circlesRef.child(`${this.props.circleId}/users`).off()
  }

  kickMember = (uid) => {
    const {circleId} = this.props
    usersRef.child(`${uid}/circles/${circleId}/userKeyInCircle`).once('value', (userKeyInCircleSnapshot) => {
      console.log(`${circleId}/users/${userKeyInCircleSnapshot.val()}`)
      circlesRef.child(`${circleId}/users/${userKeyInCircleSnapshot.val()}`).remove(
        () => usersRef.child(`${uid}/circles/${circleId}`).remove()
      )
    })
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
        visible={this.state.confirmDelete}
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
    const {name} = this.state
    return (
      <View>
        <Text onPress={this.editCircleName}>{name}</Text>
        <Text>Circle members</Text>
        {this.renderMembers()}
      </View>
    )
  }

  renderMembers = () => {
    const {userData = [], currentUser, owner} = this.state
    return _.map(
      ({name, userId}) => console.log(currentUser, userId) || (
        <View key={userId}>
          <Text>{name}</Text>
          {owner &&
            currentUser !== userId && <Text onPress={() => this.setState({confirmDelete: {userId, name}})}>kick</Text>}
          {this.renderConfirm()}
        </View>
      ),
      userData,
    )
  }

  render() {
    return (
      <View onLayout={this.getLayout} style={styles.container}>
        {this.state.name ? this.renderCircleData() : this.renderStub()}
        <Button title="NOT BUSY" onPress={() => null} />
      </View>
    )
  }
}
