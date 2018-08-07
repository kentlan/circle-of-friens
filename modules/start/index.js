import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
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
  componentDidMount() {
    const {replace} = Actions
    auth.onAuthStateChanged(user => (user ? replace('circles') : replace('login')))
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>CIRCLE OF FRIENDS</Text>
      </View>
    )
  }
}

