import CryptoJS from 'crypto-js';
import { PLATFORM } from '@/config/constant';
import { reLaunch, redirectTo } from 'remax/one';
import dayjs from 'dayjs';
import * as uuid from 'uuid';
import md5 from 'md5';
import { OrderDetailType } from '@/apis/register';
import storage from './storage';
export const reLaunchUrl = (url: string) => {
  if (PLATFORM === 'web') {
    redirectTo({
      url,
    });
  } else {
    reLaunch({
      url,
    });
  }
};

export const isDev = () => {
  return process.env.NODE_ENV !== 'production';
};

export const sleep = (time: number) => {
  return new Promise((resolve: any) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

export const getCurrentMonthOrDay = (date: Date) =>
  `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

export const getCurrentPageUrl = (): string => {
  let url = '';
  try {
    if (PLATFORM === 'web') {
      url = window.location.hash.slice(1);
    } else {
      const pages = window?.getCurrentPages?.();
      if (pages) {
        const currentPage = pages[pages.length - 1];
        url = `/${currentPage.route}`;
      }
    }
  } catch (error) {
    console.error('error', error);
  }
  return url;
};

export function formDate(dateForm: string | number | Date) {
  if (String(dateForm)?.indexOf('T') > -1) {
    const dateee = new Date(dateForm).toJSON();
    const date = new Date(+new Date(dateee) + 8 * 3600 * 1000)
      .toISOString()
      .replace(/T/g, ' ')
      .replace(/\.[\d]{3}Z/, '');
    return date;
  } else {
    // 后端格式改了，不需要处理时间格式
    return String(dateForm);
  }
}

export const analyzeIDCard = (idcard: string) => {
  let analyzeBirth, analyzeSex, analyzeAge;
  if (idcard?.length === 15) {
    let birthdayValue = '';
    birthdayValue = idcard.charAt(6) + idcard.charAt(7);
    if (parseInt(birthdayValue) < 10) {
      analyzeBirth =
        '20' +
        idcard.substr(6, 2) +
        '-' +
        idcard.substr(8, 2) +
        '-' +
        idcard.substr(10, 2);
    } else {
      analyzeBirth =
        '19' +
        idcard.substr(6, 2) +
        '-' +
        idcard.substr(8, 2) +
        '-' +
        idcard.substr(10, 2);
    }
    analyzeSex = parseInt(idcard.substr(14, 1), 10) % 2 === 1 ? 'M' : 'F';
  }
  if (idcard?.length === 18) {
    analyzeBirth =
      idcard.substr(6, 4) +
      '-' +
      idcard.substr(10, 2) +
      '-' +
      idcard.substr(12, 2);
    analyzeSex = parseInt(idcard.substr(16, 1), 10) % 2 === 1 ? 'M' : 'F';
  }
  const birthDate = new Date(analyzeBirth || '');
  const nowDateTime = new Date();
  analyzeAge = nowDateTime.getFullYear() - birthDate.getFullYear();
  //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
  if (
    nowDateTime.getMonth() < birthDate.getMonth() ||
    (nowDateTime.getMonth() === birthDate.getMonth() &&
      nowDateTime.getDate() < birthDate.getDate())
  ) {
    analyzeAge--;
  }
  return {
    analyzeAge,
    analyzeSex,
    analyzeBirth,
  };
};

export const getAgeByBirthDay = (birthDay?: string): number | undefined => {
  if (!birthDay) {
    return undefined;
  }
  return dayjs().diff(birthDay, 'years');
};

//验证规则
export const validator = {
  idCard(val = '') {
    val = val.replace(/(^\s*)|(\s*$)/g, '');
    val = val.toUpperCase();
    const len = (val || '').length;

    if (len === 0) {
      return { ret: false, tip: '证件不能为空' };
    }
    if (len !== 18 && len !== 15) {
      return { ret: false, tip: '证件格式错误' };
    }
    // 15位的身份证，验证了生日是否有效
    if (len === 15) {
      const year: any = val.substring(6, 8);
      const month = val.substring(8, 10);
      const day = val.substring(10, 12);
      const tempDate: any = new Date(
        year,
        parseFloat(month) - 1,
        parseFloat(day),
      );
      if (
        tempDate.getYear() !== parseFloat(year) ||
        tempDate.getMonth() !== parseFloat(month) - 1 ||
        tempDate.getDate() !== parseFloat(day)
      ) {
        return { ret: false, tip: '证件格式错误' };
      }
      return { ret: true };
    }
    // 18位的身份证，验证最后一位校验位
    if (len === 18) {
      // 身份证的最后一为字符
      const endChar = val.charAt(len - 1);
      val = val.substr(0, 17);
      const table: any[] = [
        7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2,
      ];
      const table2 = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
      const cNum = [];
      for (let i = 0; i < val.length; i++) {
        cNum[i] = val.charAt(i);
      }
      let sum = 0;
      for (let i = 0; i < cNum.length; i++) {
        // 其中(cNum[i]-48)表示第i位置上的身份证号码数字值，table[i]表示第i位置上的加权因子，
        const num = cNum[i].charCodeAt(0);
        const num1 = parseInt(table[i], 10);
        sum = sum * 1 + (num - 48) * num1;
      }
      // 以11对计算结果取模
      const index = Number(sum % 11);
      // 根据模的值得到对应的校验码,即身份证上的最后一位为校验码
      const verfiyCode = table2[index];
      if (endChar !== verfiyCode) {
        return { ret: false, tip: '证件格式错误' };
      }
      return { ret: true };
    }
  },
};

export const checkPhoneForm = (phone: string) => /^1[0-9]{10}$/.test(phone);

export const checkChinese = (val: string) => /^[\u4E00-\u9FA5]+$/.test(val);

export const returnUrl = () => {
  const { protocol, host, pathname } = window.location;
  const url = `${protocol}//${host}${pathname}`;
  return url;
};

interface JsonToQueryStringType {
  [propName: string]: any;
}

export const jsonToQueryString = (json: JsonToQueryStringType) => {
  if (Object.prototype.toString.call(json) === '[object Object]') {
    const result = Object.keys(json)
      .map((key) => {
        if (json[key] instanceof Array) {
          return Object.keys(json[key])
            .map((k) => {
              return `${encodeURIComponent(key)}=${encodeURIComponent(
                json[key][k],
              )}`;
            })
            .join('&');
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`;
      })
      .join('&');
    return result;
  }
};

export const paddingLeftZero = (n: number) => {
  if (n < 10) {
    return '0' + n;
  } else {
    return '' + n;
  }
};
/**
 * date 传入毫秒
 */
export const date2hour = (date = 0) => {
  if (isNaN(date)) {
    return '00:00';
  }
  const hour = Math.floor(date / (1000 * 60 * 60));
  const minute = Math.floor((date % (1000 * 60 * 60)) / (1000 * 60));
  const second = Math.floor((date % (1000 * 60)) / 1000);
  if (hour === 0) {
    return `${paddingLeftZero(minute)}:${paddingLeftZero(second)}`;
  }
  return `${paddingLeftZero(hour)}:${paddingLeftZero(minute)}:${paddingLeftZero(
    second,
  )}`;
};

export const encryptIdNo = (str?: string) => {
  if (null != str && str != undefined) {
    const pat = /(\d{1})\d*(\d{1})/;
    return str.replace(pat, '$1****************$2');
  } else {
    return '';
  }
};

export const encryptPhone = (str: string) => {
  if (null != str && str != undefined) {
    const pat = /(\d{3})\d*(\d{2})/;
    return str.replace(pat, '$1******$2');
  } else {
    return '';
  }
};

export const encryptName = (str?: string) => {
  if (null != str && str != undefined) {
    if (str.length === 2) {
      return '**' + str.substring(1, str.length);
    } else if (str.length === 3) {
      return '**' + str.substring(2, str.length);
    } else if (str.length >= 4) {
      return '***' + str.substring(3, str.length);
    } else if (str.length > 6) {
      return str.substring(-1) + '*****' + str.substring(6, str.length);
    }
  } else {
    return '';
  }
};

export const getBrowserUa = () => {
  const ua = navigator?.userAgent?.toLowerCase();
  const testUa = (regexp: RegExp) => regexp.test(ua);
  if (testUa(/micromessenger/g)) {
    return 'wechat'; // 微信浏览器
  } else if (testUa(/alipayclient/g)) {
    return 'alipay'; // 支付宝浏览器
  } else if (testUa(/android|adr/g)) {
    return 'android'; // android浏览器
  } else if (testUa(/ios|iphone|ipad|ipod|iwatch/g)) {
    return 'ios'; // ios浏览器
  }
};

export const getUrlParams: <T>(url: string) => T = (url: string) => {
  const res = {} as any;
  const queryStrList = url.split('?');
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

// 秘钥
const CRYPTOJSKEY = 'uOPwZ4VpcxdEgfy3';
// 加密
export const encrypt = (plaintText = '') => {
  if (!plaintText) return;
  const options = {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  };
  const key = CryptoJS.enc.Utf8.parse(CRYPTOJSKEY);
  const encryptedData = CryptoJS.AES.encrypt(plaintText, key, options);
  let encryptedBase64Str = encryptedData.toString().replace(/\//g, '_');
  encryptedBase64Str = encryptedBase64Str.replace(/\+/g, '-');
  return encryptedBase64Str;
};
// 口腔医院DES加密
export const encryptDes = (plaintText = '') => {
  if (!plaintText) return;
  const key = CryptoJS.enc.Utf8.parse('0eb78322'); // 密钥
  const iv = CryptoJS.enc.Utf8.parse('0eb78322'); // 向量
  const ciphertext = CryptoJS.DES.encrypt(plaintText, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const encryptedHexStr = ciphertext.ciphertext.toString(CryptoJS.enc.Hex);
  return encryptedHexStr;
};
// 解密
export const decrypt = (encryptedBase64Str = '') => {
  if (!encryptedBase64Str) return;
  const vals = encryptedBase64Str.replace(/\-/g, '+').replace(/_/g, '/');
  const options = {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  };
  const key = CryptoJS.enc.Utf8.parse(CRYPTOJSKEY);
  const decryptedData = CryptoJS.AES.decrypt(vals, key, options);
  const decryptedStr = CryptoJS.enc.Utf8.stringify(decryptedData);
  return decryptedStr;
};

export const parseAge = (val: string): number => {
  const year = val.indexOf('岁');
  if (year > -1) {
    return Number(val.slice(0, year));
  }
  if (val.includes('月') || val.includes('天')) {
    /** 小于12个月 */
    return 0;
  }
  return Number(val);
};

export const getPatientAge = (val: string | undefined | number): string => {
  if (!val) return '未知';
  if (typeof val === 'number') return val + '岁';
  if (val.includes('岁')) {
    return val;
  }
  return val + '岁';
};
export const useMd5 = (value: string) => {
  return md5(`${value}ASJAS98ASD8A9S8DA98SD8AS98D`);
};
// 生成文件名称
export function filerName(last: string, dir = 'VOICE/'): string {
  const myDate = new Date();
  const ossPath = dir;
  const year = myDate.getFullYear();
  let month;
  let day;
  if (myDate.getMonth() + 1 < 10) {
    month = '0' + myDate.getMonth() + 1;
  } else {
    month = myDate.getMonth() + 1;
  }
  if (myDate.getDate() < 10) {
    const d = myDate.getDate() + 1;
    day = '0' + d;
  } else {
    day = myDate.getDate();
  }

  const m = ossPath + year + '/' + month + '/' + day + '/';

  const filename = m + uuid.v4() + '.' + last; //名称
  return filename;
}
//判断渝康健环境
export const isYuKangJianH5 = () => {
  if (process.env.REMAX_PLATFORM === 'web') {
    return (
      window.location.href.includes('localhost') ||
      window.location.href.includes('mdmis.cq12320.cn')
    );
  } else {
    return false;
  }
};
export const goHealthUrl = (orderDetail: OrderDetailType) => {
  return `${
    window.location.href.includes('tihs')
      ? 'https://healthapp.cqkqinfo.com/next-H5App-p40064/#/pages/goods/index?id=0'
      : 'https://healthmall.cqkqinfo.com/H5App-p40064/#/pages/goods/index?id=0'
  }&openId=${storage.get('openid')}&clinicNo=${
    orderDetail?.hisRecepitNo
  }&clinicDate=${formDate(orderDetail?.visitDate).slice(0, 10)}&timeDesc=${
    orderDetail?.visitBeginTime
  }-${orderDetail?.visitEndTime}&patientId=${orderDetail?.patientId}&deptNo=${
    orderDetail?.deptNo
  }&deptName=${orderDetail?.deptName}&doctorName=${
    orderDetail?.doctorName
  }&visitWeekName=${orderDetail?.visitWeekName}&doctorTitle=${
    orderDetail?.doctorTitle
  }&patCardNo=${orderDetail?.patCardNo}&hisToken=${storage.get(
    'login_access_token',
  )}`;
};
