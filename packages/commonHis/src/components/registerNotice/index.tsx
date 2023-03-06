import React, { useEffect } from 'react';
import { View, Image } from 'remax/one';
import { Mask } from '@/components';
import { Button, RichText, Space } from '@kqinfo/ui';
import { IMAGE_DOMIN } from '@/config/constant';
import styles from './index.less';
import showTabBar from '@/utils/showTabBar';
import setPageStyle from '@/utils/setPageStyle';
import classNames from 'classnames';
import { useDownCount } from 'parsec-hooks';
import { useUpdateEffect } from 'ahooks';

interface Props {
  show: boolean;
  confirm: () => void;
  close: () => void;
  content: string;
}

export default ({ show, confirm, close, content }: Props) => {
  const { countdown, setCountdown, clearCountdownTimer } = useDownCount();
  useEffect(() => {
    return () => {
      clearCountdownTimer();
    };
  }, [clearCountdownTimer]);
  useUpdateEffect(() => {
    setCountdown(5);
  }, [show]);
  return (
    <Mask
      show={show}
      close={() => {
        setPageStyle({
          overflow: 'inherit',
        });
        close();
        showTabBar();
      }}
    >
      <Space vertical alignItems="center" className={styles.notice}>
        <View className={styles.noticeTitle}>挂号服务须知</View>
        <View className={styles.noticeText}>
          <RichText nodes={content || ''} />

          {/*  <View>尊敬的患者及家属朋友：</View>*/}
          {/*  <View className={styles.text}>*/}
          {/*    近期，新冠肺炎疫情防控形势严峻复杂，为保障您和家人的健康安全，根据疫情防控要求，现将相关就诊事宜提示如下，请您提前做好相应准备，感谢您的理解和配合。*/}
          {/*  </View>*/}
          {/*  <View className={classNames(styles.text, styles.bold)}>*/}
          {/*    一、门诊管理*/}
          {/*  </View>*/}
          {/*  <View className={styles.text}>*/}
          {/*    1.来院就诊人员须测温、验双绿码（健康码、行程码）、持48小时内核酸阴性证明方可入院，全程须正确佩戴口罩，保持1米间距。*/}
          {/*  </View>*/}

          {/*  <View className={styles.text}>*/}
          {/*    2.急危重症患者在医务人员引导下通过绿色通道入院，抢救同时采集核酸送检。*/}
          {/*  </View>*/}

          {/*  <View className={styles.text}>*/}
          {/*    3.非必要不陪同，确有不便的，限1位亲友陪同就诊。陪同人员需“渝康码”为绿码“行程码”显示旅居史不涉及涉疫地，并提供48小时核酸阴性证明。“渝康码”为红码、黄码、弹窗或“渝康码”为绿码但“行程码”显示旅居史涉及涉疫地的，不能进入院区。*/}
          {/*  </View>*/}

          {/*  <View className={styles.text}>*/}
          {/*    4.门诊侯诊时请间隔就座，就诊时严格“一医一患一诊室”。*/}
          {/*  </View>*/}

          {/*  <View className={styles.text}>*/}
          {/*    5.咳嗽、喷嚏时，请使用纸巾或衣袖遮挡口鼻，避免触摸周围环境，就近使用免洗消毒液或洗手。*/}
          {/*  </View>*/}

          {/*  <View className={styles.text}>*/}
          {/*    6.本院未设置发热门诊，如果您出现发热、干咳、乏力、鼻塞、流涕、咽痛、腹泻等症状，“渝康码”为红码、黄码或“渝康码”为绿码但“行程码”显示旅居史涉疫，或来自高风险区请您自觉前往设置有发热门诊的医疗机构就诊。*/}
          {/*  </View>*/}

          {/*  <View className={styles.text}>*/}
          {/*    7.*/}
          {/*    建议平诊患者通过网络、微信公众号等平台提前预约挂号，按预约时间分时段、错峰来院就诊。*/}
          {/*  </View>*/}

          {/*  <View className={classNames(styles.text, styles.bold)}>*/}
          {/*    二、住院管理*/}
          {/*  </View>*/}
          {/*  <View className={styles.text}>*/}
          {/*    1.所有住院患者及其陪护，需提供双码（双绿）及入院前48小时内核酸阴性报告方可入院。*/}
          {/*  </View>*/}
          {/*  <View className={styles.text}>*/}
          {/*    2.急诊危重症住院患者，先收治过渡病房（期间不能离开病房），经核酸检测阴性后转入普通病房。*/}
          {/*  </View>*/}
          {/*  <View className={styles.text}>*/}
          {/*    3.住院病区封闭管理，非必要不陪护，确需陪护的严格执行“一患一固定陪护”与腕带管理，实行24小时出入管控，谢绝探视，无关人员一律不允许进入病区。*/}
          {/*  </View>*/}
          {/*  <View className={styles.text}>*/}
          {/*    4.患者及陪护人员在院内期间须正确佩戴口罩、勤洗手，不得互串病房，不聚集、不扎堆，主动配合每日健康监测，不得瞒报、谎报健康状况。*/}
          {/*  </View>*/}

          {/*  <View className={classNames(styles.text, styles.bold)}>*/}
          {/*    三、预约挂号方式*/}
          {/*  </View>*/}

          {/*  <View className={styles.text}>*/}
          {/*    1. 人工窗口现场预约挂号，选择就诊科室。*/}
          {/*  </View>*/}

          {/*  <View className={styles.text}>*/}
          {/*    2. 院内自助机预约挂号:*/}
          {/*    <View className={styles.text}>*/}
          {/*          点击“预约挂号”-选择“读卡方式”-选择就诊科室-选择就诊医生-选择预约时间-确认挂号-自动打印挂号凭证。（自助机支持的读卡方式有医保卡、电子医保卡、电子就诊卡。）*/}
          {/*    </View>*/}
          {/*  </View>*/}

          {/*  <View className={styles.text}>*/}
          {/*    3. 微信公众号预约挂号:*/}
          {/*    <View className={styles.text}>*/}
          {/*      微信关注“重庆市沙坪坝区妇幼保健院”公众号，进入个人中心添加就诊人，注册绑定就诊人后，选择“就诊服务”-点击“预约挂号”-选择就诊院区-选择就诊科室-选择就诊医生-选择预约时间-点击立即预约，确认挂号成功。*/}
          {/*    </View>*/}
          {/*  </View>*/}

          {/*  <View className={styles.text}>*/}
          {/*      4. 12320预约挂号:*/}
          {/*    <View className={styles.text}>*/}
          {/*      12320预约网址http://www.cq12320.cn/，注册登录成功后，点击“预约挂号”-选择重庆市沙坪坝区妇幼保健院-选择就诊科室-选择就诊医生和预约时间-选择就诊人-确认挂号。*/}
          {/*    </View>*/}
          {/*  </View>*/}
          {/*  <View className={styles.text}>*/}
          {/*    我院将根据重庆市疫情形势及防控要求的变化，适时作出动态调整，感谢您的理解和配合！祝您身体健康！*/}
          {/*  </View>*/}
          {/*  <View className={classNames(styles.text, styles.right)}>*/}
          {/*    重庆市沙坪坝区妇幼保健院*/}
          {/*  </View>*/}
          {/*  <View className={classNames(styles.text, styles.right)}>*/}
          {/*     2022年11月24日*/}
          {/*  </View>*/}
          {/*  <View className={styles.noticeBold}>*/}
          {/*    请仔细阅读上诉条款，点击“同意”后方可进入挂号页面。*/}
          {/*  </View>*/}
        </View>
        <Space
          className={styles.buttons}
          justify="space-between"
          alignItems="center"
        >
          <Button
            className={styles.cancelBtn}
            onTap={() => {
              setPageStyle({
                overflow: 'inherit',
              });
              close();
              showTabBar();
            }}
          >
            取消
          </Button>
          <Button
            type={'primary'}
            className={classNames(styles.confirmBtn, {
              [styles.confirmBtnDisabled]: countdown > 0,
            })}
            disabled={countdown > 0}
            onTap={() => {
              confirm();
              setPageStyle({
                overflow: 'inherit',
              });
              close();
              showTabBar();
            }}
          >
            同意{countdown > 0 && `(${countdown}s)`}
          </Button>
        </Space>
        <Image
          src={`${IMAGE_DOMIN}/home/ghfwxz.png`}
          className={styles.noticeImg}
        />
      </Space>
    </Mask>
  );
};
