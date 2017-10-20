import React from 'react';

import BaseTable from '../../../components/base/BaseTable';
import DateFormatter from '../../../utils/DateFormatter';

export default class Table extends BaseTable {
  render() {
    const columns = [
      {
        title: '序号',
        key: 'index',
        render: (value, record, index) => index + 1,
      }, {
        title: '微信头像',
        dataIndex: 'avatar_url',
        key: 'avatar_url',
        width: '75px',
        render: value => (
            <img src={value} style={{
              width: '34px',
              height: '34px',
              borderRadius: '17px',
              marginBottom: '-6px',
            }} />
          ),
      }, {
        title: '微信昵称',
        dataIndex: 'nick_name',
        key: 'nick_name',
      }, {
        title: '砍价金额',
        dataIndex: 'bargain_price',
        key: 'bargain_price',
        className: 'text-right',
        render: value => Number(value).toFixed(2),
      }, {
        title: '砍价时间',
        dataIndex: 'ctime',
        key: 'ctime',
        width: '130px',
        render: value => value && value.indexOf('0000') > -1 ? '--' : DateFormatter.getFormatTime(value),
      }];

    return this.renderTable(columns);
  }
}
