import React, { useEffect, useRef } from 'react';
import { Native } from '@kqinfo/ui';
import { NativeInstance } from '@kqinfo/ui/lib/native';

export default ({
  max = 3,
  duration = 500,
}: {
  max?: number;
  duration?: number;
}) => {
  const nativeRef = useRef<NativeInstance>(null);
  const lengthRef = useRef(0);
  useEffect(() => {
    const timer = setInterval(() => {
      lengthRef.current++;
      if (lengthRef.current > max) {
        lengthRef.current = 0;
      }
      nativeRef.current?.setData({
        content: new Array(lengthRef.current)
          .fill(0)
          .map(() => '.')
          .join(''),
      });
    }, duration);
    return () => {
      clearTimeout(timer);
    };
  }, [duration, lengthRef, max]);

  return (
    <Native
      ref={nativeRef}
      initData={{
        style: 'display:inline',
      }}
    />
  );
};
