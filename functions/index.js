const functions = require("firebase-functions");
var fetch = require("node-fetch");

const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);

exports.sendPushNotification = functions.database
  .ref("circles/{id}")
  .onUpdate(event => {
    let messages = []
    const circleBeforeChange = event.before.val()
    const circleAfterChange = event.after.val()

    const mapUserStatus = (userData = {}) => {
        const userIds = Object.keys(userData)
        const readyUsers = userIds.filter(uid => userData[uid].ready)
        return readyUsers
    }

    // const readyUsersBefore = mapUserStatus(circleBeforeChange.users)
    const readyUsersAfter = mapUserStatus(circleAfterChange.users)
    return readyUsersAfter.length > 1 && admin.database().ref('users').once(
      'value', snapshot => console.log('BABYMETA;', snapshot.val())
    )
    .then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        if (!readyUsersAfter.includes(childSnapshot.key)) {
          return
        }
        const {expoPushToken} = childSnapshot.val()

        const restReadyUsers = readyUsersAfter.filter(userId => userId !== childSnapshot.key)
        const mapReadyUsers = restReadyUsers.map(userId => snapshot.val()[userId].userInfo.first_name)
        const compressedUsers = mapReadyUsers.slice(0, 3)
        const otherUsersLength = mapReadyUsers.slice(3)
        const readyUsersString = compressedUsers.join(' ,')

        if (expoPushToken) {

          messages.push({
            to: expoPushToken,
            body: `${readyUsersString} ${otherUsersLength > 1 ? `and ${otherUsersLength} others` : ''} ${mapReadyUsers.length > 1 ? 'are' : 'is'} ready in ${circleAfterChange.name}`
          });
        }
      });

      return Promise.all(messages);
    })
    .then((messages) => {
      return fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(messages)
      });
    });
  });
