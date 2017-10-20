import React from 'react';
import BaseTable from '../../../components/base/BaseTable';

import TableWithPagination from '../../../components/widget/TableWithPagination';

export default class Table extends BaseTable {

  renderTable(columns) {
    const { isFetching, list, total } = this.state;

    return (
      <TableWithPagination
        isLoading={isFetching}
        columns={columns}
        dataSource={list}
        total={total}
        currentPage={this.props.page}
        onPageChange={this.handlePageChange}
        pageSize={30}
        bordered={false}
        scroll={{ y: 795 }}
      />
    );
  }

  render() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: '20%',
        className: 'center',
        render: (value, record, index) => index + 1,
      }, {
        title: '二级分类',
        dataIndex: 'name',
        key: 'name',
        width: '20%',
        className: 'center',
      }, {
        title: '产值类型',
        dataIndex: 'maintain_type_name',
        key: 'maintain_type_name',
        width: '20%',
        className: 'center',
      },
    ];

    return this.renderTable(columns);
  }
}
