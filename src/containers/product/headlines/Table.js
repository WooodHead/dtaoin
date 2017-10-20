import React from 'react';
import { message, Popconfirm } from 'antd';

import api from '../../../middleware/api';
import formatter from '../../../utils/DateFormatter';

import BaseTable from '../../../components/base/BaseTable';

import Edit from './Edit';

export default class Table extends BaseTable {

  handleOffline(id) {
    api.ajax({
      url: api.headlines.offline(),
      type: 'POST',
      data: { news_id: id },
    }, () => {
      message.success('头条下线成功');
      this.props.onSuccess();
    }, () => {
      message.error('头条下线失败');
    });
  }

  render() {
    const self = this;
    const columns = [{
      title: '位置',
      dataIndex: 'order',
      key: 'order',
    }, {
      title: '标题',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '上线时间',
      dataIndex: 'online_time',
      key: 'online_time',
    }, {
      title: '下线时间',
      dataIndex: 'offline_time',
      key: 'offline_time',
    }, {
      title: '链接',
      dataIndex: 'url',
      key: 'url',
      render (value) {
        let sub = value.substring(0, 100);
        if (value.length > 100) {
          sub += '...';
        }
        return <a href={value} title={value} target="_blank">{sub}</a>;
      },
    }, {
      title: '操作',
      dataIndex: '_id',
      key: 'action',
      className: 'center',
      render (id, record) {
        return (
          <span>
            <Edit news={record} onSuccess={self.props.onSuccess}/>

            <span className="ant-divider"/>
            {record.status !== '0' || record.offline_time <= formatter.date(new Date()) ?
              <span className="text-gray">下线</span> :
              <Popconfirm
                placement="topRight"
                title="确定要下线吗？"
                onConfirm={self.handleOffline.bind(self, id)}
              >
                <a href="javascript:">下线</a>
              </Popconfirm>
            }
          </span>
        );
      },
    }];

    return this.renderTable(columns);
  }
}
