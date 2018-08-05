import React from 'react'
import {Text, View, Button} from 'react-native'
import styles from './styles'
import SectionedMultiSelect from 'react-native-sectioned-multi-select'
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
    color: colors[0],
  }

  onSelectedItemsChange = addedFriends => this.setState({addedFriends})

  createCircle = () => {}

  renderItem = ({item}) => <Text>{item.key}</Text>

  render() {
    const {addedFriends} = this.state
    return (
      <View style={styles.container}>
        <View style={styles.selectContainer}>
          <View style={styles.selectMates}>
            <SectionedMultiSelect
              items={FRIEND_LIST}
              styles={{selectedItemText: {color: 'red'}}}
              uniqueKey="id"
              subKey="chil`dren"
              selectText="Add some mates"
              showDropDowns
              showCancelButton
              onSelectedItemsChange={this.onSelectedItemsChange}
              selectedItems={addedFriends}
            />
          </View>
          <View style={styles.selectColor}>
            <SectionedMultiSelect
              items={FRIEND_LIST}
              styles={{selectedItemText: {color: 'red'}}}
              uniqueKey="id"
              subKey="children"
              selectText="Add some mates"
              showDropDowns
              showCancelButton
              onSelectedItemsChange={this.onSelectedItemsChange}
              selectedItems={addedFriends}
            />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button title="DONE" onPress={this.createCircle} />
        </View>
      </View>
    )
  }
}
