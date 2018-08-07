import * as firebase from 'firebase'
import Expo from 'expo'
import * as c from './constants'

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
export const queueRef = database.ref('/queue/')
export const gamesRef = database.ref('/games/')
export const userListRef = database.ref('/userList/')

export const facebookLogin = async () => {
  const {type, token} = await Expo.Facebook.logInWithReadPermissionsAsync(
    c.FACEBOOK_APP_ID,
    {permissions: ['public_profile', 'email', 'user_friends']},
  )
  if (type === 'success') {
    const credential = firebase.auth.FacebookAuthProvider.credential(token)
    firebase.auth().signInAndRetrieveDataWithCredential(credential)
    console.log(credential)
    return token
    // .then(hui => console.log('hui', hui))
  }
  return null
}

/* eslint-disable no-console */
export const signIn = () =>
  auth.signInAnonymously().catch(error => console.error(error))
