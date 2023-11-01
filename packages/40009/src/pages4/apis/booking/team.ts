import request from '@/apis/utils/request';
import createApiHooks from 'create-api-hooks';

interface ITeam {
  id: string;
  hisId: string;
  hospitalName: string;
  teamName: string;
  diseaseType: string;
  mode: 1 | 2 | 3;
  avatarImage: string;
  visitSlot: Array<{
    week: number;
    startTime: string;
    endTime: string;
  }>;
  intro: string;
  createTime: string; //创建时间
  updateTime: string; //更新时间
  price: number; //团队价格，单位分
  memberAmount: number; //成员数量
  deptAmount: number; //科室数量
}

export default {
  团队列表: createApiHooks((params: { searchKey?: string }) =>
    request.get<{ data: ITeam[] }>(
      'https://yapi.cqkqinfo.com/mock/1161/ihis/cooperate/mdt-team',
      {
        params,
      },
    ),
  ),
};
