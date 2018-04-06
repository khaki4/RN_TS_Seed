import { fetchDataFromUrlByGet, fetchDataFromUrlByPost, fetchDataFromUrlByPostForMultipartFile } from './fetch.service';
import RESTfulService, { HEADERS_METHOD } from './RESTful-service';
import { APIHandler } from './fetchUtil';

export const getProfile         = APIHandler(fetchDataFromUrlByGet, '/api/v3/user/getProfile');
export const verifyCodeExt      = APIHandler(fetchDataFromUrlByPost, '/api/v3/user/verifyCodeExt');
export const updateProfile      = APIHandler(fetchDataFromUrlByPost, '/api/v3/user/updateProfile');
export const updateProfileImg   = APIHandler(fetchDataFromUrlByPostForMultipartFile, '/api/v3/user/updateProfileImg');
export const change_password    = APIHandler(fetchDataFromUrlByPost, '/api/v3/user/change_password');
export const updatePushToken    = APIHandler(fetchDataFromUrlByPost, '/api/v3/user/updatePushToken');
export const getGlobalInfo      = APIHandler(fetchDataFromUrlByGet, '/api/v3/user/getGlobalInfo');
export const findAccount        = APIHandler(fetchDataFromUrlByPost, '/api/v3/user/findAccount');
export const resetPassword      = APIHandler(fetchDataFromUrlByPost, '/api/v3/user/resetPassword');

export const changeLanguage = (bodyParams) => RESTfulService(`/api/v3/user/changeLanguage`, HEADERS_METHOD.post, bodyParams);