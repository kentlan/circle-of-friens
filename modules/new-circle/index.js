import React from 'react'
import {Text, View, Button, TextInput} from 'react-native'
import SectionedMultiSelect from 'react-native-sectioned-multi-select'
import {Actions} from 'react-native-router-flux'
import {auth, circlesRef, usersRef} from '../../config/firebase'
import styles from './styles'
import colors from '../../utils/colors'

const FRIEND_LIST = [
  {
    name: 'Glinomes',
    id: 'czds',
  },
  {
    name: 'Huesos',
    id: 'sdcsdfvsdv',
  },
  {
    name: 'Gnida',
    id: 'vefvef',
  },
]

// const ME = {
//   name: 'Mrazota',
//   id: 'efvrf',
// }

export default class NewCircle extends React.Component {
  state = {
    addedFriends: [],
    color: [colors[0]],
    name: '',
  }

  selectMates = addedFriends => this.setState({addedFriends})

  selectColor = color => this.setState({color})

  colorList = colors.map(color => ({
    color,
  }))

  createCircle = () => {
    const {name, addedFriends, color} = this.state
    const {uid} = auth.currentUser
    const circleKey = circlesRef.push({ownerId: uid, name, color: color[0]}).key
    const ownerKeyInCircle = circlesRef.child(`${circleKey}/users`).push(uid).key
    usersRef.child(`${uid}/circles`).update({[circleKey]: ownerKeyInCircle})
    addedFriends.map((user) => {
      const userKeyInCircle = circlesRef.child(`${circleKey}/users`).push(user).key
      return usersRef.child(`${uid}/circles`).update({[circleKey]: {userKeyInCircle}})
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
    />
  )

  render() {
    const {addedFriends, color} = this.state
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text>Circle name</Text>
          {this.renderNameInput()}
        </View>
        <View style={styles.inputContainer}>
          <SectionedMultiSelect
            items={this.colorList}
            styles={{selectedItemText: {color: 'red'}}}
            uniqueKey="color"
            displayKey="color"
            single
            subKey="children"
            selectText="Choose circle color"
            showDropDowns
            showCancelButton
            onSelectedItemsChange={this.selectColor}
            selectedItems={color}
          />
        </View>
        <View style={styles.inputContainer}>
          <SectionedMultiSelect
            items={FRIEND_LIST}
            styles={{selectedItemText: {color: 'red'}}}
            uniqueKey="id"
            subKey="children"
            selectText="Add some mates"
            showDropDowns
            showCancelButton
            onSelectedItemsChange={this.selectMates}
            selectedItems={addedFriends}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="DONE" onPress={this.createCircle} />
        </View>
      </View>
    )
  }
}
