import React from 'react'
import {Text, View, Button} from 'react-native'
import _ from 'lodash/fp'
import styles from './styles'

const NOT_BUSY = true

export default class CircleOverview extends React.Component {
  state = {
    circles: [
      {
        title: 'test circle',
        color: 'black',
        members: ['322', '228'],
      },
    ],
  }

  mapMates = () => _.map(
    this.renderMate,
    this.state.circles,
  )

  renderMate = ({name}) => (
    <View>
      <Text style={NOT_BUSY ? styles.acive : styles.inactive}>{name}</Text>
    </View>
  )

  render() {
    return (
      <View onLayout={this.getLayout} style={styles.container}>
        {this.mapMates}
        <Button title="NOT BUSY" onPress={() => null} />
      </View>
    )
  }
}
