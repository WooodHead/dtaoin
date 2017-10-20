import React from 'react';
import { Tooltip, Icon } from 'antd';

import BaseTable from '../../components/base/BaseTable';

import TableWithPagination from '../../components/widget/TableWithPagination';

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
        rowKey={record => record.date}
      />
    );
  }

  render() {
    const itemTitle = (
      <div>
        <span className="mr10">营业额</span>
        <Tooltip placement="topRight" title={
          <span>此处营业额在各类型营业额加和的基础上扣减了整单优惠</span>
        }>
          <Icon type="question-circle-o" />
        </Tooltip>
      </div>
    );

    const columns = [
      {
        title: '日期',
        dataIndex: 'date',
        key: 'date',
      }, {
        title: '洗车',
        dataIndex: 'content',
        key: '洗车',
        className: 'text-right',
        render: value => Number(value['洗车']).toFixed(2),
      }, {
        title: '美容',
        dataIndex: 'content',
        key: '美容',
        className: 'text-right',
        render: value => Number(value['美容']).toFixed(2),
      }, {
        title: '保养',
        dataIndex: 'content',
        key: '保养',
        className: 'text-right',
        render: value => Number(value['保养']).toFixed(2),
      }, {
        title: '轮胎',
        dataIndex: 'content',
        key: '轮胎',
        className: 'text-right',
        render: value => Number(value['轮胎']).toFixed(2),
      }, {
        title: '钣喷',
        dataIndex: 'content',
        key: '钣喷',
        className: 'text-right',
        render: value => Number(value['钣喷']).toFixed(2),
      }, {
        title: '维修',
        dataIndex: 'content',
        key: '维修',
        className: 'text-right',
        render: value => Number(value['维修']).toFixed(2),
      }, {
        title: '配件销售',
        dataIndex: 'content',
        key: '配件销售',
        className: 'text-right',
        render: value => Number(value['配件销售']).toFixed(2),
      }, {
        title: '套餐卡',
        dataIndex: 'content',
        key: '套餐卡',
        className: 'text-right',
        render: value => Number(value['套餐卡']).toFixed(2),
      }, {
        title: '整单优惠',
        dataIndex: 'coupon_fee',
        key: 'coupon_fee',
        className: 'text-right',
        render: value => Number(value).toFixed(2),
      }, {
        title: itemTitle,
        dataIndex: 'content',
        key: '营业额',
        className: 'text-right',
        render: (value, record) => {
          let total = 0;
          for (const key in value) {
            if (value.hasOwnProperty(key)) {
              total += Number(value[key]);
            }
          }

          total -= record.coupon_fee;
          return total.toFixed(2);
        },
      }];

    return this.renderTable(columns);
  }
}
