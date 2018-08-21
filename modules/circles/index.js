import React from 'react'
import {Text, View, Button} from 'react-native'
import {Actions} from 'react-native-router-flux'
import _ from 'lodash'
import styles from './styles'
import {auth, usersRef, circlesRef} from '../../config/firebase'
import Circle from './circle'

export default class Circles extends React.Component {
  state = {}

  componentDidMount() {
    usersRef.child(`${auth.currentUser.uid}/circles`).on('value', (userCirclesSnapshot) => {
      const userCircles = userCirclesSnapshot.val()

      if (!userCircles) {
        return this.setState({circlesToRender: []})
      }
      circlesRef.once('value', (circlesSnapshot) => {
        const circlesToRender = Object.keys(userCircles).map(circleId => ({
          x: userCircles[circleId].x || 0,
          y: userCircles[circleId].y || 0,
          ...circlesSnapshot.val()[circleId],
          circleId,
        }))
        this.setState({circlesToRender})
      })
    })
  }

  componentWillUnmount() {
    usersRef.off('value')
  }

  // getLayout = ({nativeEvent: {layout}}) => this.setState({layout})

  addCircle = newCircle => this.setState({circles: [...this.state.circles, newCircle]})

  updatePosition = (x, y, circleId) => {
    usersRef.child(`${auth.currentUser.uid}/circles/${circleId}`).update({x, y})
  }

  renderCircles = () => {
    const {circlesToRender} = this.state
    return (
      circlesToRender &&
      circlesToRender.map(({
        name, color, circleId, x, y,
      }, index) => (
        <Circle color={color} x={x} y={y} index={index} name={name} circleId={circleId} key={circleId} />
      ))
    )
  }

  renderStub = () => (
    <View>
      <Text>You have no circles yet.</Text>
      <Button title="Add circle" onPress={() => Actions.push('newCircle')} />
    </View>
  )

  render() {
    const {circlesToRender} = this.state
    return (
      <View onLayout={this.getLayout} style={styles.container}>
        <Text>Circle list incoming</Text>
        {_.isEmpty(circlesToRender) ? this.renderStub() : this.renderCircles()}
      </View>
    )
  }
}
