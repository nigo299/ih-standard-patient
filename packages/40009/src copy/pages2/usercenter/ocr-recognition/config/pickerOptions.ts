export const sex = [
  {
    value: 'M',
    label: '男',
  },
  {
    value: 'F',
    label: '女',
  },
];

export const idTypePick = [
  {
    value: '1',
    label: '身份证',
  },
  // {
  //   value: '2',
  //   label: '医保卡',
  // },
  // {
  //   value: '3',
  //   label: '户口簿',
  // },
  // {
  //   value: '4',
  //   label: '港澳台通行证',
  // },
  // {
  //   value: '5',
  //   label: '护照',
  // },
  // {
  //   value: '6',
  //   label: '出生医学证明',
  // },
  // {
  //   value: '7',
  //   label: '无证件'
  // }
];

export const allIdTypePick = [
  ...idTypePick,
  {
    value: 7,
    label: '无证件',
  },
];

export const recommentText = '(首选)';

export const recommendInTypePick = idTypePick.map((item) => {
  if (['身份证', '医保卡'].includes(item.label)) {
    return {
      label: `${item.label}${recommentText}`,
      value: item.value,
    };
  }
  if (item.label === '出生医学证明') {
    return {
      label: '出生医学证明(不足一岁)',
      value: item.value,
    };
  }
  return item;
});

export const adultIdTypePick = idTypePick.filter((item) =>
  ['身份证', '港澳台通行证', '护照'].includes(item.label),
);
