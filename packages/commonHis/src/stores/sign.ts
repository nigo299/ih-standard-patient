import { useState } from 'react';
import { createContainer } from 'unstated-next';

export default createContainer(() => {
  const [signInfo, setSignInfo] = useState({});
  return {
    signInfo,
    setSignInfo,
  };
});
