import Q from 'q';
import { Alert } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import AuthService from '../service/auth.service';
import { RETURN_CODE } from '../types/returnCode';
import { warning } from './logging.service';
import { BASE_DOMAIN } from '../util/globalConstantUnit';
import { WHITE_URL } from '../types/whiteUrl';
import { strings } from './strings';
import languageService from './LanguageService';

export const SUCCESSFUL_RESPONSE = {
  OK: 200,
};

export class ErrorHandler {
  constructor() {
    this._IS_TEST_MODE = __DEV__;
    this._MESSAGE_FOR_USER = strings.invalidAttempt;
  }

  validateResponse(response) {
    warning('validateResponse response.status', response.status);
    if (!response) throw Error(strings.invalidAttempt);
    let reason = response.statusText || strings.invalidAttempt;
    if (!this._IS_TEST_MODE) {
      reason = strings.invalidAttempt;
    }
    try {
      if (!response.ok) {
        warning('!response.ok', response);
        throw Error(reason);
      } else {
        return response.json();
      }
    } catch (e) {
      warning('errored at handleErrors -', e);
      throw Error(reason);
    }
  }
  getErrorMsgForUser(msg) {
    warning("getErrorMsgForUser", msg);
    return msg || strings.invalidAttempt;
  }
}

const FETCHER_TYPES = {
  METHOD_TYPE: {
    POST: 'POST',
    GET: 'GET',
  },
  PARAMS_TYPE: {
    OBJECT: 'object',
    ARRAY: 'array',
  },
  CONTENT_TYPE: [
    'application/json;charset=UTF-8',
    'multipart/form-data',
  ],
};
const FetcherManger = (() => {
  let token = null;
  let userId = null;
  const authService = new AuthService();

  const FetcherManger = () => {
    this.fetchHeaders = {};
    this.fetchParams = {};
  };
  const fn = FetcherManger.prototype;
  fn.setFetchHeaders = function (contentType, token, userId) {
    let isValidContentType = false;
    FETCHER_TYPES.CONTENT_TYPE.forEach((item, index) => {
      if (contentType === FETCHER_TYPES.CONTENT_TYPE[index]) {
        isValidContentType = true;
      }
    });

    if (!isValidContentType) throw Error('invalid contentType');

    const headers = {
      Accept: 'application/json;charset=UTF-8',
      'Content-Type': contentType,
      'access-token': token,
      user_id: userId,
      'app-version': DeviceInfo.getVersion(),
      'locale': languageService.defaultLan,
      'timezone': DeviceInfo.getTimezone(),
    };

    this.fetchHeaders = headers;
  };
  fn.getFetchHeaders = function () {
    return this.fetchHeaders;
  };
  fn.setFetchParams = function (methodType, bodyParamsType, bodyParams, contentType) {
    const { POST, GET } = FETCHER_TYPES.METHOD_TYPE;

    let isValidContentType = false;
    FETCHER_TYPES.CONTENT_TYPE.forEach((item, index) => {
      if (contentType === FETCHER_TYPES.CONTENT_TYPE[index]) {
        isValidContentType = true;
      }
    });
    if (!isValidContentType) throw Error('invalid contentType');
    if (methodType !== POST && methodType !== GET) throw Error('invaild fetch method type');
    if (bodyParamsType !== FETCHER_TYPES.PARAMS_TYPE.OBJECT && bodyParamsType !== FETCHER_TYPES.PARAMS_TYPE.ARRAY) {
      throw Error('invaild PARAMS_TYPE');
    }
    this.setFetchHeaders(contentType, token, userId);
    const _headers = this.getFetchHeaders();
    let _fetchParams = {};
    const setBodyParamsByTypes = (_bodyParamsType) => {
      if (contentType === FETCHER_TYPES.CONTENT_TYPE[0] && _bodyParamsType === FETCHER_TYPES.PARAMS_TYPE.ARRAY) {
        return JSON.stringify([...bodyParams]);
      } else if (contentType === FETCHER_TYPES.CONTENT_TYPE[0] && _bodyParamsType === FETCHER_TYPES.PARAMS_TYPE.OBJECT) {
        return JSON.stringify({
          ...bodyParams,
        });
      } else if (contentType === FETCHER_TYPES.CONTENT_TYPE[1] && _bodyParamsType === FETCHER_TYPES.PARAMS_TYPE.OBJECT) {
        return bodyParams;
      }
    };

    if (methodType === POST) {
      _fetchParams = {
        method: methodType,
        headers: _headers,
        body: setBodyParamsByTypes(bodyParamsType),
      };
    } else if (methodType === GET) {
      _fetchParams = {
        method: methodType,
        headers: _headers,
      };
    }

    this.fetchParams = _fetchParams;
  };
  fn.getFetchParams = function () {
    return this.fetchParams;
  };
  fn.setFetcher = function (methodType, bodyParamsType, contentType, errorCodeForPass) {
    const _self = this;
    return (URL, bodyParams) => {
      const deferred = Q.defer();
      const fetchedToken = authService.getToken().then(res => {
        token = res;
        warning('fetchedToken is :', token);
      });
      const fetchedUserId = authService.getUserId().then(res => {
        userId = res;
        warning('fetchedUserId is :', userId);
      });
      Q.all([fetchedToken, fetchedUserId]).done(() => {
        _self.setFetchParams(methodType, bodyParamsType, bodyParams, contentType);
        warning(methodType, URL, _self.getFetchParams());
        fetch(URL, _self.getFetchParams())
          .then((res) => {
            return errorHandler.validateResponse(res);
          })
          .then(responseData => {
            try {
              warning(responseData);
              if (responseData.return_code === SUCCESSFUL_RESPONSE.OK) {
                deferred.resolve(responseData);
              } else {
                // 사용자에게 에러메시지를 보여주지 않고 예외 처리하는경우
                // errorCodeForPass === responseData.return_code: api에서 특정 에러코드에 대한 알럿 처리 방지.
                if ((responseData && responseData.return_message && RETURN_CODE[responseData.return_code]) || (errorCodeForPass === responseData.return_code)) {
                  console.log('errorCodeForPass', errorCodeForPass);
                  deferred.reject(responseData);
                } else {
                  // 사용자에게 에러메시지를 Alert경고창 형태로 보여주는 경우
                  return Q.delay().then(() => {
                    throw Error(errorHandler.getErrorMsgForUser(responseData.return_message || strings.invalidAttempt));
                  });
                }
              }
            } catch (e) {
              deferred.reject(errorHandler.getErrorMsgForUser(e.message));
            }
          })
          .catch(error => {
            if (WHITE_URL[URL.replace(BASE_DOMAIN, '')]) {
              // 사용자에게 에러메시지를 보여주지 않고 예외 처리하는경우
              deferred.reject(errorHandler.getErrorMsgForUser(error.message));
            } else {
              Alert.alert(
                '',
                error.message,
                [
                  {
                    text: strings.confirm,
                    onPress: () => {
                      warning('errored - ', error.message);
                      deferred.reject(errorHandler.getErrorMsgForUser(error.message));
                    },
                  },
                ],
                {
                  cancelable: false,
                },
              );
            }
          });
      });
      return deferred.promise;
    };
  };
  return FetcherManger;
})();

const errorHandler = new ErrorHandler();
const fetcherManger = new FetcherManger();

const fetchDataFromUrlByPost =
  fetcherManger.setFetcher(FETCHER_TYPES.METHOD_TYPE.POST, FETCHER_TYPES.PARAMS_TYPE.OBJECT, FETCHER_TYPES.CONTENT_TYPE[0]);
const fetchDataFromUrlByPostForArrayParams =
  fetcherManger.setFetcher(FETCHER_TYPES.METHOD_TYPE.POST, FETCHER_TYPES.PARAMS_TYPE.ARRAY, FETCHER_TYPES.CONTENT_TYPE[0]);
const fetchDataFromUrlByPostForMultipartFile =
  fetcherManger.setFetcher(FETCHER_TYPES.METHOD_TYPE.POST, FETCHER_TYPES.PARAMS_TYPE.OBJECT, FETCHER_TYPES.CONTENT_TYPE[1]);
const fetchDataFromUrlByGet =
  fetcherManger.setFetcher(FETCHER_TYPES.METHOD_TYPE.GET, FETCHER_TYPES.PARAMS_TYPE.OBJECT, FETCHER_TYPES.CONTENT_TYPE[0]);

export {
  fetchDataFromUrlByGet,
  fetchDataFromUrlByPost,
  fetchDataFromUrlByPostForArrayParams,
  fetchDataFromUrlByPostForMultipartFile,
};

