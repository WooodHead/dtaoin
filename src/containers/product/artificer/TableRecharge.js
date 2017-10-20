import React from 'react';
import BaseTable from '../../../components/base/BaseTable';

export default class Table extends BaseTable {
  render() {
    const columns = [
      {
        title: '充值时间',
        dataIndex: 'ctime',
        key: 'ctime',
      }, {
        title: '充值金额',
        dataIndex: 'amount',
        key: 'amount',
        render: value => value && Number(value).toFixed(2),
      },
    ];

    return this.renderTable(columns);
  }
}
