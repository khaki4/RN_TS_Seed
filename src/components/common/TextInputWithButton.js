/**
 * Created by albam on 2017. 6. 5..
 */

import React, {Component} from 'react';
import {View, TextInput, TouchableHighlight, Image} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet'; //https://www.npmjs.com/package/react-native-extended-stylesheet

class TextInputWithButton extends Component {
  constructor(props) {
    super(props);
    this.state = {style: styles.textinput};
  }

  onFocus() {
    this.setState({style: styles.focused});
  }

  onBlur() {
    this.setState({style: styles.unfocused});
  }

  renderIcon = () => {
    return this.props.searchIconFile
      ? <Image
        style={styles.placeImage}
        source={require('../../../assets/ic_place.png')}
      />
      : <Image
        style={styles.searchImage}
        source={require('../../../assets/icon_search.png')}
      />;
  }

  render() {
    return (
      <View style={styles.box} flexDirection="row">
        <TouchableHighlight
          onPress={this.props.onPress}
          style={styles.imageButton}
        >
          {this.renderIcon()}
        </TouchableHighlight>

        <TextInput
          onBlur={this.props.onBlur}
          onFocus={this.props.onFocus}
          secureTextEntry={this.props.secureTextEntry}
          selectTextOnFocus={this.props.selectTextOnFocus}
          maxLength={this.props.maxLength}
          keyboardType={this.props.keyboardType}
          autoFocus={this.props.autoFocus}
          value={this.props.value}
          underlineColorAndroid="transparent"
          onChangeText={this.props.onChangeText}
          placeholder={this.props.placeholder}
          style={[styles.textinput, this.state.style]}
          multiline={false}
          onSubmitEditing={this.props.onSubmitEditing}
        />
      </View>
    );
  }
}

TextInput.defaultProps = {
  placeholder: 'placeholder',
  selectTextOnFocus: true,
  secureTextEntry: false,
  maxLength: null,
  onBlur: null,
  onFocus: null,
  keyboardType: 'default',
  autoFocus: false,
  onChangeText: null,
  onSubmitEditing: null,
  value: null,
};

TouchableHighlight.defaultProps = {
  onPress: null,
};

const styles = EStyleSheet.create({
  textinput: {
    flex: 1,
    fontFamily: 'Apple SD Gothic Neo',
    fontSize: '$normalText',
    backgroundColor: null,
    textAlignVertical: 'center',
  },
  box: {
    height: 50,
    backgroundColor: null,
    borderWidth: 1,
    borderColor: '#bfc3c9',
    borderRadius: 3,
  },
  searchImage: {
    width: 16,
    height: 16,
  },
  placeImage: {
    width: 14,
    height: 20,
  },
  unfocused: {
    borderColor: '#bfc3c9',
  },
  focused: {
    borderColor: '#03a9f4',
  },
  imageButton: {
    borderColor: 'transparent',
    width: 50,
    height: 50,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export {TextInputWithButton};
