import vstores from 'vstores';

type DataType = {
  decryptPatName: boolean;
};

export const typedStorage = vstores.create<DataType>();
