import React from 'react';
import { Popconfirm } from 'antd';

import formatter from '../../../utils/DateFormatter';

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
        title: '资源方名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '联系人',
        dataIndex: 'contact',
        key: 'contact',
      }, {
        title: '电话',
        dataIndex: 'telphone',
        key: 'telphone',
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'action',
        className: 'center',
        width: '100px',
        render(id, record) {
          return (
            <span>
            <Edit detail={record} submit={self.props.resourceEdit} />
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

