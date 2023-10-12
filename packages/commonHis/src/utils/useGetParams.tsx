import { useQuery } from '@kqinfo/ui';

/**
 * 将当前路径url字符串转为对象格式
 */

const useGetParams: <T>() => T = () => {
  const query = useQuery();
  if (process.env.REMAX_PLATFORM === 'web') {
    return getWebParams() as any;
  } else {
    return query;
  }
};

export default useGetParams;

export const getWebParams: <T>() => T = () => {
  const res = {} as any;
  const queryStrList = window.location.href.split('?');
  const queryStr = queryStrList[queryStrList.length - 1];
  if (!queryStr) {
    return {};
  }
  const strList = queryStr.split('&');
  strList.forEach((str) => {
    const key = str.split('=')[0];
    const value = window.decodeURI(str.split('=')[1]);
    if (res[key]) {
      if (typeof res[key] === 'string') {
        res[key] = [res[key], value];
      } else {
        res[key].push(value);
      }
    } else {
      res[key] = value;
    }
  });
  return res;
};
