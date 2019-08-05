import React from 'react'
import {Text, View, Button, TextInput} from 'react-native'
import SectionedMultiSelect from 'react-native-sectioned-multi-select'
import {Actions} from 'react-native-router-flux'
import {auth, circlesRef, usersRef, facebookIdUserMapRef} from '../../config/firebase'
import styles from './styles'
import colors from '../ui/palette/colors'
import Palette from '../ui/palette'

export default class NewCircle extends React.Component {
  state = {
    addedFriends: [],
    color: colors[0],
    name: '',
  }

  componentDidMount() {
    this.getUserFriends()
  }

  /* eslint-disable no-console */
  getUserFriends = () => {
    usersRef.child(auth.currentUser.uid).once('value', async (usersSnapshot) => {
      const {accessToken} = usersSnapshot.val()
      await fetch(`https://graph.facebook.com/me?access_token=${accessToken}&fields=friends`)
        .then(async (response) => {
          const responseJSON = JSON.stringify(await response.json())
          const {friends} = JSON.parse(responseJSON)

          facebookIdUserMapRef.once('value', (facebookIdUserMapSnapshot) => {
            this.setState({
              userFriends: friends.data,
              facebookIdUserMap: facebookIdUserMapSnapshot.val(),
            })
          })
        })
        .catch(console.error)
    })
  }

  selectMates = addedFriends => this.setState({addedFriends})

  selectColor = color => this.setState({color})

  colorList = colors.map(color => ({
    color,
  }))

  createCircle = () => {
    const {
      name, addedFriends, color, facebookIdUserMap,
    } = this.state
    if (name.length === 0 || addedFriends.length === 0) return
    const {uid} = auth.currentUser
    const circleKey = circlesRef.push({ownerId: uid, name, color}).key
    circlesRef.child(`${circleKey}/users`).update({[uid]: {ready: false}})
    usersRef.child(`${uid}/circles`).update({[circleKey]: {role: 'owner'}})
    addedFriends.forEach((user) => {
      circlesRef.child(`${circleKey}/users`).update({[facebookIdUserMap[user]]: {ready: false}})
      usersRef.child(`${facebookIdUserMap[user]}/circles`).update({[circleKey]: {role: 'guest'}})
    })
    Actions.replace('circles')
  }

  renderItem = ({item}) => <Text>{item.key}</Text>

  renderNameInput = () => (
    <TextInput
      style={styles.nameInput}
      placeholder="e.g. DnD crew"
      onChangeText={name => this.setState({name})}
      value={this.state.name}
      maxLength={40}
    />
  )

  render() {
    const {addedFriends, color, userFriends} = this.state
    console.log(color)
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text>Circle name</Text>
          {this.renderNameInput()}
        </View>
        <View style={styles.inputContainer}>
          <Palette onColorPick={this.selectColor} activeColor={color} />
        </View>
        <View style={styles.inputContainer}>
          {userFriends ? (
            <SectionedMultiSelect
              items={userFriends}
              styles={{selectedItemText: {color: 'red'}}}
              uniqueKey="id"
              subKey="children"
              selectText="Add some mates"
              showDropDowns
              showCancelButton
              onSelectedItemsChange={this.selectMates}
              selectedItems={addedFriends}
              selectToggleIconComponent={<Text>L</Text>}
              searchIconComponent={<Text>-o</Text>}
              selectedIconComponent={<Text>yo</Text>}
              dropDownToggleIconUpComponent={<Text>/\</Text>}
              dropDownToggleIconDownComponent={<Text>\/</Text>}
              cancelIconComponent={<Text>(/)</Text>}
              chipRemoveIconComponent={<Text>x</Text>}
            />
          ) : (
            <Text>loading ur friends</Text>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <Button title="DONE" onPress={this.createCircle} />
        </View>
      </View>
    )
  }
}
