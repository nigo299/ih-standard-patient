import { ListRes } from '@/apis/price-inquiry';

export enum PriceType {
  /** 药品查询 */
  drug = 'drug',
  /** 手术查询 */
  surgery = 'surgery',
  /** 项目查询 */
  item = 'item',
}

export const formatListResult = <D>(res: ListRes<D>) => ({
  list: res.data.items,
  pageNum: res.data.pageNumber,
  pageSize: res.data?.pageNo,
  total: res?.data?.total,
});

// 格式化价格（传参为分， 格式化为元） 如 100 => 1.00元
export const formatPrice = (price?: string | number) => {
  if (!price) return '';
  const priceNum = Number(price);
  return `${(priceNum / 100).toFixed(2)}元`;
};
