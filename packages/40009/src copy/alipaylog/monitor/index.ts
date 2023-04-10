export default {
  api: ({
    api,
    success,
    c1,
    time,
  }: {
    api: string;
    success: boolean;
    c1: string;
    time: number;
  }) => `${api}${success}${c1}${time}`,
};
