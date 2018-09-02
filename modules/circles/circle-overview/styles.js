import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'orange',
  },
  circleDataWrapper: {
    flex: 4,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  user: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  active: {
    color: '#000',
  },
  inactive: {
    color: '#9e9e9e',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'yellow',
  },
  members: {
    flex: 3,
    backgroundColor: 'green',
  },
  textWrapper: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 17,
    textAlign: 'center',
  },
})

export default styles
