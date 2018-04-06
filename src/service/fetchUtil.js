import Q from 'q';
import { BASE_DOMAIN } from '../util/globalConstantUnit';
import {
  fetchDataFromUrlByGet,
  fetchDataFromUrlByPost,
  fetchDataFromUrlByPostForArrayParams,
  fetchDataFromUrlByPostForMultipartFile,
} from './fetch.service';

export const APIHandler = (fetchDataType, URL, errorCodeForPass) => {
  if (
    fetchDataType !== fetchDataFromUrlByGet
    && fetchDataType !== fetchDataFromUrlByPost
    && fetchDataType !== fetchDataFromUrlByPostForArrayParams
    && fetchDataType !== fetchDataFromUrlByPostForMultipartFile
  ) throw Error('invalid fetchDataType');

  const _URL = BASE_DOMAIN + URL;

  return (bodyParams) => {
    const deferred = Q.defer();
    const success = res => {
      deferred.resolve(res);
    };
    const fail = (reason) => {
      deferred.reject(reason);
    };
    fetchDataType(_URL, bodyParams, errorCodeForPass).then(success, fail).catch(fail);
    return deferred.promise;
  };
};