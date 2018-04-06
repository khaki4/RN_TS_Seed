import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet
} from 'react-native';

/**
 * @param disable: interaction이 없는 버튼
 * @param buttonText: 버튼 텍스트
 * @param bgColor: 기본 상태의 백그라운드 컬러
 * @param activeBgColor: onPress상태의 백그라운드 컬러
 * @param textColor: 기본 상태의 컬러
 * @param fontSize: 기본 폰트 사이즈
 * @param onPress: OnPress function
 * @param style: 추가로 입력되는 스타일
 * @returns {XML}
 * @constructor
 */

const FilledButton = ({
      disable = false,
      buttonText = '',
      bgColor = "#fff",
      activeBgColor = "#fff",
      textColor = "#738eab",
      fontSize = 16,
      onPress,
      style,
      children,
  }) => {
    const {
        buttonContainer,
        filledButton,
        buttonTextStyle,
    } = styles;

    return (
        <View style={buttonContainer}>
            <TouchableHighlight
                underlayColor={disable ? bgColor : activeBgColor}
                style={[filledButton, style, {backgroundColor: bgColor}]}
                onPress={onPress}
                activeOpacity={disable ? 1 : 0.5}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text
                    style={[buttonTextStyle, {fontFamily: 'Apple SD Gothic Neo', fontSize: fontSize, color: textColor}]}
                >
                    {buttonText}
                </Text>
                {children}
              </View>
            </TouchableHighlight>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    buttonTextStyle: {
        flex: 1,
        textAlign: 'center',
    },
    filledButton: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 0,
        borderRadius: 3,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
});


export {FilledButton};
