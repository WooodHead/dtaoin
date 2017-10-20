import React from 'react';
import BaseTable from '../../../components/base/BaseTable';
import api from '../../../middleware/api';
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
        pageSize={5}
      />
    );
  }

  render() {
    const columns = [
      {
        title: '活动名称',
        dataIndex: 'target',
        key: 'title',
        render: value => {
          let target = {};
          try {
            target = JSON.parse(value);
          } catch (e) {
          }
          return target.coupon_activity_info && target.coupon_activity_info.title;
        },
      }, {
        title: '推送门店',
        dataIndex: 'company_name',
        key: 'company_name',
        className: api.isHeadquarters() ? '' : 'hide',
      }, {
        title: '推送对象',
        dataIndex: 'content',
        key: 'content',
      }, {
        title: '推送总数',
        dataIndex: 'customer_count',
        key: 'customer_count',
      }, {
        title: '推送时间',
        dataIndex: 'ctime',
        key: 'ctime',
      },
    ];
    return this.renderTable(columns);
  }
}
