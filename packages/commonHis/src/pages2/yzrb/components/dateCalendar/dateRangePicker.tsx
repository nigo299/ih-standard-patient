import React, { useRef, useState, useEffect } from 'react';
import { Button, Calendar, Icon, Sheet, Space, showToast } from '@kqinfo/ui';
import { SheetInstance } from '@kqinfo/ui/es/sheet';
import styles from './index.less';
import dayjs from 'dayjs';
import { View } from 'remax/one';

interface Propss {
  value?: any[];
  onCahnge?: (value: any[]) => void;
  maxRangeDay?: number;
}
export default (props: Propss) => {
  const [selectedDate, setSelectedDate] = useState<any>();
  const sheetRef = useRef<SheetInstance>(null);

  useEffect(() => {
    setSelectedDate(props.value);
  }, [props.value]);
  const valueShowFormat = () => {
    const showValue = props.value;
    let start = '',
      end = '',
      showTxt = '';
    if (showValue) {
      start = showValue[0] ? dayjs(showValue[0]).format('YYYY年MM月DD日') : '';
      showTxt += start;
      end = showValue[1] ? dayjs(showValue[1]).format('YYYY年MM月DD日') : '';
      showTxt += showTxt && end ? '~' : '';
      showTxt += end;
    }

    return showTxt ? showTxt : '请选择日期';
  };
  return (
    <Space justify={'center'} alignItems="center" className={styles.dateTxtBox}>
      <View
        onTap={() => sheetRef.current?.setVisible(true)}
        className={styles.dateTxt}
      >
        收入 {valueShowFormat()}
      </View>
      <Icon
        name="kq-down"
        size={'12px'}
        className={styles.dateIcon}
        color="#fff"
      />
      <Sheet ref={sheetRef} direction={'bottom'}>
        <Space vertical className={styles.dateRangePicerWrap}>
          {/* <Space>
            清空
            <Icon name='kq-clear'></Icon>
          </Space> */}
          <Calendar.Picker
            className={styles.CalendarPicker}
            onChange={(rangs) => {
              setSelectedDate(rangs);
              // console.log('selectedDate', rangs);
            }}
            style={{ flex: 1 }}
            current={selectedDate}
            range
            renderDisable={(day) => {
              return day.isAfter(dayjs(new Date()), 'date');
            }}
          />

          <Space style={{ flexShrink: 0 }} size={'10px'}>
            <Button
              type={'primary'}
              ghost
              onTap={() => sheetRef.current?.setVisible(false)}
            >
              取消
            </Button>
            <Button
              type={'primary'}
              onTap={() => {
                if (props.maxRangeDay) {
                  const start = selectedDate[0];
                  const end = selectedDate[1];
                  if (
                    end.isAfter(start.add(props.maxRangeDay, 'day'), 'date')
                  ) {
                    return showToast({
                      title: `开始到结束日期不能超过${props.maxRangeDay}天!`,
                      icon: 'none',
                    });
                  }
                }
                console.log('selectedDate-----', selectedDate);
                props.onCahnge && props.onCahnge(selectedDate);
                sheetRef.current?.setVisible(false);
              }}
              // disabled={!selectedDate || !selectedDate[0] || !selectedDate[1]}
              disabled={!selectedDate}
            >
              确认
            </Button>
          </Space>
        </Space>
      </Sheet>
    </Space>
  );
};
