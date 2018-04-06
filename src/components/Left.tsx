import React from "react";
import { TouchableHighlight, Text } from "react-native";
import { withNavigation } from "react-navigation";

export default ({ onPress }) => (
  <TouchableHighlight onPress={() => console.log("onPress", onPress)}>
    <Text>BACK BTN</Text>
  </TouchableHighlight>
);
