import React from 'react';
import { Picker, Space } from '@kqinfo/ui';
import styles from './index.less';
import classNames from 'classnames';
import dayjs from 'dayjs';

const dateTypeOptions = {
  月: newMonthOptions(),
  季: newQuarterOptions(),
  年: neYearOptions(),
};
function newMonthOptions() {
  const nowYear = dayjs().year();
  const startYear = 2005;
  const months = new Array(12)
    .fill(1)
    .map((d, i) => ({ value: i + 1, label: i + 1 + '月' }));
  const monthOptions: any[] = [];
  for (let i = nowYear; i > startYear; i--) {
    monthOptions.push({
      value: i,
      label: i + '年',
      children: months,
    });
  }
  return monthOptions;
}
function newQuarterOptions() {
  const nowYear = dayjs().year();
  const startYear = 2005;
  const quarters = new Array(4)
    .fill(1)
    .map((d, i) => ({ label: i + 1 + '季度', value: i + 1 }));
  const quarterOptions: any[] = [];
  for (let i = nowYear; i > startYear; i--) {
    quarterOptions.push({
      value: i,
      label: i + '年',
      children: quarters,
    });
  }
  return quarterOptions;
}
function neYearOptions() {
  const nowYear = dayjs().year();
  const startYear = 2005;
  const yearOptions: any[] = [];
  for (let i = nowYear; i > startYear; i--) {
    yearOptions.push({
      value: i,
      label: i + '年',
    });
  }
  return yearOptions;
}
function dateTypePicker(
  type: '月' | '年' | '季' | '日',
  confirm: (val: any[]) => void,
) {
  if (type === '日') {
    return (
      <Picker
        mode={'date'}
        renderValue={false}
        onChange={(val) => {
          const dates = [];
          dates[0] = dayjs(val as string);
          console.log('onConfirm', dates);
          confirm(dates);
        }}
      >
        {type}
      </Picker>
    );
  } else {
    return (
      <Picker
        renderValue={false}
        onConfirm={(val) => {
          const dates = [];
          if (type === '年') {
            dates[0] = dayjs(val[0] + `/01/01`);
            dates[1] = dayjs(val[0] + `/12/31`);
          } else if (type === '季') {
            const endMonth = Number(val[1]) * 3,
              year = val[0];
            const endDate = new Date(Number(val[0]), endMonth, 0);
            dates[0] = dayjs(year + `/${endMonth - 2}/01`);
            dates[1] = dayjs(endDate);
          } else if (type === '月') {
            const endMonth = Number(val[1]),
              year = val[0];
            const endDate = new Date(Number(val[0]), endMonth, 0);
            dates[0] = dayjs(year + `/${endMonth}/01`);
            dates[1] = dayjs(endDate);
          }
          console.log('onConfirm', dates);
          confirm(dates);
        }}
        // cols={2}
        data={dateTypeOptions[type]}
      >
        {type}
      </Picker>
    );
  }
}
interface Iprops {
  active?: string;
  onChange?: (type: 'day' | 'month' | 'quarter' | 'year', v: string[]) => void;
}
export default (props: Iprops) => {
  // const { active = '1', onTap } = props;
  const pickerConfirm = (date: any[], item: any) => {
    props.onChange && props.onChange(item.value, date);
  };

  return (
    <Space alignItems={'center'} justify={'flex-end'} size={20}>
      {[
        { label: '日', value: 'day' },
        { label: '月', value: 'month' },
        { label: '季', value: 'quarter' },
        { label: '年', value: 'year' },
      ].map((item) => {
        return (
          <Space
            // onTap={() => {
            //   setactive(item.value);
            // }}
            className={classNames(styles.item, {
              [styles.active]: props.active === item.value,
            })}
            key={item.value}
            justify={'center'}
            alignItems={'center'}
          >
            {dateTypePicker(item.label as any, (val) =>
              pickerConfirm(val, item),
            )}
            {/* {item.label} */}
          </Space>
        );
      })}
    </Space>
  );
};
