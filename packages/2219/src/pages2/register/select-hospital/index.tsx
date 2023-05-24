import React, { useCallback } from 'react';
import { View, Image, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import { Space, showToast } from '@kqinfo/ui';
import setNavigationBar from '@/utils/setNavigationBar';
import { Step, WhiteSpace } from '@/components';
import { IMAGE_DOMIN } from '@/config/constant';
import { DeptType } from '@/apis/register';
import regsiterState from '@/stores/register';
import styles from '@/pages2/register/select-hospital/index.less';
import useGetParams from '@/utils/useGetParams';

export default () => {
  const { type, summary, doctor } = useGetParams<{
    type: 'reserve' | 'day';
    summary: string;
    doctor: string;
  }>();
  const { hospitalList, setDeptList } = regsiterState.useContainer();
  const handleSelect = useCallback(
    ({ children: dept, name }: { children: DeptType[]; name: string }) => {
      if (name === '附三院口腔门诊部') {
        window.location.href =
          'https://m.hsyuntai.com/med/hp/hospitals/100039/hos/registration/departmentDetails/2//1315922/?deptName=%E5%8F%A3%E8%85%94%E7%A7%91';
        return;
      } else if (name === '附属大学城医院口腔门诊部') {
        window.location.href =
          'https://appsp.zcareze.com/appsp/h5/authorize?appid=wx5da34ab726d31047&authType=0&authMode=userinfo&address=page%3DnewRegistration%2FwithCode%2F11%2F7%2F006%2F%2F%2F%2F%2F%2F%2F';
        return;
      }
      setDeptList(dept);
      if (!!summary) {
        if (!!doctor) {
          navigateTo({
            url: `/pages/microsite/dept-summary/index?doctor=true`,
          });
          return;
        }
        navigateTo({
          url: `/pages/microsite/dept-summary/index`,
        });
        return;
      }
      navigateTo({
        url: `/pages2/register/department/index?type=${type}`,
      });
      return;
    },
    [doctor, setDeptList, summary, type],
  );
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '选择院区',
    });
  });
  return (
    <View>
      <Step step={1} />
      <View className={styles.header} />
      <Space justify="center">
        <Image
          className={styles.banner}
          src={`${IMAGE_DOMIN}/register/banner.png`}
          onTap={() =>
            showToast({
              icon: 'none',
              title: '功能暂未开放!',
            })
          }
        />
      </Space>
      <WhiteSpace />
      <View className={styles.lists}>
        {hospitalList?.map((item, index) => (
          <View className={styles.itemWrap} key={index}>
            <Image
              src={`${IMAGE_DOMIN}/register/districtBg.png`}
              className={styles.bg}
            />
            <View
              key={item.id}
              className={styles.item}
              onTap={() => handleSelect(item)}
            >
              <View className={styles.name}>{item.name}</View>
              <View className={styles.address}>{`地址：${
                item.address || '暂无'
              }`}</View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};