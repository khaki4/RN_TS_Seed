import LocalizedStrings from 'react-native-localization';
import intergration from '../../assets/strings/intergration';
import byAccount from '../../assets/strings/byAccount';

const extractLanJson = JSONByAccount => _intergrationJSON => _lan => {
  if (typeof _lan !== 'string') throw Error('_lan must be string');
  const keysOfJSONByAccount = Object.keys(JSONByAccount);
  for (const _key of keysOfJSONByAccount) {
    if (_intergrationJSON[_key]) {
      const subKeysOfIntergrationJSON = Object.keys(_intergrationJSON[_key]);
      for (const _lanKey of subKeysOfIntergrationJSON) {
        _intergrationJSON[_key][_lanKey] = {
          "kr": JSONByAccount[_key]["kr"][_lanKey],
          "global": JSONByAccount[_key]["global"][_lanKey]
        };
      }
    }
  }

  const keysOfIntergrationJSON = Object.keys(_intergrationJSON);
  const obj = {};
  for (const _key of keysOfIntergrationJSON) {
    obj[_key] = _intergrationJSON[_key][_lan];
  }
  return obj;
};


const extractSeleledLanJson = extractLanJson(byAccount)(intergration);
const en = extractSeleledLanJson('en');
const ko = extractSeleledLanJson('ko');
const ja = extractSeleledLanJson('ja');
const es = extractSeleledLanJson('es');

const strings = new LocalizedStrings({ en, ko, ja, es });

export { strings };
