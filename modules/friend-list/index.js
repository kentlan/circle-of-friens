import React from 'react'
import {Text, View, FlatList} from 'react-native'

const FRIEND_LIST = [
  {
    name: 'Glinomes',
    sex: 'm',
  },
  {
    name: 'Huesos',
    sex: 'm',
  },
  {
    name: 'Gnida',
    sex: 'm',
  },
]

const ME = {
  name: 'Mrazota',
  sex: 'm',
}

export default class FriendList extends React.Component {
  toggleSelectPerson = (wtf) => {
    console.log(wtf)
    // this.setState({selectedFriends})
  }
  renderListItem = ({item: {name}, ...data}) => console.log(data) || <Text onPress={this.toggleSelectPerson}>{name}</Text>
  render() {
    return (
      <View>
        <Text>Add some friends</Text>
        <FlatList
          data={FRIEND_LIST}
          ListEmptyComponent={<Text>you have no friends lol</Text>}
          renderItem={this.renderListItem}
        />
      </View>
    )
  }
}
