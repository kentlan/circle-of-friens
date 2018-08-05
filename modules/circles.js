import React from 'react'
import {StyleSheet, Text, View, Button} from 'react-native'
import Draggable from 'react-native-draggable'
import {Actions} from 'react-native-router-flux'
import _ from 'lodash/fp'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default class App extends React.Component {
  state = {
    circles: [
      {
        title: 'test circle',
        color: 'black',
        members: [
          '322',
          '228',
        ],
      },
    ],
  }

  getLayout = ({nativeEvent: {layout}}) => this.setState({layout})

  addCircle = newCircle => this.setState({circles: [...this.state.circles, newCircle]})

  renderCircles = () => _.map(
    ({title, color}) => (
      <Draggable
        pressDragRelease={(event, props) => console.log({...props})}
        reverse={false}
        renderSize={56}
        renderColor={color}
        x={0}
        y={0}
        renderText={title}
        // change to id in the future
        key={title}
      />
    ),
    this.state.circles,
  )

  renderStub = () => (
    <View>
      <Text>
        You have no circles yet.
      </Text>
      <Button
        title="Add circle"
        onPress={() => Actions.push('newCircle')}
      />
    </View>
  )

  render() {
    const {circles} = this.state
    return (
      <View onLayout={this.getLayout} style={styles.container}>
        <Text>Circle list incoming</Text>
        {circles ? this.renderCircles() : this.renderStub()}
      </View>
    )
  }
}
