import React, { useMemo, useState, useCallback } from 'react';
import { View, navigateBack, Image, Text } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import {
  Space,
  Shadow,
  Picker,
  PartTitle,
  Button,
  Loading,
  showToast,
} from '@kqinfo/ui';
import showModal from '@/utils/showModal';
import useGetParams from '@/utils/useGetParams';
import {
  recommendInTypePick,
  recommentText,
  adultIdTypePick,
} from './config/pickerOptions';
import { IMAGE_DOMIN, PLATFORM } from '@/config/constant';
import { LabelText, WhiteSpace, Tip } from '@/components';
import useApi from '@/apis/common';
import patientState, { OcrInfoType } from '@/stores/patient';
import globalState from '@/stores/global';
import styles from './index.less';
import { useChooseImage } from '@/hooks';
import uploadFile from '@/utils/uploadFile';

export enum IdTypeMap {
  idcard = '1',
  medical = '2',
  register = '3',
  gangao = '4',
  passport = '5',
  birth = '6',
  none = '7',
}

export default () => {
  const { initWxSDK } = globalState.useContainer();
  const { setOcrInfo, ocrInfo } = patientState.useContainer();
  const { type = 'children' } = useGetParams<{
    type: 'adult' | 'children' | 'parent';
  }>();
  const chooseImage = useChooseImage();
  const [loading, setLoading] = useState(false);
  const [idType, setIdType] = useState(IdTypeMap.idcard);
  const placeBg = useMemo(() => {
    if (!idType) {
      return `${IMAGE_DOMIN}/upload/id.png`;
    }
    switch (idType) {
      //身份证
      case IdTypeMap.idcard:
        return `${IMAGE_DOMIN}/upload/id.png`;
      //医保卡
      case IdTypeMap.medical:
        return `${IMAGE_DOMIN}/upload/medicalCard.png`;
      //户口本
      case IdTypeMap.register:
        return `${IMAGE_DOMIN}/upload/register.png`;
      //港澳通行
      case IdTypeMap.gangao:
        return `${IMAGE_DOMIN}/upload/gangao.png`;
      //护照
      case IdTypeMap.passport:
        return `${IMAGE_DOMIN}/upload/passport.png`;
      //出生医学证明
      case IdTypeMap.birth:
        return `${IMAGE_DOMIN}/upload/birth.png`;
    }
    return `${IMAGE_DOMIN}/upload/id.png`;
  }, [idType]);
  const tipText = useMemo(() => {
    if (type === 'children') {
      return '您的身份信息仅用于在线建立我院实名就医档案，我院将对您提供的信息严格保密，建议使用身份证；';
    }
    if (type === 'adult') {
      return '成人绑卡后只可预约核酸检测号源，现仅支持身份证注册，平台陆续会开放其他证件注册，我院将对您提供的信息严格保密；';
    }
    if (type === 'parent') {
      return '依照政策法规，低龄儿童(6岁以下)诊疗过程中需监护人陪伴，现仅支持身份证快速识别，我们将对您提供的信息严格保密；';
    }
    return '';
  }, [type]);

  const templateList = useMemo(() => {
    const list = [
      {
        img: `${IMAGE_DOMIN}/upload/idcard/right.png`,
        result: `${IMAGE_DOMIN}/upload/true.png`,
        text: '标准',
      },
      {
        img: `${IMAGE_DOMIN}/upload/idcard/wrong1.png`,
        result: `${IMAGE_DOMIN}/upload/false.png`,
        text: '边框缺失',
      },
      {
        img: `${IMAGE_DOMIN}/upload/idcard/wrong2.png`,
        result: `${IMAGE_DOMIN}/upload/false.png`,
        text: '照片模糊',
      },
      {
        img: `${IMAGE_DOMIN}/upload/idcard/wrong3.png`,
        result: `${IMAGE_DOMIN}/upload/false.png`,
        text: '闪光过度',
      },
    ];
    if (idType === IdTypeMap.birth) {
      list[0].img = `${IMAGE_DOMIN}/upload/birth/right.png`;
      list[1].img = `${IMAGE_DOMIN}/upload/birth/wrong1.png`;
      list[2].img = `${IMAGE_DOMIN}/upload/birth/wrong2.png`;
      list[3].img = `${IMAGE_DOMIN}/upload/birth/wrong3.png`;
    }
    if (idType === IdTypeMap.gangao) {
      list[0].img = `${IMAGE_DOMIN}/upload/gangao/right.png`;
      list[1].img = `${IMAGE_DOMIN}/upload/gangao/wrong1.png`;
      list[2].img = `${IMAGE_DOMIN}/upload/gangao/wrong2.png`;
      list[3].img = `${IMAGE_DOMIN}/upload/gangao/wrong3.png`;
    }
    if (idType === IdTypeMap.medical) {
      list[0].img = `${IMAGE_DOMIN}/upload/medical/right.png`;
      list[1].img = `${IMAGE_DOMIN}/upload/medical/wrong1.png`;
      list[2].img = `${IMAGE_DOMIN}/upload/medical/wrong2.png`;
      list[3].img = `${IMAGE_DOMIN}/upload/medical/wrong3.png`;
    }
    if (idType === IdTypeMap.passport) {
      list[0].img = `${IMAGE_DOMIN}/upload/passport/right.png`;
      list[1].img = `${IMAGE_DOMIN}/upload/passport/wrong1.png`;
      list[2].img = `${IMAGE_DOMIN}/upload/passport/wrong2.png`;
      list[3].img = `${IMAGE_DOMIN}/upload/passport/wrong3.png`;
    }
    if (idType === IdTypeMap.register) {
      list[0].img = `${IMAGE_DOMIN}/upload/register/right.png`;
      list[1].img = `${IMAGE_DOMIN}/upload/register/wrong1.png`;
      list[2].img = `${IMAGE_DOMIN}/upload/register/wrong2.png`;
      list[3].img = `${IMAGE_DOMIN}/upload/register/wrong3.png`;
    }

    return list;
  }, [idType]);

  const tipConfig = useMemo(() => {
    if (idType === IdTypeMap.medical) {
      return {
        title: '拍摄医保卡要求',
        subTitle: '大陆公民持有的本人有效医保卡原件；',
      };
    }
    if (idType === IdTypeMap.register) {
      return {
        title: '拍摄户口簿要求',
        subTitle: '就诊人持有的户口簿原件本人页；',
      };
    }
    if (idType === IdTypeMap.gangao) {
      return {
        title: '拍摄港澳台通行证要求',
        subTitle: '就诊人持有的本人有效港澳台通行证原件；',
      };
    }
    if (idType === IdTypeMap.passport) {
      return {
        title: '拍摄护照要求',
        subTitle: '就诊人持有的本人有效护照原件；',
      };
    }
    if (idType === IdTypeMap.birth) {
      return {
        title: '拍摄出生医学证明',
        subTitle: '不足45天新生儿持有的有效出生医学证明原件；',
      };
    }
    return {
      title: '拍摄身份证要求',
      subTitle: '大陆公民持有的本人有效二代身份证原件；',
    };
  }, [idType]);

  /** 上传图片 */
  const handleUpload = useCallback(async () => {
    try {
      const file = await chooseImage({
        maxLength: 1,
      });
      const result = file[0];
      setLoading(true);
      if (result) {
        const { data } = await useApi.基础能力平台token获取.request();
        if (data) {
          const formData = PLATFORM === 'web' && {
            formData: {
              file: result?.file,
            },
          };
          const res: any = await uploadFile({
            url: `https://wx.cqkqinfo.com/basicapi/basic/ocr/ocrImage?basic_token=${data}`,
            name: 'file',
            fileType: 'image',
            filePath: PLATFORM === 'web' ? result?.file?.name : result?.file,
            ...formData,
          });
          if (res) {
            setLoading(false);
          }
          let ocr;
          if (Object.prototype.toString.call(res) === '[object String]') {
            ocr = JSON.parse(res).data.data as OcrInfoType;
            if (ocr?.num) {
              setOcrInfo({
                ...ocr,
                type,
              });
            }
          }
          // 小程序端和公众号返回格式不一致
          if (Object.prototype.toString.call(res.data) === '[object String]') {
            ocr = JSON.parse(res.data).data as OcrInfoType;
            if (ocr?.num) {
              setOcrInfo({
                ...ocr,
                type,
              });
            }
          }
          if (!ocr) {
            showModal({
              title: '提示',
              content:
                '身份证无法识别，拍摄时确保个人信息页边框完整，字体清晰，亮度均匀！',
              showCancel: false,
              confirmText: '重新拍摄',
            });
          }
        } else {
          showToast({
            icon: 'none',
            title: 'ocr获取失败，请稍后重试!',
          });
        }
      }
    } catch (error) {
      setLoading(false);
      console.log('errror', error);
    }
  }, [chooseImage, setOcrInfo, type]);
  usePageEvent('onShow', () => {
    initWxSDK();
    setNavigationBar({
      title: '上传证件',
    });
  });
  return (
    // <View className={styles.page}>
    //   <PartTitle bold>上传证件照片</PartTitle>
    // </View>
    <View className={styles.page}>
      {loading && <Loading content="识别中..." />}
      <PartTitle bold>
        {type === 'parent'
          ? 'OCR快速识别监护人证件信息'
          : 'OCR快速识别成人就诊人证件信息'}
      </PartTitle>
      <Shadow card>
        <View className={styles.card}>
          <View className={styles.title}>{tipText}</View>
          <Picker
            cols={1}
            data={type === 'children' ? recommendInTypePick : adultIdTypePick}
            value={idType}
            onChange={(v: any) => {
              setIdType(v);
            }}
          >
            {(v) => {
              return (
                <View className={styles.picker}>
                  <View className={styles.label}>证件类型</View>
                  <Space alignItems="center">
                    <View className={v ? styles.value : styles.placeholder}>
                      {v
                        ? String(v)?.replace(recommentText, '')
                        : '请选择证件类型'}
                    </View>
                    <Image
                      src={`${IMAGE_DOMIN}/usercenter/down.png`}
                      className={styles.icon}
                    />
                  </Space>
                </View>
              );
            }}
          </Picker>
          <View
            className={styles.idWrap}
            onTap={() => {
              if (!ocrInfo.num) {
                handleUpload();
              }
            }}
          >
            <Image src={placeBg} className={styles.id} />
            <View className={styles.cameraWrap}>
              <Image
                src={
                  ocrInfo?.num
                    ? `${IMAGE_DOMIN}/upload/success.png`
                    : `${IMAGE_DOMIN}/upload/camera.png`
                }
                className={styles.camera}
              />
            </View>
          </View>
          <View className={styles.idTip}>请确保证件类型和实际上传图片一致</View>
        </View>
      </Shadow>
      <WhiteSpace />
      <WhiteSpace />
      {!ocrInfo?.num ? (
        <>
          <Tip
            title="拍摄身份证要求"
            items={[
              <React.Fragment key="1">
                <View className={styles.tipItem}>{tipConfig.subTitle}</View>
                <View className={styles.tipItem}>
                  拍摄时确保个人信息页
                  <Text className={styles.important}>
                    边框完整，字体清晰，亮度均匀;
                  </Text>
                </View>
              </React.Fragment>,
            ]}
          />
          <Space
            justify="space-between"
            alignItems="center"
            flexWrap="wrap"
            className={styles.template}
          >
            {templateList.map((item, index) => (
              <View className={styles.templateItem} key={index}>
                <View className={styles.templateImgs}>
                  <Image src={item.img} className={styles.templateImg} />
                  <Image src={item.result} className={styles.templateResult} />
                </View>
                <View className={styles.templateText}>{item.text}</View>
              </View>
            ))}
          </Space>
        </>
      ) : (
        <>
          <Shadow card>
            <View className={styles.lists}>
              <LabelText label="姓名" content={ocrInfo.name} />
              <LabelText label="性别" content={ocrInfo.sex} />
              <LabelText label="证件号码" content={ocrInfo.num} />
              <LabelText label="出生日期" content={ocrInfo.birth} />
              <LabelText label="民族" content={ocrInfo.nationality} />
              <LabelText
                label="详情地址"
                content={ocrInfo.address}
                hiderBorder
              />
            </View>
          </Shadow>
          <Button type="primary" onTap={() => navigateBack()}>
            确定
          </Button>
        </>
      )}
    </View>
  );
};
