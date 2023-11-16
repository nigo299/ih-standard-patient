import { navigateTo } from 'remax/one';
import {
  axios,
  showToast,
  showLoading,
  hideLoading,
  showModal,
} from '@kqinfo/ui';
import { REQUEST_QUERY, PLATFORM } from '@/config/constant';
import storage from '@/utils/storage';
import { getCurrentPageUrl, jsonToQueryString, reLaunchUrl } from '@/utils';
import qs from 'qs';

/** 如果为true则无需跳转 */
let navFlag = false;
const NODE_ENV = process.env.NODE_ENV;
const DOMIN = process.env.REMAX_APP_REQUESET_DOMIN;
const instance = axios.create({
  baseURL: NODE_ENV === 'development' && PLATFORM === 'web' ? '' : DOMIN,
  headers:
    process.env.REMAX_APP_PLATFORM === 'development'
      ? {
          'Content-Type': 'application/json;charset=UTF-8',
          'ih-version': '3.24.0', //todo in-version是否有影响
        }
      : {
          'Content-Type': 'application/json;charset=UTF-8',
        },
  method: 'POST',
  timeout: 30000,
});

// /** 请求拦截器 */
instance.interceptors.request.use((config) => {
  if (
    !config.headers['x-showLoading'] &&
    config.headers['x-showLoading'] !== 'false'
  ) {
    showLoading({
      title: '加载中',
    });
  }

  if (config.url) {
    const params = qs.stringify({
      ...REQUEST_QUERY,
    });
    config.data = {
      ...config.data,
      ...REQUEST_QUERY,
    };
    config.url = `${config.url}${
      config.url.indexOf('?') > -1 ? '&' : '?'
    }${params}`;
    if (
      config.headers['Content-Type'] ===
        'application/x-www-form-urlencoded;charset=UTF-8' &&
      PLATFORM === 'web'
    ) {
      config.data = jsonToQueryString(config.data);
    }
  }
  const login_access_token = storage.get('login_access_token');
  if (login_access_token) {
    config.headers['Authorization'] = `Bearer ${login_access_token}`;
  }
  console.log('请求入参: ', config);
  return config;
});

// /** 响应拦截器 */
instance.interceptors.response.use(
  (response) => {
    console.log('响应拦截respons: ', response);
    hideLoading();
    const { data, status } = response as API.ResponseModel;
    if (status >= 200 && status < 300) {
      if (data.code === 1001) {
        navigateTo({
          url: `/pages/maintain/index?msg=${data.msg}`,
        });
        return Promise.reject(response);
      }
      if (data.code === 1002) {
        showToast({
          icon: 'fail',
          title: data.msg || '请求失败',
        });
        return Promise.reject(response);
      }
      // 需要完善就诊人信息
      if (data.code === 2001) {
        showModal({
          title: '提示',
          content: '请完善就诊人相关信息',
        }).then((res) => {
          if (res.confirm) {
            // TODO 根据实际情况来获取patientId
            let patientId = storage.get('patientId');
            if (typeof response.config?.data === 'string') {
              console.log('response.config', response.config);
              try {
                const res = JSON.parse(response?.config?.data);
                if (res.patientId) {
                  patientId = res.patientId;
                }
                console.log('res', res);
              } catch (err) {
                console.log('err', err);
              }
            }
            if (patientId) {
              navigateTo({
                url: `/pages2/usercenter/add-user/index?patientId=${patientId}`,
              });
            } else {
              navigateTo({
                url: `/pages2/usercenter/user-list/index`,
              });
            }
          }
        });
        return Promise.reject(response);
      }
      if (data.code === 999 || data.msg?.includes('token为空')) {
        // 需要授权
        storage.del('login_access_token');
        storage.del('openid');
        if (getCurrentPageUrl().indexOf('getuserinfo') > -1) {
          return Promise.reject(response);
        }
        if (navFlag) {
          return Promise.reject(response);
        }
        navFlag = true;
        const authUrl =
          PLATFORM === 'web'
            ? `/pages/auth/getuserinfo/index?jumpUrl=${encodeURIComponent(
                window.location.hash.slice(1),
              )}`
            : '/pages/auth/getuserinfo/index';
        setTimeout(() => {
          navFlag = false;
          if (PLATFORM === 'web') {
            reLaunchUrl(authUrl);
          } else if (!storage.get('getUserInfoPage')) {
            navigateTo({
              url: authUrl,
            });
          }
        }, 1000);
        return Promise.reject(response);
      }
      if (
        data.code !== 0 &&
        data.msg !== '授权code不能为空' &&
        data.msg !== '用户未登录' &&
        data.msg !== 'TOKEN 已失效' &&
        data.msg !== 'null' &&
        data.msg !== '空指针异常' &&
        !response.config.headers['x-showToast']
      ) {
        showToast({
          icon: 'fail',
          title: data.msg || '请求失败',
        });
        return Promise.reject(response);
      }
    } else {
      showToast({
        icon: 'fail',
        title: data.msg || '网络请求失败',
      });
      return Promise.reject(response);
    }
    console.log('请求出参: ', response.data);
    return response;
  },
  (e) => {
    showToast({
      icon: 'fail',
      title: '网络发生错误，请稍后重新操作!',
    });
    return Promise.reject(e);
  },
);
export default instance;
