import React from 'react';
import { BackHandler} from "react-native";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StackNavigator, NavigationActions } from 'react-navigation';
import Left from '../components/Left';

import Splash from '../screens/Splash';
import Login from '../screens/Login';
import Details from '../screens/Details';
import { addListener } from '../util/redux';

export const AppNavigator = StackNavigator(
  {
    Splash: {
      screen: Splash,
    },
    Login: { screen: Login },
    Details: { screen: Details },
  },
  {
    /* The header config from HomeScreen is now here */
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerLeft: (<Left onPress={(props) => console.log(props)} />),
    },
  }

);

class AppWithNavigationState extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired,
  };
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }
  onBackPress = () => {
    const { dispatch, nav } = this.props;
    if (nav.index === 0) {
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  };

  render() {
    const { dispatch, nav } = this.props;
    return (
      <AppNavigator
        navigation={{
          dispatch,
          state: nav,
          addListener,
        }}
      />
    );
  }
}

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);

