import * as firebase from 'firebase'
import {Notifications} from 'expo'
import * as Facebook from 'expo-facebook'
import * as Permissions from 'expo-permissions'
import * as c from './constants'

/* eslint-disable no-console */

const config = {
  apiKey: c.FIREBASE_API_KEY,
  authDomain: c.FIREBASE_AUTH_DOMAIN,
  databaseURL: c.FIREBASE_DATABASE_URL,
  projectId: c.FIREBASE_PROJECT_ID,
  storageBucket: c.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: c.FIREBASE_MESSAGING_SENDER_ID,
}

firebase.initializeApp(config)

export const database = firebase.database()
export const auth = firebase.auth()
export const provider = new firebase.auth.FacebookAuthProvider()
provider.addScope('user_friends').addScope('email')
export const storage = firebase.storage()
export const usersRef = database.ref('/users/')
export const circlesRef = database.ref('/circles/')
export const facebookIdUserMapRef = database.ref('/facebookIdUserMap/')

export const facebookLogin = async () => {
  const {type, token} = await Facebook.logInWithReadPermissionsAsync(c.FACEBOOK_APP_ID, {
    permissions: ['public_profile', 'email', 'user_friends'],
  })
  if (type === 'success') {
    const credential = firebase.auth.FacebookAuthProvider.credential(token)
    firebase
      .auth()
      .signInAndRetrieveDataWithCredential(credential)
      .then(({user: {uid}, additionalUserInfo: {profile, isNewUser}}) => {
        usersRef.child(uid).update({accessToken: token, userInfo: profile})
        return isNewUser && facebookIdUserMapRef.child(profile.id).set(uid)
      })
      .catch(console.error)
    // usersRef.update
    // .then(hui => console.log('hui', hui))
  }
  return null
}

export const registerForPushNotifications = async () => {
  const {status} = await Permissions.getAsync(Permissions.NOTIFICATIONS)
  let finalStatus = status
  if (status !== 'granted') {
    const askResponse = await Permissions.askAsync(Permissions.NOTIFICATIONS)
    console.log(askResponse.status, status, 'wtf')
    finalStatus = askResponse.status
  }
  console.log(status, 'lool')
  if (finalStatus !== 'granted') {
    return
  }
  const expoPushToken = await Notifications.getExpoPushTokenAsync()

  // add token to firebase
  const {uid} = auth.currentUser
  usersRef.child(uid).update({expoPushToken})
}

export const signIn = () => auth.signInAnonymously().catch(error => console.error(error))
