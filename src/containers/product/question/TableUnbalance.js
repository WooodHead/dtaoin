import React from 'react';
import {Link} from 'react-router';

import BaseTable from '../../../components/base/BaseTable';

import Shield from './Shield';

export default class TableUnbalance extends BaseTable {
  render() {
    const columns = [{
      title: '序号',
      dataIndex: '_id',
      key: 'index',
      className: 'width-80',
      render: (value, record, index) => index + 1,
    }, {
      title: '提问者',
      dataIndex: 'questioner_name',
      key: 'questioner_name',
      className: 'width-80',
    }, {
      title: '问题内容',
      dataIndex: 'content',
      key: 'content',
    }, {
      title: '提问时间',
      dataIndex: 'ctime',
      key: 'ctime',
      className: 'action-two',
    }, {
      title: '操作',
      dataIndex: '_id',
      key: 'option',
      className: 'center action-two',
      render (id, record) {
        return (
          <div>
            <Link to={{pathname: '/product/question/detail', query: {id}}}>查看</Link>

            {String(record.status) === '0' && (
              <span>
                <span className="ant-divider"/>
                <Shield id={id}/>
              </span>
            )}
          </div>
        );
      },
    }];

    return this.renderTable(columns);
  }
}
