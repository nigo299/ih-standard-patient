import { useState, useCallback } from 'react';
import { navigateTo } from 'remax/one';
import { createContainer } from 'unstated-next';
import useApi, { PatientType } from '@/apis/usercenter';
import { analyzeIDCard } from '@/utils';
import storage from '@/utils/storage';
import { PLATFORM } from '@/config/constant';
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
  });
  // 绑定的患者列表
  const [bindPatientList, setBindPatientList] = useState<PatientType[]>([]);
  const [ocrInfo, setOcrInfo] = useState(defualtOcrInfo);
  const [faceInfo, setFaceInfo] = useState({
    name: '',
    idNo: '',
    success: false,
  });
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
          navigateTo({
            url: authUrl,
          });
          return Promise.reject();
        }
        if (!storage.get('openid') && PLATFORM === 'web') {
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
        setBindPatientList(data.cardList);
      } else {
        setDefaultPatientInfo({
          ...defaultPatientInfo,
          patientName: '',
          patientId: '',
          patCardNo: '',
          patientFullIdNo: '',
        });
        setBindPatientList([]);
      }
      return Promise.resolve(data.cardList || []);
    },
    [defaultPatientInfo, setBindPatientList, setDefaultPatientInfo],
  );
  const clearOcrInfo = useCallback(() => setOcrInfo(defualtOcrInfo), []);
  return {
    defaultPatientInfo,
    setDefaultPatientInfo,
    bindPatientList,
    setBindPatientList,
    getPatientList,
    ocrInfo,
    setOcrInfo,
    clearOcrInfo,
    faceInfo,
    setFaceInfo,
  };
});
