import React from 'react'
import {Text, View} from 'react-native'

const container = {
  justifyContent: 'center',
  alignItems: 'center',
}

export default class CircleSettings extends React.Component {
  state = {}

  render() {
    return (
      <View style={container}>
        <Text>Settigs</Text>
      </View>
    )
  }
}
