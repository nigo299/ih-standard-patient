import request from './utils/request';
import createApiHooks from 'create-api-hooks';

export interface ListRes<T> extends API.ResponseDataType {
  data: {
    pageNumber: number;
    pageNo: number;
    total: number;
    items: T[];
  };
}

interface CommonQuery {
  name?: string;
  pageNumber: number;
  pageNo: number;
}

export default {
  项目查询: createApiHooks((params: CommonQuery) => {
    return request.get<
      ListRes<{
        itemName: '项目名称'; //项目名称
        itemCode: '项目编码'; //项目编码
        itemSpec: '规格/单位'; //规格/单位
        itemPrice: '100'; //金额，单位：分
        pinYinCode: 'xxx'; //拼音码
        siLevel: '甲类'; //医保类型
      }>
    >('/api/intelligent/ihis/price/item', {
      params,
    });
  }),
  手术查询: createApiHooks((params: CommonQuery) => {
    return request.get<
      ListRes<{
        itemName: '项目名称'; //项目名称
        itemCode: '项目编码'; //项目编码
        itemSpec: '规格/单位'; //规格/单位
        itemPrice: '100'; //金额，单位：分
        pinYinCode: '拼音码'; //拼音码
        siLevel: '甲类'; //医保类型
      }>
    >('/api/intelligent/ihis/price/surgery', { params });
  }),
  药品查询: createApiHooks((params: CommonQuery) => {
    return request.get<
      ListRes<{
        itemName: '项目名称'; //项目名称
        itemCode: '项目编码'; //项目编码
        itemSpec: ''; //规格/单位
        itemPrice: '100'; //金额，单位：分
        producerName: '生产商名称'; //生产商名称
        pinYinCode: '拼音码'; //拼音码
        siLevel: '甲类'; //医保类型
      }>
    >('/api/intelligent/ihis/price/med', {
      params,
    });
  }),
};
