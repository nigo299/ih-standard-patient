import React, { useState } from 'react';
import { View, Text, navigateBack, navigateTo } from 'remax/one';
import { Space, CheckBox, useSafeArea, showToast, useTitle } from '@kqinfo/ui';
import styles from './index.less';
import useGetParams from '@/utils/useGetParams';
import lc from './lc.png';

export default () => {
  useTitle('多学科门诊MDT');
  const { teamId } = useGetParams<{
    teamId: string;
  }>();
  const { bottomHeight } = useSafeArea();
  const [checkValue, setCheckValue] = useState(false);
  return (
    <View className={styles.page}>
      <View className={styles.warp}>
        <View className={styles.title}>申请须知</View>
        <View className={styles.p}>
          多学科联合门诊（MDT）是由多学科资深专家以共同讨论的方式，为患者制定个性化诊疗方案的过程，患者可得到由多学科专家组成的专家团队的综合评估，并共同制定系统性、专业化、规范化、个体化治疗方案。
        </View>
        <View className={styles.h1}>一、诊疗范围</View>
        <View className={styles.p}>
          1.就诊2个及以上不同专业学科或在1个专科就诊3次以上尚未明确诊断的患者。
        </View>
        <View className={styles.p}>2.病情复杂需多个学科协助诊断治疗的患者</View>
        <View className={styles.p}>
          3.所患疾病诊断较为明确，但治疗方案涉及多学科、多系统、多器官、需要多个学科协同制定者。
        </View>
        <View className={styles.p}>
          4.自愿申请，经多学科联合门诊审核符合要求的。
        </View>
        <View className={styles.h1}>二、申请要求</View>
        <View className={styles.p}>
          为保证多学科联合门诊质量，请如实、详细的提供病情相关的病历、检查检验资料。如因资料不全，请根据我们提供的建议先至相关专科就诊完善检查，补齐基本病史与资料后可再次申请多学科联合门诊。
        </View>
        <View className={styles.h1}>三、就诊时间</View>
        <View className={styles.p}>
          申请提交成功后1-2个工作日内将有专职人员与您联系，请您确保联系方式正确，并注意保持手机畅通。因涉及多个学科，需提前对患者资料进行收集整理，实际就诊时间以医院电话通知为准。
        </View>
        <View className={styles.h1}>四、注意事项</View>
        <View className={styles.p}>
          1.审核通过后请在就诊当日请携带好身份证、社保卡等相关证件，所有病历及影像资料，检查检验结果，根据就诊时间提前半小时到院候诊。
        </View>
        <View className={styles.p}>
          2.门诊地点：重庆松山医院A栋二楼207多学科联合门诊
        </View>
        <View className={styles.p}>3.预约咨询电话：13310226351</View>
        <View className={styles.h1}>五、就诊流程</View>
        {/* <View className={styles.h1}>第一步：MDT门诊申请</View>
        <View className={styles.p}>
          选择需要预约的MDT门诊，填写患者基本信息，提交预约申请，患者缴费，上传病历资料及检查检验结果。
        </View>
        <View className={styles.h1}>第二步：等待审核</View>
        <View className={styles.p}>MDT门诊专职秘书审核相关病历资料</View>
        <View className={styles.h1}>第三步：审核成功</View>
        <View className={styles.p}>患者按照预约时间就诊</View>
        <View className={styles.h1}>第四步：MDT团队会诊</View>
        <View className={styles.p}>MDT团队集体讨论最佳诊疗方案</View>
        <View className={styles.h1}>第五步：MDT会诊意见</View>
        <View className={styles.p}>MDT团队协调员出具会诊意见</View> */}
        <img src={lc} className={styles.img} alt="" />
      </View>

      <View className={styles.bottomBar}>
        <Space
          className={styles.read}
          alignItems="center"
          onTap={() => {
            setCheckValue(!checkValue);
          }}
        >
          <CheckBox checked={checkValue} disabled />
          <Space>
            我已阅读<Text className={styles.link}>《申请须知》</Text>
            并知晓相关内容
          </Space>
        </Space>
        <Space
          className={styles.action}
          style={{ paddingBottom: bottomHeight }}
        >
          <Space
            className={styles.actionCancel}
            onTap={() => {
              navigateBack();
            }}
          >
            取消预约
          </Space>
          <Space
            className={styles.actionOk}
            onTap={() => {
              if (!checkValue) {
                showToast({
                  icon: 'none',
                  title: '请阅读并同意《申请须知》',
                });
              } else {
                navigateTo({
                  url: `/pages4/booking/schedule/index?teamId=${teamId}`,
                });
              }
            }}
          >
            确认预约
          </Space>
        </Space>
      </View>
    </View>
  );
};
