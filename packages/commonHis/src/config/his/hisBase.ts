export default class BaseHis {
  hisId: string;

  config: StaticConfig;

  constructor(hisId: string) {
    this.hisId = hisId;
    this.config = {
      defaultAddress: '重庆市-市辖区-沙坪坝区',
    };
  }
}

type StaticConfig = {
  /** 建档的默认地址 */
  defaultAddress: string;
};
