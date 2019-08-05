import React from 'react'
import {StyleSheet, Text, View, Button} from 'react-native'
import {Actions} from 'react-native-router-flux'
import _ from 'lodash'
import {auth, usersRef} from '../../config/firebase'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default class Start extends React.Component {
  state = {}

  componentDidMount() {
    this.checkForAuth()
    auth.onAuthStateChanged(this.checkForCircles)
    this.timer = setTimeout(() => this.setState({showLogout: true}), 10000)
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  checkForCircles = (user) => {
    const {replace} = Actions
    if (!user) {
      return replace('login')
    }
    usersRef.child(`${user.uid}/circles`).on('value', (userCirclesSnapshot) => {
      const userCircles = userCirclesSnapshot.val()
      return !_.isEmpty(userCircles) ? replace('circles', {circles: userCircles}) : replace('login')
    })
  }

  checkForAuth = () => auth && auth.currentUser === null && this.setState({retieving: true})

  render() {
    const {retieving, showLogout} = this.state
    return (
      <View style={styles.container}>
        <Text style={{fontSize: 30, marginBottom: 20}}>CIRCLE OF FRIENDS</Text>
        {retieving && <Text>retrieveing account data...</Text>}
        {showLogout && <Button title="force log out" onPress={() => auth.signOut()} />}
      </View>
    )
  }
}
