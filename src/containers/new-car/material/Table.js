import React from 'react';

import TableWithPagination from '../../../components/widget/TableWithPagination';

import Edit from './Edit';

export default class Table extends React.Component {
  handleOffline(id) {
    this.props.offLine(id);
  }

  render() {
    const self = this;
    const { isFetching, page, total, list, resourceList } = this.props;
    const columns = [
      {
        title: '序号',
        key: 'index',
        width: '48px',
        render: (value, record, index) => Number(index) + 1,
      }, {
        title: '材料名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '材料说明',
        dataIndex: 'remark',
        key: 'remark',
        width: '150px',
      }, {
        title: '资源方',
        dataIndex: 'resource_name',
        key: 'resource_name',
        width: '150px',
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'action',
        className: 'center',
        width: '100px',
        render(id, record) {
          return (
            <Edit detail={record} resourceList={resourceList} submit={self.props.materialEdit} />
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

