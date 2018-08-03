import React from 'react'
import {StyleSheet, Text, View, FlatList, Button} from 'react-native'
import EmptyList from './empty-list'
import FriendList from './friend-list'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const AddItem = ({handlePress, title}) => <Button onPress={handlePress} title={title} />

export default class NewCircle extends React.Component {
  state = {
    addedFriends: [],
  }

  openFriendsList = () => this.setState({openedFriendList: true})

  renderItem = ({item}) => <Text>{item.key}</Text>

  render() {
    const {openedFriendList, addedFriends} = this.state
    return (
      <View style={styles.container}>
        <Text>Circle list incoming</Text>
        {openedFriendList && <FriendList />}
        <FlatList
          data={addedFriends}
          ListEmptyComponent={EmptyList}
          ListFooterComponent={<AddItem handlePress={this.openFriendsList} title="Add member" />}
          renderItem={this.renderItem}
        />
      </View>
    )
  }
}

