import request from '@/apis/utils/request';
import createApiHooks from 'create-api-hooks';

interface PostAlphaIhisHesuanRegisterListData extends API.ResponseDataType {
  data: { list: PostAlphaIhisHesuanRegisterList[] };
}

interface PostAlphaIhisHesuanRegisterList {
  itemName: string;
  itemAmount: number;
  itemID: string;
  extFields: string;
}

export default {
  核酸套餐查询: createApiHooks(
    (params: {
      patCardType?: string;
      patCardNo?: string;
      patHisNo?: string;
      patName?: string;
      extFields?: string;
    }) =>
      request.get<PostAlphaIhisHesuanRegisterListData>(
        '/api/intelligent/ihis/nucleic-acid/items',
        { params },
      ),
  ),
  核酸开单: createApiHooks(
    (params: {
      itemID: string;
      patCardType?: string;
      patCardNo?: string;
      patName?: string;
      num?: string;
    }) => request.post('/api/intelligent/ihis/nucleic-acid/bill', params),
  ),
};
