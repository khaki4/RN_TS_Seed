import React from 'react';
import { TextInput, View, Text } from 'react-native';

const Input = ({
    customStyle,
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    placeholderTextColor,
    propStyle,
    textSize,
    onPress,
    onFocus,
    onBlur,
    onSubmitEditing,
    keyboardType = 'default',
    editable = true,
}) => {
    const { inputStyle, labelStyle, containerStyle } = styles;
    return (
        <View style={[containerStyle, customStyle]}>
            <TextInput
                secureTextEntry={secureTextEntry}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
                autoCapitalize="none"
                autoCorrect={false}
                style={[inputStyle, propStyle]}
                value={value}
                onChangeText={onChangeText}
                underlineColorAndroid="transparent"
                onPress={onPress}
                onFocus={onFocus}
                onBlur={onBlur}
                keyboardType={keyboardType}
                onSubmitEditing={onSubmitEditing}
                editable={editable}
            />
        </View>
    );
};

const styles = {
    inputStyle: {
        color: '#171e26',
        paddingRight: 5,
        paddingLeft: 5,
        fontFamily: 'Apple SD Gothic Neo', fontSize: 15,
        lineHeight: 23,
        flex: 2,
    },
    containerStyle: {
        height: 40,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
};

export { Input };
