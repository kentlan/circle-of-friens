import React from 'react'
import {Scene, Router, Stack, Actions} from 'react-native-router-flux'
import Start from './modules/start'
import Login from './modules/login'
import Circles from './modules/circles'
import NewCircle from './modules/new-circle'

export default class App extends React.Component {
  state = {}
  render() {
    return (
      <Router>
        <Stack key="root">
          <Scene
            key="start"
            component={Start}
            title="Start"
          />
          <Scene
            key="login"
            component={Login}
            title="Login"
          />
          <Scene
            key="circles"
            component={Circles}
            title="Circles"
            onRight={() => Actions.push('newCircle')}
            rightTitle="+"
            // rightButtonImage={require('path/to/your/icon')}
          />
          <Scene
            key="newCircle"
            component={NewCircle}
            title="New Circle"
            // rightButtonImage={require('path/to/your/icon')}
          />
        </Stack>
      </Router>
    )
  }
}
