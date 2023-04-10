import { useGlobalState } from 'parsec-hooks';
type CaseHis = {
  recordId: string; //就诊记录ID
  mainNarration: string; //主述
  nowHistory: string; //现病史
  pastHistory: string; //既往史
  examInfo: string; //体格检查信息
  diagnosis: string; //诊断
  opinions: string; //治疗意见
};
export default () => {
  return useGlobalState('CaseHis', {} as CaseHis);
};
