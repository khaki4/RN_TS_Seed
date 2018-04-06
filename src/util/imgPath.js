import languageService from '../service/LanguageService';
import { warning } from '../service/logging.service';
import gl from './globalImgPath';
import ko from './koImgPath';

const imgPathObj = { gl, ko };

console.log('defaultLan for img:', languageService.defaultLan);

export const getImgPath = () => {
  const isKorean = languageService.defaultLan === 'ko';
  const path = isKorean ? 'ko' : 'gl';
  return imgPathObj[path];
};

