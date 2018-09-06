import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 17,
    color: '#000',
  },
  inactive: {
    fontSize: 17,
    color: '#9e9e9e',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginTop: 15,
  },
  members: {
    flex: 15,
  },
  backWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
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
  back: {
    fontSize: 17,
    textAlign: 'left',
  },
})

export default styles
