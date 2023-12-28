import { useState, useCallback, useMemo } from 'react';
import { navigateTo } from 'remax/one';
import { createContainer } from 'unstated-next';
import useApi, { PatientType } from '@/apis/usercenter';
import { analyzeIDCard, decrypt, isYuKangJianH5 } from '@/utils';
import storage from '@/utils/storage';
import { PLATFORM } from '@/config/constant';
import { typedStorage } from '@/utils/typedStorage';
export interface OcrInfoType {
  address: string;
  birth: string;
  name: string;
  nationality: string;
  num: string;
  request_id: string;
  sex: string;
  type: 'adult' | 'children' | 'parent';
}

const defualtOcrInfo: OcrInfoType = {
  address: '',
  birth: '',
  name: '',
  nationality: '',
  num: '',
  request_id: '',
  sex: '',
  type: 'adult',
};
export default createContainer(() => {
  // 默认绑定的患者信息
  const [defaultPatientInfo, setDefaultPatientInfo] = useState<PatientType>({
    bindMedicareCard: 0,
    bindStatus: 1,
    healthCardFlag: 0,
    birthday: '',
    idNo: '',
    idType: 1,
    idTypeName: '',
    isDefault: 1,
    patCardNo: '',
    patCardNoEncry: '',
    patCardType: 21,
    patCardTypeName: '',
    patHisNo: '',
    patInNo: '',
    patientFullIdNo: '',
    patientId: '',
    patientMobile: '',
    patientFullMobile: '',
    patientName: '',
    patientSex: 'M',
    relationName: '',
    relationType: 5,
    parentIdType: '',
    healthCardId: '',
    patientNameSimple: '',
    encryptIdNo: '',
    encryptPatientIdNo: '',
    encryptPatientMobile: '',
    encryptPatientName: '',
  });
  const [selectPatientInfo, setSelectPatientInfo] = useState<PatientType>();
  const [decryptPatName, setDecryptPatName] = useState<string | boolean>(
    typedStorage.get('decryptPatName') || false,
  ); // 是否解密患者姓名
  // 绑定的患者列表
  const [originalBindPatientList, setOriginalBindPatientList] = useState<
    PatientType[]
  >([]);
  const [ocrInfo, setOcrInfo] = useState(defualtOcrInfo);
  const [faceInfo, setFaceInfo] = useState<{
    name: string;
    idNo: string;
    success: boolean;
    checkMedical?: boolean;
  }>({
    name: '',
    idNo: '',
    success: false,
  });
  const [needGuardian, setNeedGuardian] = useState(false);
  const bindPatientList = useMemo(() => {
    if (decryptPatName) {
      return originalBindPatientList.map((item) => {
        return {
          ...item,
          patientName: decrypt(item.encryptPatientName),
        };
      });
    }
    return originalBindPatientList;
  }, [originalBindPatientList, decryptPatName]);
  const getPatientList = useCallback(
    async (
      jump?: boolean /** jump属性避免在小程序请求接口多次跳转授权页面 */,
      setDefaultUser = true,
    ): Promise<PatientType[]> => {
      if (process.env.REMAX_APP_PLATFORM !== 'app') {
        // 因为接口不注册也可以获取就诊人，这里前端做了限制必须注册才能获取就诊人列表
        const authUrl =
          PLATFORM === 'web'
            ? `/pages/auth/getuserinfo/index?jumpUrl=${encodeURIComponent(
                window.location.hash.slice(1),
              )}`
            : '/pages/auth/getuserinfo/index';
        if (!storage.get('login_access_token') && !jump) {
          if (!isYuKangJianH5()) {
            navigateTo({
              url: authUrl,
            });
          } else {
            navigateTo({
              url: '/pages/otherLogin/index',
            });
          }

          return Promise.reject();
        }
        if (!storage.get('openid') && PLATFORM === 'web' && !isYuKangJianH5()) {
          navigateTo({
            url: '/pages/auth/login/index',
          });

          return Promise.resolve([]);
        }
      }
      const { data } = await useApi.获取就诊人列表.request();
      if (data?.cardList && data?.cardList.length >= 1) {
        if (setDefaultUser) {
          data.cardList.map((patient: PatientType) => {
            patient.patientAge =
              patient?.patientAge ||
              analyzeIDCard(patient?.patientFullIdNo)?.analyzeAge;
            if (patient?.isDefault === 1) {
              setDefaultPatientInfo({
                ...patient,
              });
            }
          });
        }
        setOriginalBindPatientList(data?.cardList);
      } else {
        setDefaultPatientInfo({
          ...defaultPatientInfo,
          patientName: '',
          patientId: '',
          patCardNo: '',
          patientFullIdNo: '',
        });
        setOriginalBindPatientList([]);
      }
      return Promise.resolve(data.cardList || []);
    },
    [defaultPatientInfo, setOriginalBindPatientList, setDefaultPatientInfo],
  );
  const clearOcrInfo = useCallback(() => setOcrInfo(defualtOcrInfo), []);
  return {
    defaultPatientInfo,
    setDefaultPatientInfo,
    originalBindPatientList,
    setOriginalBindPatientList,
    bindPatientList,
    getPatientList,
    ocrInfo,
    setOcrInfo,
    clearOcrInfo,
    faceInfo,
    setFaceInfo,
    decryptPatName,
    setDecryptPatName: useCallback((isDecrypt: boolean) => {
      typedStorage.set('decryptPatName', isDecrypt);
      setDecryptPatName(isDecrypt);
    }, []),
    needGuardian,
    setNeedGuardian,
    selectPatientInfo,
    setSelectPatientInfo,
  };
});
