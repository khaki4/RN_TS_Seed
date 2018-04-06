import React, { Component } from "react";
import {
  Text,
  View,
  StatusBar,
  Image,
  Platform,
  Keyboard,
  Alert,
  Dimensions,
  StyleSheet
} from "react-native";
import { connect } from "react-redux";
import EStyleSheet from "react-native-extended-stylesheet";
import DeviceInfo from "react-native-device-info";
import { ifIphoneX, isIphoneX } from "react-native-iphone-x-helper";
import Q from "q";
import { warning } from "../service/logging.service";
import {
  FilledButton,
  UnderLinedInputSection,
  Input,
  TextButton
} from "../components/common";
import AuthService from "../service/auth.service";
import languageService from "../service/LanguageService";
import { getProfile } from "../service/user-controller";
import { BASE_DOMAIN } from "../util/globalConstantUnit";
import { strings } from "../service/strings";
import CountryCodePicker from "../components/CountryCodePicker";
import countryService from "../service/CountryService";
import v from "../util/styleValues";

const KEY = "OWNER-8B1748859C1E4FC5798D1AEDF1818";

let GET_TOKEN_URL = BASE_DOMAIN + "/api/auth/issue";
let LOGIN_URL = BASE_DOMAIN + "/api/auth/login";

const SCREEN_HEIGHT = Dimensions.get("window").height;

class Login extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    warning("Login constructor");
    this.state = {
      account: "",
      password: "",
      isSpinnerShow: false,
      isKeyboardShowing: false,
      countryInfo: {
        name: "",
        code: "",
        country_code: ""
      }
    };
  }

  componentWillMount() {
    warning("Login componentWillMount");
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow.bind(this)
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide.bind(this)
    );
  }
  componentDidMount() {
    console.log("Login init...");
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.countryInfo) {
      const {
        country_name: name,
        country_phone_code: code,
        country_code
      } = nextProps.countryInfo;
      this.setState(() => ({ countryInfo: { name, code, country_code } }));
      countryService.setCurrentCountryCode(country_code);
      console.log(nextProps);
    }
  }
  componentWillUnmount() {
    warning("Login componentWillUnmount");
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  onPressFilledButton = () => {
    warning("Login onPressFilledButton");
    this.setState({ isSpinnerShow: true }, async () => {
      let platform = Platform.OS === "ios" ? "iOS" : "ANDROID";
      let account = this.state.account.trim();

      if (!account.includes("@")) {
        const {
          country_phone_code
        } = await countryService.getCurrentContryInfo();
        account = account.replace(/-/g, "");
        account = account.replace(/^0/, "");
        account = country_phone_code.replace(/\D/g, "") + account;
      }

      warning("account:", account);
      warning("platform:", platform);
      fetch(GET_TOKEN_URL, {
        method: "POST",
        headers: {
          Accept: "application/json;charset=UTF-8",
          "Content-Type": "application/json;charset=UTF-8",
          Key: KEY,
          "app-version": DeviceInfo.getVersion(),
          locale: languageService.defaultLan,
          timezone: DeviceInfo.getTimezone()
        },
        body: JSON.stringify({
          account,
          platform
        })
      })
        .then(response => response.json())
        .then(responseData => {
          warning("token:", responseData);
          if (responseData.return_code === 200) {
            let token = responseData.token.token;
            let userId = responseData.token.user_id.toString();
            let refreshToken = responseData.token.refresh_token;
            let expiredAt = responseData.token.expired_at.toString();

            this.login(token, userId, refreshToken, expiredAt);
          } else {
            Alert.alert(
              "",
              responseData.return_message || responseData.message,
              [
                {
                  text: strings.confirm,
                  onPress: () => {
                    this.setState({
                      isSpinnerShow: false
                    });
                  }
                }
              ],
              {
                cancelable: false
              }
            );
          }
        })
        .catch(error => {
          Alert.alert(
            "",
            error.message,
            [
              {
                text: strings.confirm,
                onPress: () => {
                  this.setState({
                    isSpinnerShow: false
                  });
                }
              }
            ],
            {
              cancelable: false
            }
          );
        });
    });
  };
  _keyboardDidShow() {
    warning("Login _keyboardDidShow");
    this.setState({ isKeyboardShowing: true });
  }

  _keyboardDidHide() {
    warning("Login _keyboardDidHide");
    this.setState({ isKeyboardShowing: false });
  }

  login(token, userId, refreshToken, expiredAt) {
    warning("Login login");
    this.setState({ isSpinnerShow: true }, () => {
      let appVersion = DeviceInfo.getVersion();
      let browserInfo = "";
      let deviceName = "";
      if (Platform.OS === "ios") {
        deviceName =
          DeviceInfo.getDeviceId() + " " + DeviceInfo.getSystemVersion();
      } else {
        deviceName = DeviceInfo.getModel() + " " + Platform.Version;
      }
      let osType = Platform.OS === "ios" ? "iOS" : "ANDROID";
      let osVersion = Platform.Version;
      let uniqueId = DeviceInfo.getUniqueID();

      warning("token ", token);
      warning("appVersion ", appVersion);
      warning("browserInfo ", browserInfo);
      warning("deviceName ", deviceName);
      warning("osType ", osType);
      warning("osVersion ", osVersion);
      warning("uniqueId ", uniqueId);

      fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          Accept: "application/json;charset=UTF-8",
          "Content-Type": "application/json;charset=UTF-8",
          "access-token": token,
          "app-version": DeviceInfo.getVersion(),
          locale: languageService.defaultLan,
          timezone: DeviceInfo.getTimezone()
        },
        body: JSON.stringify({
          app_version: appVersion,
          browser_info: browserInfo,
          device_name: deviceName,
          os_type: osType,
          os_version: osVersion,
          password: this.state.password,
          uuid: uniqueId
        })
      })
        .then(response => response.json())
        .then(responseData => {
          warning("inside responsejson");
          warning("response object:", responseData);

          if (responseData.return_code === 200) {
            const authService = new AuthService();
            const setToken = authService.setToken(token);
            const setUserId = authService.setUserId(userId);
            const setRefreshToken = authService.setRefreshToken(refreshToken);
            const setExpiredAt = authService.setExpiredAt(expiredAt);

            Q.all([setToken, setUserId, setRefreshToken, setExpiredAt]).done(
              () => {
                this.setState(
                  {
                    isSpinnerShow: false
                  },
                  () => {
                    setTimeout(() => {
                      warning("go storeList");
                    });
                  }
                );
              }
            );
          } else {
            Alert.alert(
              "",
              responseData.return_message,
              [
                {
                  text: strings.confirm,
                  onPress: () => {
                    this.setState({
                      isSpinnerShow: false
                    });
                  }
                }
              ],
              {
                cancelable: false
              }
            );
          }
        })
        .catch(error => {
          Alert.alert(
            "",
            error.message,
            [
              {
                text: strings.confirm,
                onPress: () => {
                  this.setState({
                    isSpinnerShow: false
                  });
                }
              }
            ],
            {
              cancelable: false
            }
          );
        });
    });
  }

  render() {
    warning("Login render", this.state);
    const {
      container,
      albamLogo,
      imageContainer,
      bottomGroupContainer,
      inputOutterStyle,
      inlineButtomGroup,
      UnderLinedInputSectionGroup,
      inlineButtons,
      divText,
      textButtonStyle,
      copyright
    } = styles;

    let isKeyboardShowingView = null;

    if (SCREEN_HEIGHT > 500 && !this.state.isKeyboardShowing) {
      isKeyboardShowingView = (
        <View style={imageContainer}>
          <Image source={require("../../assets/logo_log_in.png")} />
        </View>
      );
    } else {
      isKeyboardShowingView = (
        <View style={{ marginTop: isIphoneX() ? 50 : 40 }} />
      );
    }

    return (
      <View style={container}>
        {isKeyboardShowingView}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            marginBottom: 10
          }}
        >
          <CountryCodePicker info={this.state.countryInfo} phoneNum />
        </View>
        <View style={bottomGroupContainer}>
          <View style={UnderLinedInputSectionGroup}>
            <UnderLinedInputSection style={inputOutterStyle}>
              <Input
                keyboardType="email-address"
                placeholder={strings.emailMobile}
                placeholderTextColor="rgb(115, 142, 171)"
                onChangeText={account => this.setState({ account })}
                value={this.state.account}
              />
            </UnderLinedInputSection>
            <UnderLinedInputSection style={inputOutterStyle}>
              <Input
                secureTextEntry
                placeholder={strings.password}
                placeholderTextColor="rgb(115, 142, 171)"
                onChangeText={password => this.setState({ password })}
                value={this.state.password}
              />
            </UnderLinedInputSection>
          </View>
          <FilledButton
            buttonText={strings.login}
            bgColor="#03a9f4"
            activeBgColor="#027fb7"
            fontSize={16}
            textColor="#fafafa"
            onPress={this.onPressFilledButton}
          />
          <View style={inlineButtomGroup}>
            <View style={inlineButtons}>
              <TextButton
                style={textButtonStyle}
                buttonText={strings.signUp}
                onPress={() => {
                  // Analytics.logEvent('join_start', {
                  //   scene: 'login',
                  // });
                  // Actions.signUpSelect();
                }}
              />
              <Text style={divText}>|</Text>
              <TextButton
                style={textButtonStyle}
                buttonText={strings.findPassword}
                onPress={() => {
                  // Actions.resetPasswordSelect();
                }}
              />
            </View>
            <Text style={copyright}>©Blue Night Corp.</Text>
          </View>
        </View>
      </View>
    );
  }
}
export default connect()(Login);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    marginTop:
      127 *
      (SCREEN_HEIGHT / 667.0 > 0.8 ? Math.pow(SCREEN_HEIGHT / 667.0, 2) : 0.3)
  },
  bottomGroupContainer: {
    alignItems: "center"
  },
  UnderLinedInputSectionGroup: {
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 13
  },
  inlineButtomGroup: {
    alignItems: "center"
  },
  inputOutterStyle: {
    marginBottom: 20
  },
  inlineButtons: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 10
  },
  divText: {
    color: "rgb(153, 173, 194)",
    fontFamily: "Apple SD Gothic Neo",
    fontSize: 14,
    margin: 5
  },
  textButtonStyle: {
    fontFamily: "Apple SD Gothic Neo",
    fontSize: 15,
    color: "rgb(115, 142, 171)"
  },
  copyright: {
    color: "rgb(153, 173, 194)",
    fontFamily: "Apple SD Gothic Neo",
    fontSize: 15,
    marginBottom: 20
  }
});
