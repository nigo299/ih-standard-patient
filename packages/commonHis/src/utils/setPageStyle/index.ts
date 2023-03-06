import React from 'react';

export default (style: React.CSSProperties) =>
  wx.setPageStyle({
    style,
  });
