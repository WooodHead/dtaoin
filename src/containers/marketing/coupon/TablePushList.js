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
        title: '序号',
        dataIndex: '_id',
        key: '_id',
        render(value, record, index) {
          return index + 1;
        },
      }, {
        title: '优惠券名称',
        dataIndex: 'target',
        key: 'name',
        render: value => {
          let target = {};
          try {
            target = JSON.parse(value);
          } catch (e) {
          }
          return target.coupon_item_info && target.coupon_item_info.name;
        },
      }, {
        title: '发放门店',
        dataIndex: 'company_name',
        key: 'company_name',
        className: api.isHeadquarters() ? '' : 'hide',
      }, {
        title: '发放对象',
        dataIndex: 'content',
        key: 'content',
      }, {
        title: '发放总数',
        dataIndex: 'customer_count',
        key: 'customer_count',
      }, {
        title: '发放时间',
        dataIndex: 'ctime',
        key: 'ctime',
      },
    ];
    return this.renderTable(columns);
  }
}
