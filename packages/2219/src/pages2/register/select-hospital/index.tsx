import React, { useCallback } from 'react';
import { View, Image, navigateTo, reLaunch } from 'remax/one';
import { usePageEvent } from 'remax/macro';
// import useApi from '@/apis/common';
import setNavigationBar from '@/utils/setNavigationBar';
import { Step, WhiteSpace } from '@/components';
import { IMAGE_DOMIN, PLATFORM } from '@/config/constant';
import { DeptType } from '@/apis/register';
import regsiterState from '@/stores/register';
import styles from './index.less';
import useGetParams from '@/utils/useGetParams';
import { Space, showToast } from '@kqinfo/ui';

export default () => {
  const { type, summary, doctor } = useGetParams<{
    type: 'reserve' | 'day';
    summary: string;
    doctor: string;
  }>();
  // const [show, setShow] = useState(false);
  // const {
  //   data: { data: infoData },
  // } = useApi.注意事项内容查询({
  //   params: {
  //     noticeType: 'GHXZ',
  //     noticeMethod: 'WBK',
  //   },
  //   needInit: !summary,
  // });
  // useEffect(() => {
  //   if (infoData?.[0]?.noticeInfo && !summary) setShow(true);
  // }, [infoData, summary]);
  const { hospitalList, setDeptList, getDeptList } =
    regsiterState.useContainer();
  const handleSelect = useCallback(
    ({ children: dept, name }: { children: DeptType[]; name: string }) => {
      if (name === '附三院门诊部') {
        showToast({
          title: '即将为你跳转至“附三院门诊部”预约挂号系统。',
          icon: 'success',
        }).then(() => {
          window.location.href =
            'https://m.hsyuntai.com/med/hp/hospitals/100039/hos/registration/departmentDetails/2//1315922/?deptName=%E5%8F%A3%E8%85%94%E7%A7%91';
        });
        return;
      } else if (name === '大学城门诊部') {
        showToast({
          title: '即将为你跳转至“大学城门诊部”预约挂号系统。',
          icon: 'success',
        }).then(() => {
          window.location.href =
            'https://appsp.zcareze.com/appsp/h5/authorize?appid=wx5da34ab726d31047&authType=0&authMode=userinfo&address=page%3DnewRegistration%2FwithCode%2F11%2F7%2F006%2F%2F%2F%2F%2F%2F%2F';
        });

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
    if (hospitalList.length === 0) {
      getDeptList(type);
    }
    setNavigationBar({
      title: '选择院区',
    });
  });
  return (
    <View>
      {!summary && <Step step={1} />}
      <View className={styles.header} />
      <WhiteSpace />
      <View className={styles.lists}>
        {!summary &&
          hospitalList?.map((item, index) => (
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
                {item?.address && item?.address !== '暂无' && (
                  <View
                    className={styles.address}
                  >{`地址：${item.address}`}</View>
                )}
              </View>
            </View>
          ))}
        {summary &&
          hospitalList?.slice(0, 3)?.map((item, index) => (
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
      {!summary && (
        <Space
          className={styles.ball}
          justify="center"
          alignItems="center"
          vertical
          size={8}
          onTap={() => {
            if (PLATFORM === 'web') {
              window.location.href =
                'https://ihs.cqkqinfo.com/patients/p2219/#/home/indexNew';
            } else {
              reLaunch({
                url: '/pages/home/index',
              });
            }
          }}
        >
          <View>返回</View>
          <View>首页</View>
        </Space>
      )}
      {/* {!summary && (
        <RegisterNotice
          show={show}
          close={() => {
            setShow(false);
          }}
          content={infoData?.[0]?.noticeInfo || ''}
          confirm={() => {
            setShow(false);
          }}
        />
      )} */}
    </View>
  );
};
