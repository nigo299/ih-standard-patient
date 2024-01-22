import React from 'react';
import { Table } from '@kqinfo/ui';
import { DataSource, Column } from '@kqinfo/ui/lib/table';
import styles from './index.less';
interface Iprops {
  dataSource?: DataSource<any>;
  columns?: Column<any>[];
  loading?: boolean;
}

export default (props: Iprops) => {
  const { dataSource, columns, loading = false } = props;
  return (
    <Table
      loading={loading}
      dataSource={dataSource}
      className={styles.table}
      headerCls={styles.tableHead}
      columns={columns}
      rowCls={styles.tableRow}
      bodyCls={styles.tableBody}
    />
  );
};
