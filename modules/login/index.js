import React from 'react'
import {StyleSheet, Text, View, Button} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {auth, facebookLogin} from '../../config/firebase'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default class Login extends React.Component {
  componentDidMount() {
    auth.onAuthStateChanged(user => user && Actions.replace('circles'))
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>So here is login screen</Text>
        <Button title="log in" onPress={() => Actions.replace('circles')} />
        <Button title="Fazebook login" onPress={facebookLogin} />
      </View>
    )
  }
}

