import React from 'react';
import BaseTable from '../../../components/base/BaseTable';

export default class Table extends BaseTable {
  render() {
    const columns = [
      {
        title: '序号',
        key: 'index',
        render: (value, record, index) => index + 1,
      }, {
        title: '微信昵称',
        dataIndex: 'nick_name',
        key: 'nick_name',
      }, {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
      }, {
        title: '领取时间',
        dataIndex: 'ctime',
        key: 'ctime',
      }];

    return this.renderTable(columns);
  }
}
