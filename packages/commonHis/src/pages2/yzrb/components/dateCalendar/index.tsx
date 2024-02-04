import React, { useEffect, useRef, useState } from 'react';
import { Text } from 'remax/one';
import {
  Space,
  BackgroundImg,
  pxToRpx,
  Icon,
  Calendar,
  Button,
  Sheet,
} from '@kqinfo/ui';
import { SheetInstance } from '@kqinfo/ui/es/sheet';
import styles from './index.less';
import boximg from './images/box.png';
// import arrow from './images/arrow.png';
import dayjs from 'dayjs';
import DateRangePicker from './dateRangePicker';
interface Iprops {
  isShow: boolean;
  value: any[];
  params: {
    amount: string;
  };
  onTap?: (v: string) => void;
  onchange?: (date: any[]) => void;
}

export default (props: Iprops) => {
  const sheetRef = useRef<SheetInstance>(null);

  const [selectDate, setselectDate] = useState([dayjs().add(-1, 'day')]);

  const isShowNextDay = () => {
    if (selectDate && !selectDate[1]) {
      return true;
    } else {
      return false;
    }
  };
  const [showAmount, setShowAmount] = useState({
    value: '0',
    unit: '元',
  });
  useEffect(() => {
    props.onchange && props.onchange(selectDate);
  }, []);
  useEffect(() => {
    setShowAmount(amountAddUnit(props.params.amount));
  }, [props.params.amount]);
  useEffect(() => {
    if (props.value) {
      if (
        props.value[0] !== selectDate[0] ||
        props.value[1] !== selectDate[1]
      ) {
        setselectDate(props.value);
      }
    }
  }, [props.value, selectDate]);
  const onchange = (dates: any[]) => {
    setselectDate(dates);
    props.onchange && props.onchange(dates);
  };
  function amountAddUnit(val: string | number | undefined | null) {
    const basicNum = 10000,
      unit = '万';
    if (!val && val !== 0) {
      return {
        value: '0',
        unit: '元',
      };
    } else {
      const ints = (val + '').split('.')[0];
      if (ints.length >= (basicNum + '').length) {
        const value = Number(val);
        return {
          value: (value / basicNum).toFixed(2),
          unit: unit,
        };
      } else {
        return {
          unit: '元',
          value: val + '',
        };
      }
    }
  }

  return (
    <BackgroundImg
      img={boximg}
      style={props.isShow ? {} : { display: 'none' }}
      className={styles.imgbox}
      imgProps={{
        style: { width: '100%', height: pxToRpx(150) },
      }}
    >
      <Space
        vertical
        className={styles.boxinner}
        onTap={() => props?.onTap?.('1')}
      >
        <DateRangePicker
          onCahnge={onchange}
          value={selectDate}
          // maxRangeDay={7}
        />
        {/* <Space
          className={styles.boxTop}
          alignItems={'center'}
          justify={'center'}
          size={20}
          onTap={() => {
            sheetRef.current?.setVisible(true);
          }}>
          <Text>日收入</Text>
          <Picker
            cols={3}
            mode={'date'}
            value={selectDate}
            onChange={(v) => {
              setselectDate(v as string);
              props.onchange && props.onchange(v as string);
            }}>
            <Button type={'primary'}>显示</Button>
            <Text>{dayjs(selectDate).format('YYYY年MM月DD日')}</Text>
            <Image src={arrow} className={styles.arrow} />
          </Picker>
        </Space> */}
        <Space
          className={styles.boxBody}
          alignItems={'center'}
          justify={'space-between'}
        >
          <Space
            className={styles.aciton}
            style={isShowNextDay() ? {} : { display: 'none' }}
            alignItems={'flex-end'}
            onTap={() => {
              const newDate = dayjs(selectDate[0]).add(-1, 'day');
              onchange([newDate]);
              // props.onchange && props.onchange([newDate]);
            }}
          >
            <Icon name={'kq-left'} size={20} color={'#00A1CF'} />
            前一天
          </Space>
          <Space flex={1} justify={'center'} alignItems={'flex-end'} size={15}>
            <Text className={styles.cash}>{showAmount.value}</Text>
            <Text className={styles.unit}>{showAmount.unit}</Text>
          </Space>
          <Space
            className={styles.aciton}
            style={isShowNextDay() ? {} : { display: 'none' }}
            alignItems={'flex-end'}
            onTap={() => {
              const newDate = dayjs(selectDate[0]).add(1, 'day');
              onchange([newDate]);
              // props.onchange && props.onchange([newDate]);
            }}
          >
            后一天 <Icon name={'kq-right'} size={20} color={'#00A1CF'} />
          </Space>
        </Space>
        <Space
          className={styles.boxFoot}
          alignItems={'center'}
          justify={'center'}
        >
          北京时间每天早上8点更新前一天的数据
        </Space>
        <Sheet ref={sheetRef}>
          <Space
            vertical
            style={{ height: '80vh', background: '#fff', overflow: 'auto' }}
          >
            <Button
              type={'primary'}
              onTap={() => {
                sheetRef.current?.setVisible(false);
              }}
            >
              隐藏日期列表
            </Button>
            {/*设置listEndDay会变为列表模式*/}
            <Calendar.Picker />
          </Space>
        </Sheet>
      </Space>
    </BackgroundImg>
  );
};
