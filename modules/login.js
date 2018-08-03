import React from 'react'
import {StyleSheet, Text, View, Button} from 'react-native'
import {Actions} from 'react-native-router-flux'

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>So here is login screen</Text>
        <Button title="log in" onPress={() => Actions.replace('circles')} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
