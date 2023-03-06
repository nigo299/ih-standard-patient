import { combineProviders } from 'react-combine-provider';
import payState from './pay';
import patientState from './patient';
import registerState from './register';
import inhospState from './inhosp';
import globalState from './global';
import audioState from './audio';

export default combineProviders([
  globalState.Provider,
  payState.Provider,
  patientState.Provider,
  registerState.Provider,
  inhospState.Provider,
  audioState.Provider,
]);
