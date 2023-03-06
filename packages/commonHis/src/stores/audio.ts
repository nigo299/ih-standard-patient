import { useState } from 'react';
import { createContainer } from 'unstated-next';

export default createContainer(() => {
  const [innerAudioContext, setInnerAudioContext] = useState<any>();
  const [audioId, setAudioId] = useState<number | string>('');
  return {
    innerAudioContext,
    setInnerAudioContext,
    audioId,
    setAudioId,
  };
});
