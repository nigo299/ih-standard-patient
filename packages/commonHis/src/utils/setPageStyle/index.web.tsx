import React from 'react';

export default (style: React.CSSProperties) => {
  Object.keys(style).map((item, index) => {
    document.body.style.cssText = `${item}: ${Object.values(style)[index]}`;
  });
};
