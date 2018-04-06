import axios from 'axios';
import Q from 'q';
import { Alert } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { WHITE_URL } from '../types/whiteUrl';
import AuthService from './auth.service';
import { ErrorHandler, SUCCESSFUL_RESPONSE } from './fetch.service';
import { warning } from './logging.service';
import { RETURN_CODE } from '../types/returnCode';
import { BASE_DOMAIN } from '../util/globalConstantUnit';
import languageService from './LanguageService';
import { strings } from './strings';

export const HEADERS_METHOD = Object.freeze({
  get: 'get',
  post: 'post',
  put: 'put',
  delete: 'delete',
  patch: 'patch',
});

// config axios settings
export const instanceOfAxios = async () => {
  try {
    const authService = new AuthService();
    const token = await authService.getToken();
    const userId = await authService.getUserId();
    const instanceOfAxios = axios.create({
      baseURL: BASE_DOMAIN,
    });
    instanceOfAxios.defaults.headers.common = {
      ...instanceOfAxios.defaults.headers.common,
      'Content-Type': 'application/json;charset=UTF-8',
      'Accept': 'application/json;charset=UTF-8',
      'access-token': token,
      'user_id': userId,
      'app-version': DeviceInfo.getVersion(),
      'locale': languageService.defaultLan,
      'timezone': DeviceInfo.getTimezone(),
    };
    return instanceOfAxios;
  } catch (e) {
    throw Error(e.message);
  }
};

export default (URL, _method, _bodyParams, errorCodeForPass) => {
  try {
    if (!URL || typeof URL !== 'string') throw Error('Invalid URL');
    if (!_method || typeof _method !== 'string' || !HEADERS_METHOD[_method]) throw Error('Invalid fetch method');

    const deferred = Q.defer();
    const errorHandler = new ErrorHandler();

    instanceOfAxios()
      .then(instance => {
        const configObj = {
          method: _method,
          url: URL,
        };
        switch (_method) {
          case HEADERS_METHOD.get:
            return instance({
              ...configObj,
              params: _bodyParams,
            });
          case HEADERS_METHOD.post:
            return instance({
              ...configObj,
              data: _bodyParams,
            });
          default:
            throw Error('Headrs Method is invalid!');
        }
      })
      .then((res) => {
        warning(res);
        const { data, status } = res;
        try {
          warning(data);
          if (data.return_code === SUCCESSFUL_RESPONSE.OK) {
            deferred.resolve(data);
          } else {
            // 사용자에게 에러메시지를 보여주지 않고 예외 처리하는경우
            // errorCodeForPass === data.return_code: api에서 특정 에러코드에 대한 알럿 처리 방지.
            if ((data && data.return_message && RETURN_CODE[data.return_code]) || (errorCodeForPass === data.return_code)) {
              console.log('errorCodeForPass', errorCodeForPass);
              deferred.reject(data);
            } else {
              // 사용자에게 에러메시지를 Alert경고창 형태로 보여주는 경우
              if (status !== SUCCESSFUL_RESPONSE.OK || data.return_code === 500) {
                data.return_message = strings.invalidAttempt;
              }
              return Q.delay().then(() => {
                throw Error(errorHandler.getErrorMsgForUser(data.return_message || strings.invalidAttempt));
              });
            }
          }
        } catch (e) {
          deferred.reject(errorHandler.getErrorMsgForUser(e.message));
        }
      })
      .catch(error => {
        if (error.response) {
          warning(error.response.data);
          warning(error.response.status);
          warning(error.response.headers);
        }
        warning('===================================================');
        if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          warning(error.request);
        }
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
    return deferred.promise;
  } catch (e) {
    warning(e.message);
  }
};



