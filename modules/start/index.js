import React from 'react'
import {StyleSheet, Text, View, Button} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {auth} from '../../config/firebase'

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
    const {replace} = Actions
    this.checkForAuth()
    auth.onAuthStateChanged(user => (user ? replace('circles') : replace('login')))
    this.timer = setTimeout(() => this.setState({showLogout: true}), 10000)
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  checkForAuth = () => auth && auth.currentUser === null && this.setState({retieving: true})

  render() {
    const {retieving, showLogout} = this.state
    return (
      <View style={styles.container}>
        <Text>CIRCLE OF FRIENDS</Text>
        {retieving && <Text>retrieveing account data...</Text>}
        {showLogout && <Button title="force log out" onPress={auth.signOut} />}
      </View>
    )
  }
}
