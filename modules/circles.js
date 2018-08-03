import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import Draggable from 'react-native-draggable'
import _ from 'lodash/fp'

export default class App extends React.Component {
  state ={}

  getLayout = ({nativeEvent: {layout}}) => this.setState({layout})

  // checkPosition = () => {
    
  // }

  render() {
    return (
      <View onLayout={(hui) => console.log('lolz', hui.nativeEvent.layout)} style={styles.container}>
        <Text>Circle list incoming</Text>
        <Draggable
          pressDragRelease={(event, props) => console.log({...props})}
          reverse={false}
          renderSize={56}
          renderColor="black"
          x={0}
          y={0}
          renderText="A"
        />
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
