import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'space-around',
  },
  settingsItem: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  inputContainer: {
    flex: 1,
    minWidth: '95%',
  },
  buttonContainer: {
    flex: 1,
  },
  paletteTitle: {
    flex: 0,
    fontSize: 18,
  },
  palette: {
    flex: 0.6,
  },
  ownerSettings: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'space-around',
    padding: 20,
  },
  dangerZone: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerButton: {
    color: 'red',
    fontSize: 20,
    margin: 20,
  },
  nameInput: {
    height: 40,
    borderWidth: 1,
    padding: 5,
    borderColor: '#2c1d25',
  },
})

export default styles
