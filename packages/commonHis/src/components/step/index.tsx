import React from 'react';
import { navigateBack } from 'remax/one';
import { Step } from '@kqinfo/ui';
import { STEP_COLOR } from '@/config/constant';
import { STEP_ITEMS } from '@/config/constant';

export default (props: { step: number }) => (
  <Step
    type="dashed"
    items={STEP_ITEMS}
    current={props.step}
    defaultColor={STEP_COLOR}
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
