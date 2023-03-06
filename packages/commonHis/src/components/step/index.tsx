import React from 'react';
import { navigateBack } from 'remax/one';
import { Step } from '@kqinfo/ui';

export default (props: { step: number }) => (
  <Step
    type="dashed"
    items={['选择院区', '选择科室', '选择医生', '选择时间']}
    current={props.step}
    defaultColor={'#80CFD6'}
    onChoose={(i) => {
      const delta = props.step - i;
      if (delta > 0) {
        navigateBack({
          delta,
        });
      }
    }}
  />
);
