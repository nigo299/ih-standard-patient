import React, { useState } from 'react';
import { View, Image, Text } from 'remax/one';
import { WhiteSpace } from '@/components';
import { IMAGE_DOMIN } from '@/config/constant';
import { Button, Loading, Space } from '@kqinfo/ui';
import useGetParams from '@/utils/useGetParams';
import dayjs from 'dayjs';
import useApi from '@/apis/mdt';
import styles from './index.less';
import TeamInfo from './components/TeamInfo';
import Calendar from './components/Calendar';
import TimeSec from './components/TimeSec';
export default () => {
  const { teamId, type, relationId } = useGetParams<{
    teamId: string;
    type: string;
    relationId: string;
  }>();

  const {
    data: { data: doctorDetail },
  } = useApi.根据id查询团队详情({
    params: {
      id: teamId,
    },
    needInit: !!teamId,
  });

  const { loading, data: originalData } = useApi.会诊按日历显示({
    initValue: {
      data: [],
    },
    params: {
      teamId: '',
      type: '',
      relationId: '',
    },
    needInit: !!teamId && !!type && !!relationId,
  });
  const [visitDate, setVisitDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [sourceNumber, setSourceNumber] = useState('1');
  const { loading: dayDetailLoading, data: dayDetail } = useApi.排班详情({
    initValue: {
      data: [],
    },
    params: {
      teamId: '',
      type: '',
      relationId: '',
      visitDate: '',
    },
    needInit: !!teamId && !!type && !!relationId && !!visitDate,
  });

  return (
    <View>
      <View className={styles.content}>
        {(loading || dayDetailLoading) && <Loading />}
        <TeamInfo data={doctorDetail} />
        <WhiteSpace />
        <Calendar
          data={originalData?.data}
          value={visitDate}
          onChange={(v) => {
            setVisitDate(v);
          }}
        />

        <WhiteSpace />
        <TimeSec
          value={sourceNumber}
          onChange={(v) => setSourceNumber(v)}
          data={dayDetail?.data}
        />

        <Space
          justify="center"
          alignItems="center"
          vertical
          className={styles.noData}
        >
          <Image
            src={`${IMAGE_DOMIN}/register/zwpb.png`}
            className={styles.noDataImg}
            mode="aspectFit"
          />
          <Text>暂无排班</Text>
        </Space>
        <Button className={styles.btn} type="primary">
          下一步
        </Button>
      </View>
    </View>
  );
};
