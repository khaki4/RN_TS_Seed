import React from 'react';
import { View, Text, Button } from 'react-native';
import { connect } from "react-redux";
import * as fromCounter from "../reducers/counter";
import Left from '../components/Left';

class DetailScreen extends React.Component<any> {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Detail Screen</Text>
        <Button
          title="Go to Home"
          onPress={this.props.goHome}
        />
      </View>
    );
  }
}

const goHome = fromCounter.goHome;
export default connect(null, { goHome })(DetailScreen);
