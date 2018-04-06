import _filter from 'lodash/filter';
import _keyBy from 'lodash/keyBy';
import retry from '../util/retryApi';
import { getGlobalInfo } from './user-controller';
import AuthService from './auth.service';
import { domesticCountryCode } from '../util/globalConstantUnit';

class CountryService {
  constructor() {
    this.currentCountryCode = null;
    this.countryList = null;
    this.countryListByCountryCode = null;
    this.countryCodeBelongToAccount = null;
    this.authService = new AuthService();
  }
  setCountryInfo = async () => {
    try {
      console.log('fetch :', getGlobalInfo);
      const globalInfo = await retry(getGlobalInfo, null);
      this.countryList = globalInfo.countryInfo;
      this.countryListByCountryCode = _keyBy(this.countryList, 'country_code');
      this.countryListByCountryPhoneCode = _keyBy(this.countryList, 'country_phone_code');
      const result = this.countryList;
      console.log('setCountryInfo:', result);
      return result;
    } catch (e) {
      console.log('errored at setCountryInfo -', e.message);
    }
  };

  setCurrentCountryCode = (countryCode) => {
    if (!countryCode) throw new TypeError('countryCode is falsy value');
    console.log('setCurrentCountryCode:', countryCode);
    this.currentCountryCode = countryCode;
  };

  getCurrentCountryCode = () => {
    console.log('getCurrentCountryCode:', this.currentCountryCode);
    return this.currentCountryCode;
  };

  getCurrentContryInfo = async () => {
    if (!this.countryList) {
      await this.setCountryInfo();
    }
    const result = this.countryListByCountryCode[this.currentCountryCode];
    console.log('getCurrentContryInfo', result);
    return result;
  };

  getCountryInfo = async () => {
    console.log('getCountryInfo is called');
    if (!this.countryList) {
      const result = await this.setCountryInfo();
      if (result) {
        return result;
      } else {
        throw Error('countryInfo is undefined');
      }
    } else {
      return await this.countryList;
    }
  };

  getCountryListByCountryCode = async () => {
    if (!this.countryList) {
      await this.setCountryInfo();
    }
    const result = this.countryListByCountryCode;
    console.log('getCountryListByCountryCode:', result);
    return result;
  };

  getCountryListByCountryPhoneCode = async () => {
    if (!this.countryList) {
      await this.setCountryInfo();
    }
    const result = this.countryListByCountryPhoneCode;
    console.log('getCountryListByCountryPhoneCode:', result);
    return result;
  };

  findCountryCodeAndCallingCode = async (phoneNum) => {
    console.log('findCountryCodeAndCallingCode is called');
    if (!this.countryList) {
      await this.setCountryInfo();
    }
    let phone = phoneNum.replace(/\D/g, '');
    console.log('findCountryCode', phone);
    let countryCode = '';
    let callingCode = '';
    for (let i = phone.length; i > 0; i--) {
      // console.log(phone.slice(0, i));
      callingCode = phone.slice(0, i);
      let country = _filter(this.countryList, (o) => {
        let codes = o.country_phone_code.split(',');
        let match = _filter(codes, (o) => {
          return o.trim().replace(/\D/g, '') === callingCode;
        });
        return match.length > 0;
      });
      if (country.length > 0) {
        countryCode = country[0].country_code;
        break;
      }
    }
    console.log('findCountryCode', countryCode, callingCode);
    return { countryCode, callingCode };
  };

  setCountryCodeBelongToAccount(countryCode = domesticCountryCode) {
    this.authService.setCountryCodeOfAccount(countryCode);
    this.countryCodeBelongToAccount = countryCode.toLowerCase();
    console.log('set CountryCodeBelongToAccount', this.countryCodeBelongToAccount);
  }

  getCountryCodeBelongToAccount() {
    console.log('get CountryCodeBelongToAccount', this.countryCodeBelongToAccount);
    return this.countryCodeBelongToAccount.toLowerCase();
  }

  get isGlobalAccount() {
    const contryCode = this.getCountryCodeBelongToAccount();
    const isGlobal = contryCode && contryCode.toLowerCase() !== domesticCountryCode.toLowerCase();
    return isGlobal;
  }

  getStringByAccount(string, globalString) {
    /**
     * @string: #을 포함한 문자열
     * @globalString: #을 포함한 문자열을 교체할 대상
     */
    try {
      const currency = this.isGlobalAccount ? globalString.global : globalString.kr;
      const result = string.replace(/#[^#]+#/g, currency);
      return result;
    } catch (e) {
      console.log('getLocalizeCurrency', e.message);
      return '';
    }
  }
}

export default new CountryService();
