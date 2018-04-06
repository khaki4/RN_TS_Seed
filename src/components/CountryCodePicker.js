import React, { PureComponent } from 'react';
import {
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import SelectCountry from '../screens/SelectCountry';
import countryService from '../service/CountryService';

const setPickerInitValue = async () => {
  const selectedCountryCode = countryService.getCurrentCountryCode();
  const currentCountryCode = selectedCountryCode || DeviceInfo.getDeviceCountry();
  countryService.setCurrentCountryCode(currentCountryCode);
  const setInitialCountry = (_countryInfoByCode) => {
    return _countryInfoByCode[currentCountryCode];
  };
  const countryListByCountryCode = await countryService.getCountryListByCountryCode();
  return setInitialCountry(countryListByCountryCode);
};

/**
 * @prop:
 *  - info            : 픽커의 현재 선택된 내용을 보여준다.
 *  - countryInfo     : 국가선택 화면에서 리스트로 보여줄 데이터.
 *  - phoneNum        : 픽커에서 국가 전화번호 코드를 보여줄지 정하는 플레그.
 *  - hideCountryName : 픽커에서 국가이름을 보여줄지 정하는 플레그.
 *  - hideArrow       : 에로우 이미지를 보여줄지 정함
 */
export default class CountryCodePicker extends PureComponent {
  static setPickerInitValue = setPickerInitValue;

  constructor(props) {
    super(props);
    this.countryInfo = null;
    this.state = {
      countryInfo: null,
      info: {
        phoneCode: null,
        countryName: null,
        countryCode: null,
      },
    };
  }

  componentDidMount() {
    this.init()
      .then(() => console.log('CountryCodePicker init.'));
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.info) {
      const { name, code, country_code} = nextProps.info;
      if (name !== '' && code !== '' && country_code !== '') {
        this.setState({ countryInfo: { name, code, countryCode: country_code } });
      }
      console.log(nextProps);
    }
  }

  setCountryInfo = ({ country_phone_code, country_name, country_code }) => {
    this.setState(() => ({
      countryInfo: {
        name: country_name,
        code: country_phone_code,
        countryCode: country_code,
      },
    }));
  };
  loadCountryInfo = async () => {
    const result = await countryService.getCountryInfo();
    console.log('loadCountryInfo:', result);
    return result;
  };

  init = async () => {
    this.countryInfo = await this.loadCountryInfo();
    this.setCountryInfo(await CountryCodePicker.setPickerInitValue());
  };

  render() {
    if (!this.state.countryInfo) return <View />;
    const { name, code } = this.state.countryInfo;
    if (!code) return <View />;

    const goSelectCountry = () => {
      const interfaceProps = new SelectCountry.InterfaceProps(this.countryInfo);
      // Actions.selectCountry({ ...interfaceProps });
    };
    const getCountryName = () => (!this.props.hideCountryName && name) || '';
    const getPhoneCode = () => {
      return ((this.props.onlyPhoneNum && (code && `+${code}`)) || '') || ((this.props.phoneNum && (code && `(+${code})`)) || '');
    };
    return (
      <View>
        <TouchableWithoutFeedback
          onPress={goSelectCountry}
        >
          <View
            style={[defaultStyle, this.props.defaultStyle]}
          >
            <Text
              style={{
                fontSize: 15,
                color: '#486079'
              }}
            >
              {`${getCountryName()} ${getPhoneCode()}`}
            </Text>
            {!this.props.hideArrow &&
              <View style={{marginLeft: 30}}>
                <Image
                  source={require('../../assets/btn_arrow_down.png')}
                />
              </View>
            }

          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const defaultStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#d9e0e8',
  borderRadius: 3,
  overflow: 'hidden',
  paddingVertical: 9,
  paddingHorizontal: 10,
};
