import React, { Component } from "react";
import {
  Text,
  View,
  StatusBar,
  Image,
  TouchableHighlight,
  NativeModules,
  Linking,
  Alert,
  Platform,
  StyleSheet
} from "react-native";
import { connect } from "react-redux";
import R from "ramda";
import EStyleSheet from "react-native-extended-stylesheet";
import DeviceInfo from "react-native-device-info";
import RNExitApp from "react-native-exit-app";
import { setJSExceptionHandler } from "react-native-exception-handler";
import Q from "q";
import AuthService from "../service/auth.service";
import { warning } from "../service/logging.service";
import { BASE_DOMAIN } from "../util/globalConstantUnit";
import { strings } from "../service/strings";
import languageService from "../service/LanguageService";
import countryService from "../service/CountryService";
import * as fromNavi from "../reducers/navigation";
const KEY = "OWNER-8B1748859C1E4FC5798D1AEDF1818";

const EXCHANGE_URL = BASE_DOMAIN + "/api/auth/exchange";
const GET_VERSION_URL = BASE_DOMAIN + "/api/system/version";

let updateUrl;

const errorHandler = (e, isFatal) => {
  const authService = new AuthService();
  const {
    setCrashHistoryFlag,
    setCrashLog,
    getCrashHistoryFlag,
    getCrashLog
  } = authService;
  if (isFatal) {
    if (__DEV__) return;
    Alert.alert(strings.notice, strings.quitApp, [
      {
        text: strings.confirm,
        onPress: () => {
          const _setCrashHistoryFlag = setCrashHistoryFlag("1");
          const getErrorMessage = error => {
            try {
              if (typeof error !== "string" && typeof error !== "object") {
                throw Error("unexpected error type");
              }

              if (typeof error === "string") return error;
              return JSON.stringify(e.message);
            } catch (e) {
              warning(e);
              return "";
            }
          };
          const _setCrashLog = setCrashLog(getErrorMessage(e.message));
          Q.all([_setCrashHistoryFlag, _setCrashLog]).done(() => {
            getCrashHistoryFlag().then(res => {
              getCrashLog().then(res => {
                RNExitApp.exitApp();
              });
            });
          });
        }
      }
    ]);
  } else {
    warning(e); // So that we can see it in the ADB logs in case of Android if needed
  }
};

class Splash extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };
  }
  componentWillMount() {
    this.setEnvirmentSttingForGlobal().then(() =>
      console.log("setEnvirmentSttingForGlobal")
    );
  }
  componentDidMount() {
    console.log("splash init...");
    // this.getVersion();
    this.getToken();
    setJSExceptionHandler(errorHandler);
  }
  routeInitPage = () => {
    const authService = new AuthService();
    authService.getFirstStart().then(v => {
      this.props.goLogin();
    });
  };
  getVersion() {
    let osEnglish = "";

    if (Platform.OS === "android") {
      osEnglish = "ANDROID";
    } else {
      osEnglish = "iOS";
    }
    fetch(GET_VERSION_URL, {
      method: "GET",
      headers: {
        Accept: "application/json;charset=UTF-8",
        "Content-Type": "application/json;charset=UTF-8",
        Key: KEY,
        App: "OWNER",
        platform: osEnglish,
        "app-version": DeviceInfo.getVersion(),
        locale: languageService.defaultLan,
        timezone: DeviceInfo.getTimezone()
      }
    })
      .then(response => response.json())
      .then(responseData => {
        warning("token:", responseData);
        if (responseData.return_code === 200) {
          let appVersion = DeviceInfo.getVersion();
          let getOsversion;
          let lastestVersion;

          if (Platform.OS === "android") {
            getOsversion = responseData.version.required_adr_version;
            lastestVersion = responseData.version.latest_adr_version;
            updateUrl = responseData.version.update_adr_link;
          } else {
            getOsversion = responseData.version.required_ios_version;
            lastestVersion = responseData.version.latest_ios_version;
            updateUrl = responseData.version.update_ios_link;
          }

          if (
            !R.isNil(updateUrl) &&
            this.versionCompare(getOsversion, appVersion) > 0
          ) {
            Alert.alert(
              "",
              strings.lastUpgrade,
              [{ text: strings.confirm, onPress: () => this.update() }],
              { cancelable: false }
            );
          } else if (
            !R.isNil(updateUrl) &&
            this.versionCompare(lastestVersion, appVersion) > 0
          ) {
            Alert.alert(
              "",
              strings.lastUpgrade,
              [
                { text: strings.cancel, onPress: () => this.getToken() },
                { text: strings.confirm, onPress: () => this.update() }
              ],
              { cancelable: false }
            );
          } else {
            this.getToken();
          }
        } else {
          this.getToken();
        }
      })
      .catch(error => {
        this.getToken();
      });
  }

  setEnvirmentSttingForGlobal = async () => {
    try {
      const authService = new AuthService();
      const usedLanguage = await authService.getUsedLanguage();
      console.log("usedLanguage", usedLanguage);
      languageService.setCurrentLan(usedLanguage || "null");

      const countryCodeOfAccount = await authService.getCountryCodeOfAccount();
      countryService.setCountryCodeBelongToAccount(countryCodeOfAccount);
    } catch (e) {
      console.log("setEnvirmentSttingForGlobal", e.message);
    }
  };

  getToken = async () => {
    const authService = new AuthService();
    const token = await authService.getToken();
    warning("token : " + token);
    if (!R.isNil(token)) {
      const userId = await authService.getUserId();

      this.setState({ visible: false }, () => {
        // const interfaceProps = new StoreList.InterfaceProps(true);
        // Actions.storeList({ ...interfaceProps });
      });
    } else {
      this.routeInitPage();
    }
  };

  update() {
    Linking.openURL(updateUrl)
      .then(() => {
        RNExitApp.exitApp();
      })
      .catch(err => warning(err));
  }

  versionCompare(str1, str2) {
    let vals1 = str1.split(".");
    let vals2 = str2.split(".");

    let i = 0;

    warning(vals1);

    while (i < vals1.length && i < vals2.length && vals1[i] === vals2[i]) {
      i++;
    }

    if (i < vals1.length && i < vals2.length) {
      if (parseInt(vals1[i], 10) > parseInt(vals2[i], 10)) {
        return 1;
      } else if (parseInt(vals1[i], 10) === parseInt(vals2[i], 10)) {
        return 0;
      } else if (parseInt(vals1[i], 10) < parseInt(vals2[i], 10)) {
        return -1;
      }
    } else {
      return vals1.length - vals2.length;
    }
  }
  exchangeToken(token) {
    let osEnglish = "";
    if (Platform.OS === "android") {
      osEnglish = "ANDROID";
    } else {
      osEnglish = "iOS";
    }
    fetch(EXCHANGE_URL, {
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
        access_token: token,
        platform: osEnglish
      })
    })
      .then(response => response.json())
      .then(responseData => {
        warning("token:", responseData);
        this.setState({
          visible: false
        });
        if (responseData.return_code === 200) {
          const authService = new AuthService();
          const setToken = authService.setToken(responseData.token.token);
          const setUserId = authService.setUserId(
            responseData.token.user_id.toString()
          );
          const setRefreshToken = authService.setItem(
            "refresh_token",
            responseData.token.refresh_token
          );
          const setExpiredAt = authService.setItem(
            "expired_at",
            responseData.token.expired_at.toString()
          );
        } else {
          this.routeInitPage();
        }
      })
      .catch(error => {
        console.error(error);
        this.routeInitPage();
      });
  }
  render() {
    const {
      container,
      imageContainer,
      albamLogo,
      introWelcomeContainer,
      introWelcomeTextStyle,
      iconHeart,
      bottomGroup,
      defaultHighlight,
      buttonContainer,
      copyrightContainer,
      coloredButton,
      whiteButton,
      copyright
    } = styles;
    return (
      <View style={container}>
        <View style={imageContainer}>
          <Image
            resizeMode="contain"
            style={albamLogo}
            source={require("../../assets/logo_log_in.png")}
          />
        </View>
        <View style={introWelcomeContainer}>
          <Text style={introWelcomeTextStyle}>We</Text>
          <Image
            style={iconHeart}
            source={require("../../assets/icon_heart.png")}
          />
          <Text style={introWelcomeTextStyle}>Employee</Text>
        </View>
        <View style={{ flex: 1 }} />
      </View>
    );
  }
}

export default connect(null, {
  goLogin: fromNavi.goLogin
})(Splash);

const styles = StyleSheet.create({
  copyrightContainer: {
    height: 50,
    paddingTop: 7,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  copyright: {
    color: "rgb(153, 173, 194)",
    fontFamily: "Apple SD Gothic Neo",
    fontSize: 15
  },
  defaultHighlight: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3
  },
  buttonContainer: {
    height: 50,
    justifyContent: "center",
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 3
  },
  textStyle: {
    color: "rgb(115, 142, 171)",
    fontFamily: "Apple SD Gothic Neo",
    fontSize: 16
  },
  buttonStyle: {
    backgroundColor: "#fff"
  },
  touchedButtonStyle: {
    backgroundColor: "rgb(138, 194, 72)"
  },
  container: {
    flex: 1
  },
  backScrollView: {
    backgroundColor: "#f7f7f7"
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 89,
    marginBottom: 15
  },
  albamLogo: {
    marginTop: 13
  },
  iconHeart: {
    width: 18,
    height: 16,
    marginTop: 4,
    marginLeft: 9,
    marginRight: 5
  },
  introWelcomeContainer: {
    flexDirection: "row",
    justifyContent: "center"
  },
  introWelcomeTextStyle: {
    justifyContent: "center",
    color: "rgb(72, 96, 121)",
    fontFamily: "Apple SD Gothic Neo",
    fontSize: 18
  },
  inputGroup: {
    height: 300,
    justifyContent: "flex-end",
    flexDirection: "column",
    position: "relative"
  }
});
