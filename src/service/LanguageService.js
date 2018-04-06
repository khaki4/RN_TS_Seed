import DeviceInfo from 'react-native-device-info';
import _keyBy from 'lodash/keyBy';
import moment from 'moment';
import AuthService from './auth.service';
import { strings } from './strings';

class LanguageService {
  constructor() {
    this.lan = '';
    this.locale = '';
    this.countryInfo = '';
    this.authService = new AuthService();
    this.languageList = [
      {
        title: 'English',
        lang: 'en',
      },
      {
        title: '한국어',
        lang: 'ko',
      },
      {
        title: '日本語',
        lang: 'ja',
      },
      {
        title: 'Español',
        lang: 'es',
      },
    ];
  }
  setCurrentLan(_lang = 'en') {
    if (typeof _lang !== 'string') {
      _lang = this.defaultLan;
    }
    const isProperLocaleName = this.languageList.some(({ lang }) => lang === _lang);
    if (!isProperLocaleName) {
      console.log('locale is not a proper lang');
      _lang = this.defaultLan;
    }

    const languageListByLang = _keyBy(this.languageList, 'lang');
    strings.setLanguage(_lang);
    this.authService.setUsedLanguage(_lang);
    this.setCurrentCountryInfo(languageListByLang[_lang]);
    moment.locale(_lang);
    this.lan = _lang;

    console.log('setCurrentLan: ', _lang);
  }

  setCurrentCountryInfo(countryInfoObj) {
    this.countryInfo = countryInfoObj;
  }

  get defaultLan() {
    const defaultLan = this.lan || DeviceInfo.getDeviceLocale().slice(0, 2);
    console.log('defaultLan is:', defaultLan);
    return defaultLan;
  }

  get currentLan() {
    for (const { lang, title } of this.languageList) {
      if (lang === this.locale) {
        console.log('currentLan is:', title);
        return title;
      }
    }
  }
}

export default new LanguageService();