import storage from '@/utils/storage';
import { getUrlParams } from '@/utils';
import useLoginApi, { EncDataParamsType, DecryptDataType } from '@/apis/login';
import { REQUEST_QUERY } from '@/config/constant';

/**
 * 医保解密授权支付方法
 * @param {String} url 带起encryData的url链接
 * @param {Boolean} payAuth 是否需要获取医保授权url逻辑
 */
export default async (url?: string, payAuth = true) =>
  new Promise<DecryptDataType | void>(async (resolve, reject) => {
    if (process.env.REMAX_APP_PLATFORM === 'app') {
      const authUrl = storage.get('authUrl') || '';
      const { appId, encData, signData, encType, signType, version } =
        getUrlParams<EncDataParamsType>(url || authUrl);
      if (!encData && !appId) {
        return;
      }
      const {
        data: { decryptData },
      } = await useLoginApi.医保app跳转h5加解密.request({
        appId,
        signData,
        encType,
        encData,
        signType,
        version,
      });
      if (!decryptData.payAuthNo && payAuth) {
        storage.set('idNo', decryptData.idNo);
        storage.set('mobile', decryptData.mobile);
        const { data } = await useLoginApi.获取授权url.request({
          appChnlId: decryptData.appChnlId,
          name: decryptData.name,
          fixNo: '',
          idNo: decryptData.idNo,
          chnlUserId: decryptData.chnlUserId,
          hisId: REQUEST_QUERY.hisId,
          bizChannel: 'medinsure',
          callBack: window.location.href.split('&encData')[0],
        });
        if (data?.url) {
          window.location.href = data?.url;
        }
      } else {
        resolve(decryptData);
      }
      reject();
    } else {
      resolve();
    }
  });
