import React from 'react';
import { message, Popconfirm } from 'antd';

import api from '../../../middleware/api';
import formatter from '../../../utils/DateFormatter';

import TableWithPagination from '../../../components/widget/TableWithPagination';

import Edit from './Edit';

export default class Table extends React.Component {
  handleOffline(id) {
    api.ajax({
      url: api.activity.offline(),
      type: 'POST',
      data: { activity_id: id },
    }, () => {
      message.success('活动下线成功');
      this.props.onSuccess();
    }, () => {
      message.error('活动下线失败');
    });
  }

  render() {
    const self = this;
    const { isFetching, page, total, list } = this.props;
    const columns = [
      {
        title: '上线时间',
        dataIndex: 'online_time',
        key: 'online_time',
      }, {
        title: '下线时间',
        dataIndex: 'offline_time',
        key: 'offline_time',
      }, {
        title: '位置',
        dataIndex: 'order',
        key: 'order',
      }, {
        title: '标题',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '链接',
        dataIndex: 'url',
        key: 'url',
        render(value) {
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
        render(id, record) {
          return (
            <span>
            <Edit activity={record} onSuccess={self.props.onSuccess} />

            <span className="ant-divider" />

              {record.status !== '0' || record.offline_time <= formatter.date(new Date()) ?
                <span className="text-gray">下线</span> : <Popconfirm
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

    return (
      <TableWithPagination
        isLoading={isFetching}
        columns={columns}
        dataSource={list}
        total={total}
        currentPage={page}
        onPageChange={this.props.updatePage}
      />
    );
  }
}

