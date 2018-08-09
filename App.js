import React from 'react'
import {Scene, Router, Stack, Modal, Actions} from 'react-native-router-flux'
import {auth} from './config/firebase'
import Start from './modules/start'
import Login from './modules/login'
import Circles from './modules/circles'
import NewCircle from './modules/new-circle'
import CircleOverview from './modules/circles/circle-overview'

export default class App extends React.Component {
  state = {}
  render() {
    return (
      <Router>
        <Scene key="modal" modal hideNavBar >
          <Scene key="root">
            <Scene key="start" component={Start} title="Start" hideNavBar />
            <Scene key="login" component={Login} title="Login" hideNavBar />
            <Scene
              key="circles"
              component={Circles}
              title="Circles"
              onRight={() => Actions.push('newCircle')}
              onLeft={() => auth.signOut()}
              rightTitle="+"
              leftTitle="Log out"
              // rightButtonImage={require('path/to/your/icon')}
            />
            <Scene
              key="newCircle"
              component={NewCircle}
              title="New Circle"
              // rightButtonImage={require('path/to/your/icon')}
            />
          </Scene>
          <Modal
            key="circleOverview"
            component={CircleOverview}
            title="Circle Overview"
            hideNavBar
            // rightButtonImage={require('path/to/your/icon')}
          />
        </Scene>
      </Router>
    )
  }
}
