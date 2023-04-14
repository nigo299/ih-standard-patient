import React from 'react';
import { navigateBack } from 'remax/one';
import { Step } from '@kqinfo/ui';
// import { STEP_COLOR } from '../../config/constant';
// import { STEP_ITEMS } from '../../config/constant';

export default (props: { step: number }) => (
  <Step
    type="dashed"
    items={['选择科室', '选择医生', '选择时间']}
    current={props.step}
    defaultColor={'#F2F2F2'}
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
