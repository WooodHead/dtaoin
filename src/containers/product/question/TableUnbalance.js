import React from 'react';
import { Link } from 'react-router-dom';

import BaseTable from '../../../components/base/BaseTable';
import TableWithPagination from '../../../components/widget/TableWithPagination';

import Shield from './Shield';

export default class TableUnbalance extends BaseTable {

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
        rowSelection={this.props.rowSelection}
      />
    );
  }

  render() {
    const self = this;
    const columns = [
      {
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
              <Link to={{ pathname: `/product/question/detail/${id}` }}>查看</Link>

              {String(record.status) === '0' && (
                <span>
                <span className="ant-divider" />
                <Shield id={id} handleSuccess={self.props.onSuccess} />
              </span>
              )}
            </div>
          );
        },
      }];

    return this.renderTable(columns);
  }
}
