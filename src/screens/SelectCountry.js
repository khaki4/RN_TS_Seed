import React, { Component, PureComponent } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper';
import { NavigationActions } from 'react-navigation';
import Picker from 'react-native-picker';
import { connect } from 'react-redux';
import R from 'ramda';
import _debounce from 'lodash/debounce';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  TextInputWithButton,
} from '../components/common';
import { strings } from '../service/strings';
import countryService from '../service/CountryService';

const mapDispatchToProps = dispatch => ({
  goBack: () => {
    dispatch(NavigationActions.back())
  },
});

const ListItem = connect(null, mapDispatchToProps)((props) => {
  const { item } = props;
  const { country_name, country_phone_code } = item;
  const onPressListItem = () => {
    console.log('pop with:', item);
    countryService.setCurrentCountryCode(item.country_code);
    console.log(props);
    props.goBack();
  };
  return (
    <TouchableOpacity
      onPress={onPressListItem}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#d9e0e8',
          alignItems: 'center',
          height: 60,
        }}
      >
        <Text style={{ fontSize: 16, color: '#486079', flex: 1 }}>{country_name}</Text>
        <Text style={{ fontSize: 16, color: '#546f8c' }}>{`+${country_phone_code}`}</Text>
      </View>
    </TouchableOpacity>
  );
});



class ResultListView extends PureComponent {
  keyExtractor = (item, index) => index;
  renderItem = ({ item }) => {
    return <ListItem item={item} />;
  };
  render() {
    const { result } = this.props;
    if (result && result.length < 1) {
      return (
        <View style={{alignItems: 'center', marginTop: 20}}>
          <Text style={{ fontSize: 16, color: '#53657a'}}>{strings.noResults}</Text>
        </View>
      );
    }
    return (
      <View
        style={{
          backgroundColor: '#fefefe',
          borderTopWidth: 1,
          borderTopColor: '#d9e0e8',
        }}
      >
        <FlatList
          data={result}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

class InterfaceProps {
  constructor(globalInfo) {
    if (!Array.isArray(globalInfo)) throw Error('invalid type globalInfo');
    this.globalInfo = globalInfo;
  }
}
class SelectCountry extends Component {
  static InterfaceProps = InterfaceProps;
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      resultList: this.props.nav.globalInfo,
      isSpinnerShow: false,
    };
  }
  componentWillMount() {
    // Actions.refresh({ title: strings.selectCountry });
  }

  componentDidMount() {}

  componentWillUnmount() {
    Picker.hide();
  }

  filterCountryInfo = () => {
    const { globalInfo } = this.props.nav.params;
    if (R.isNil(this.state.text.trim()) || this.state.text.trim() === '') {
      console.log('검색어가 없습니다.');
      this.setState(() => ({resultList: globalInfo}));
    } else {
      const searchKeyword = this.state.text.trim().toLowerCase();
      const isIncludeSearchKeyWord = (countryInfo) => {
        const { country_name, country_phone_code, country_code } = countryInfo;
        return country_name.toLowerCase().includes(searchKeyword)
          || country_phone_code.toLowerCase().includes(searchKeyword)
          || country_code.toLowerCase().includes(searchKeyword);
      };
      const filteredResultList = globalInfo.filter(isIncludeSearchKeyWord);
      this.setState(() => ({resultList: filteredResultList}));
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <View
          style={styles.searchBoxContainer}
        >
          <View style={{ backgroundColor: '#fff' }}>
            <TextInputWithButton
              placeholder={strings.countryNameGuide}
              placeholderTextColor="#5c7899"
              style={styles.inputBoxStyle}
              onChangeText={text => {
                this.setState({text}, _debounce(this.filterCountryInfo, 10));
              }}
              value={this.state.text}
              autoFocus
            />
          </View>
        </View>
        <KeyboardAwareScrollView enableResetScrollToCoords={false}>
          <ResultListView result={this.state.resultList} />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

export default connect(
  (state) => ({
    nav: state.nav.routes[state.nav.index]
  })
)(SelectCountry);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fb',
    ...ifIphoneX({
      paddingTop: 74,
    }, {
      paddingTop: Platform.OS === 'ios' ? 64 : 54, //nav bar height
    }),
  },
  inputBoxStyle: {
    height: 50,
    marginTop: 16,
    marginHorizontal: 16,
    paddingLeft: 5,
  },
  searchBoxContainer: {
    padding: 16,
    marginBottom: 0,
  },
});
