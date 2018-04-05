import React from 'react';
import { View, Text, Button } from 'react-native';
import { connect } from 'react-redux';
import * as fromCounter from '../reducers/counter';

class HomeScreen extends React.Component<any> {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen Test31331</Text>
        <Button
          title="Go to Details"
          onPress={this.props.goDetail}
        />
      </View>
  );
  }
}

const goDetail = fromCounter.goDetail;
export default connect(null, { goDetail })(HomeScreen);
