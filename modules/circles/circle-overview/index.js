import React from 'react'
import {Text, View, Button} from 'react-native'
import _ from 'lodash/fp'
import styles from './styles'
import {circlesRef, auth} from '../../../config/firebase'

const NOT_BUSY = true

export default class CircleOverview extends React.Component {
  state = {}

  componentWillMount() {
    circlesRef.child(this.props.circleId).on('value', (circleSnapshot) => {
      const {color, name, ownerId, users} = circleSnapshot.val()
      const currentUser = auth.currentUser.uid
      const owner = ownerId === currentUser
      this.setState({
        color,
        name,
        owner,
        users,
        currentUser,
      })
    })
  }

  editCircleName = () => (this.state.owner ? null : null)

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

  renderStub = () => <Text>loading circle data...</Text>

  renderMate = ({name}) => (
    <View>
      <Text style={NOT_BUSY ? styles.acive : styles.inactive}>{name}</Text>
    </View>
  )

  renderMembers = () => {
    _.map((userId) => {
      console.log(auth.currentUser)
      return (
        <View key={userId}>
          <Text>auth.currentUser.uid</Text>
        </View>
      )
    }, this.state.users)
  }

  render() {
    console.log(this.props, this.state)
    return (
      <View onLayout={this.getLayout} style={styles.container}>
        {this.state.name ? this.renderCircleData() : this.renderStub()}
        <Button title="NOT BUSY" onPress={() => null} />
      </View>
    )
  }
}
