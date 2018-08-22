import React from 'react'
import {View, TouchableOpacity} from 'react-native'
import PropTypes from 'prop-types'
import colors from './colors'

const container = {
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
  flexDirection: 'row',
}

const Palette = ({onColorPick, activeColor}) => (
  <View style={container}>
    {colors.map(color => (
      <TouchableOpacity
        key={color}
        style={{
          backgroundColor: color,
          borderColor: activeColor === color ? '#000' : 'transparent',
          borderWidth: 2,
        //   width: 50,
        flex: 1,
          height: 50,
          zIndex: 2,
        }}
        onPress={() => onColorPick(color)}
      />
    ))}
  </View>
)

Palette.propTypes = {
  onColorPick: PropTypes.func.isRequired,
  activeColor: PropTypes.string,
}

Palette.defaultProps = {
  activeColor: colors[0],
}

export default Palette
