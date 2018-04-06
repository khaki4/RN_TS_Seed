import React from 'react';
import { View } from 'react-native';

const UnderLinedInputSection = props => {
  return (
    <View style={[styles.containerStyle, props.style]}>
      {props.children}
    </View>
  );
};

const styles = {
  containerStyle: {
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    flexDirection: 'row',
    borderColor: 'rgb(217, 224, 232)',
    position: 'relative',
  },
};

export { UnderLinedInputSection };
