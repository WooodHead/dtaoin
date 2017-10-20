import React from 'react';
import { Popconfirm } from 'antd';

import TableWithPagination from '../../../components/widget/TableWithPagination';

import Edit from './Edit';

export default class Table extends React.Component {
  handleOffline(id) {
    this.props.offLine(id);
  }

  render() {
    const self = this;
    const { isFetching, page, total, list } = this.props;
    const columns = [
      {
        title: '位置',
        dataIndex: 'order',
        key: 'order',
        width: '80px',
      }, {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
      }, {
        title: 'URL',
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
        title: '创建时间',
        dataIndex: 'ctime',
        key: 'ctime',
        width: '150px',
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'action',
        className: 'center',
        width: '100px',
        render(id, record) {
          return (
            <span>
            <Edit detail={record} onSuccess={self.props.onSuccess} submit={self.props.submit} />
            <span className="ant-divider" />
              {record.status !== '0' ? <span className="text-gray">下线</span> : <Popconfirm
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

