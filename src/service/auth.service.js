import SInfo from 'react-native-sensitive-info';
import Q from 'q';
import { warning } from './logging.service';

/**
 * @ LocalStorage를 활용하는 method만 등록
 * @ 타 Service에 import 가능.
 */
export default class AuthService {
  constructor() {
    this.keyObject = {
      sharedPreferencesName: 'v3-albam-owner',
      keychainService: 'com.albamapp.OwnerR2',
    };
    this.SInfo = SInfo;
    this.token = '';
    this.userId = '';
    this.devFlag = '1';
    this.refreshToken = '';
    this.expiredAt = '';
  }
  setToken(token) {
    const deferred = Q.defer();
    try {
      SInfo.setItem('token', token, this.keyObject).then(() => {
        warning('set token :', token);
        deferred.resolve();
      });
      return deferred.promise;
    } catch (e) {
      warning('setToken', e.message);
    }
  }

  getToken() {
    const deferred = Q.defer();
    try {
      this.SInfo.getItem('token', this.keyObject).then(value => {
        this.token = value;
        deferred.resolve(value);
      });
      return deferred.promise;
    } catch (e) {
      warning('getToken', e.message);
    }
  }

  setUserId(userId) {
    const deferred = Q.defer();
    try {
      SInfo.setItem('user_id', userId, this.keyObject).then(() => {
        warning('set userId :', userId);
        deferred.resolve();
      });
      return deferred.promise;
    } catch (e) {
      warning('setUserId', e.message);
    }
  }

  getUserId() {
    const deferred = Q.defer();
    try {
      this.SInfo.getItem('user_id', this.keyObject).then(value => {
        this.userId = value;
        // deferred.resolve(value);
        deferred.resolve(value);
      });
      return deferred.promise;
    } catch (e) {
      warning('user_id', e.message);
    }
  }

  setRefreshToken() {
    const deferred = Q.defer();
    try {
      this.SInfo.getItem('refresh_token', this.keyObject).then(value => {
        this.refreshToken = value;
        deferred.resolve(value);
      });
      return deferred.promise;
    } catch (e) {
      warning('refreshToken', e.message);
    }
  }

  setExpiredAt() {
    const deferred = Q.defer();
    try {
      this.SInfo.getItem('expired_at', this.keyObject).then(value => {
        this.expiredAt = value;
        deferred.resolve(value);
      });
      return deferred.promise;
    } catch (e) {
      warning('refreshToken', e.message);
    }
  }

  setStoreId(store_id) {
    try {
      if (typeof store_id !== 'string') {
        store_id = store_id.toString();
      }
      SInfo.setItem('store_id', store_id, this.keyObject);
      warning('set store_id :', store_id);
    } catch (e) {
      warning('errored at set store_id', e.message);
    }
  }

  getStoreId() {
    const deferred = Q.defer();
    try {
      this.SInfo.getItem('store_id', this.keyObject).then(value => {
        deferred.resolve(value);
      });
      return deferred.promise;
    } catch (e) {
      warning('store_id', e.message);
    }
  }

  setStoreName(store_name) {
    try {
      SInfo.setItem('store_name', store_name, this.keyObject);
      warning('set store_name :', store_name);
    } catch (e) {
      warning('errored at set store_name', e.message);
    }
  }

  getStoreName() {
    const deferred = Q.defer();
    try {
      this.SInfo.getItem('store_name', this.keyObject).then(value => {
        deferred.resolve(value);
      });
      return deferred.promise;
    } catch (e) {
      warning('store_name', e.message);
    }
  }

  /**
   * 회원가입시에만 국가코드 설정
   * @signup -> 국가코드를 로컬에 저장!
   * 로그인 -> 설정해둔 국가코드를 받아서 재설정.
   */
  setCountryCodeOfAccount(country_code) {
    try {
      SInfo.setItem('country_code', country_code, this.keyObject);
      warning('setCountryCodeOfAccount :', country_code);
    } catch (e) {
      warning('errored in setCountryCodeOfAccount', e.message);
    }
  }

  /**
   * @splash -> 로컬에 있는 국가코드 정보 ? 해당국가코드 사용 : 국내사용자로 판단
   * @login -> getProfile -> 국가코드를 로컬에 저장
   * @returns {Promise<*>}
   */
  async getCountryCodeOfAccount() {
    try {
      const result = await this.SInfo.getItem('country_code', this.keyObject);
      // setCountryCodeOfAccount 로 값이 한번도 할당 되지 않았다면
      // undefined return;
      console.log('getCountryCodeOfAccount:', result);
      return result;
    } catch (e) {
      warning('getCountryCodeOfAccount', e.message);
    }
  }

  setUsedLanguage(lang) {
    if (typeof lang !== 'string') throw new TypeError('parameter is not a string');
    try {
      SInfo.setItem('used_language', lang, this.keyObject);
      warning('setUsedLanguage :', lang);
    } catch (e) {
      warning('errored in setUsedLanguage', e.message);
    }
  }

  async getUsedLanguage() {
    try {
      const result = await this.SInfo.getItem('used_language', this.keyObject);
      return result;
    } catch (e) {
      warning('getUsedLanguage', e.message);
    }

  }

  setStoreDbId(store_db_id) {
    try {
      if (typeof store_db_id !== 'string') {
        store_db_id = store_db_id.toString();
      }
      SInfo.setItem('store_db_id', store_db_id, this.keyObject);
      warning('set store_db_id :', store_db_id);
    } catch (e) {
      warning('errored at set store_db_id', e.message);
    }
  }

  getStoreDbId() {
    const deferred = Q.defer();
    try {
      this.SInfo.getItem('store_db_id', this.keyObject).then((value) => {
        deferred.resolve(value);
      });
      return deferred.promise;
    } catch (e) {
      warning('store_db_id', e.message);
    }
  }

  setItem(key, value) {
    const deferred = Q.defer();
    try {
      SInfo.setItem(key, value, this.keyObject).then(() => {
        warning('setItem', key, value);
        deferred.resolve();
      });
      return deferred.promise;
    } catch (e) {
      warning('setItem', e.message);
    }
  }

  getItem(key) {
    const deferred = Q.defer();
    try {
      this.SInfo.getItem(key, this.keyObject).then(value => {
        deferred.resolve(value);
      });
      return deferred.promise;
    } catch (e) {
      warning('getItem', key, e.message);
    }
  }

  deleteItem(key) {
    try {
      SInfo.deleteItem(key, this.keyObject);
      warning('delete', key);
    } catch (e) {
      warning('deleteItem', key, e.message);
    }
  }

  setCrashHistoryFlag = (crash_history_flag) => {
    const deferred = Q.defer();
    try {
      SInfo.setItem('crash_history_flag', crash_history_flag, this.keyObject).then(() => {
        warning('set crash_history_flag :', crash_history_flag);
        deferred.resolve();
      });
      return deferred.promise;
    } catch (e) {
      warning('crash_history_flag', e.message);
    }
  };

  getCrashHistoryFlag = () => {
    const deferred = Q.defer();
    try {
      this.SInfo.getItem('crash_history_flag', this.keyObject).then(
        value => {
          deferred.resolve(value);
        },
        err => {
          deferred.reject(err);
        })
        .catch(reason => deferred.reject(reason));
      return deferred.promise;
    } catch (e) {
      warning('getToken', e.message);
    }
  };

  setCrashLog = (crash_log) => {
    const deferred = Q.defer();
    try {
      SInfo.setItem('crash_log', crash_log, this.keyObject).then(() => {
        warning('set crash_log :', crash_log);
        deferred.resolve();
      });
    } catch (e) {
      warning('errored at set crash_log', e.message);
      deferred.reject(e.message);
    }
    return deferred.promise;
  };

  getCrashLog = () => {
    const deferred = Q.defer();
    try {
      SInfo.getItem('crash_log', this.keyObject).then(
        (value) => {
          deferred.resolve(value || '');
        });
      return deferred.promise;
    } catch (e) {
      warning('crash_log', e.message);
    }
  };

  saveStoreData(store_id, key, value) {
    const k = 'data_' + store_id;
    warning('saveStoreData', k);
    this.getItem(k).then(v => {
      warning('saveStoreData', v);
      let o = JSON.parse(v || '{}');
      o[key] = value;
      warning('saveStoreData', k, o);
      this.setItem(k, JSON.stringify(o));
    });
  }
  setDevFlag(flag) {
    if (typeof flag !== 'string') throw Error('invalid parameter');
    this.devFlag = flag;
  }

  getDevFlag() {
    return this.devFlag;
  }
  loadStoreData(store_id, key) {
    const deferred = Q.defer();
    try {
      const k = 'data_' + store_id;
      warning('loadStoreData', k);
      this.getItem(k).then(v => {
        warning('loadStoreData', v);
        let o = JSON.parse(v || '{}');
        warning('loadStoreData', k, o);
        deferred.resolve(o[key]);
      });
      return deferred.promise;
    } catch (e) {
      warning('getItem', key, e.message);
    }
  }
  setFirstStart() {
    try {
      SInfo.setItem('is_first_start', 'false', this.keyObject);
      warning('set is_first_start :', 'false');
    } catch (e) {
      warning('errored at set is_first_start', e.message);
    }
  }

  getFirstStart() {
    const deferred = Q.defer();
    try {
      this.SInfo.getItem('is_first_start', this.keyObject).then((value) => {
        deferred.resolve(value || 'true');
      });
      return deferred.promise;
    } catch (e) {
      warning('is_first_start', e.message);
    }
  }

}
