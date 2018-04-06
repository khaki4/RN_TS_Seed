/**
 *
 * @param api
 * @param retryLimitCount: 무제한 retry를 하려면 falsy값을 할당.
 * @returns {Promise<*>}
 */
export default async (api, retryLimitCount = 5) => {
  // if (!api || typeof api !== 'function') {
  //   throw new TypeError('api is not a function');
  // }
  // let result = null;
  // let count = 0;
  // while (!result) {
  //   if (retryLimitCount && ++count > retryLimitCount) {
  //     console.log('retry count:', count);
  //     console.log('retry count over');
  //     return;
  //   }
  //   try {
  //     result = await api();
  //   } catch (e) {
  //     console.log('fail retry -', e.message);
  //   }
  // }

  console.log('retry passed!!!');
  return result;
};
