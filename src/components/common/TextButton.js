import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';
import Button from 'apsl-react-native-button';   //https://github.com/APSL/react-native-button

class TextButton extends Component {
  state = {
    activeButton: false,
  };

  onPressIn = () => {
    console.log('TextButton on pressed in...');
    this.setState({ activeButton: true });
  }

  onPressOut = () => {
    console.log('TextButton on pressed out...');
    this.setState({ activeButton: false });
  }

  colorTextWhenPressedIn = () => {
    if (this.state.activeButton) {
      return styles.activeButtonText;
    }

    return styles.buttonText;
  }

  render() {
    const {
      buttonContainer,
      buttonText,
    } = styles;
    const { textStyle } = this.props
    return (
      <View style={buttonContainer}>
        <Button
          title="borderButton"
          style={styles.textButton}
          activeOpacity={0.5}
          onPress={this.props.onPress}
          onPressIn={this.onPressIn}
          onPressOut={this.onPressOut}
        >
          <Text style={[this.colorTextWhenPressedIn(), textStyle]}>{this.props.buttonText}</Text>
        </Button>
      </View>
    );
  }
}

TextButton.defaultProps = {
  buttonText: "buttonText",
  onPress: null
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 3,
  },
  buttonText: {
    color: 'rgb(115, 142, 171)',
    fontFamily: 'Apple SD Gothic Neo',
    fontSize: 15,
  },
  activeButtonText: {
    color: "#B4C3D2",
    fontFamily: 'Apple SD Gothic Neo',
    fontSize: 15,
  },
  textButton: {
    borderColor: "transparent",
    padding: 10,
    height: 30,
    backgroundColor: "transparent",
    borderWidth: 0,
    borderRadius: 3,
  }
});

export { TextButton };
