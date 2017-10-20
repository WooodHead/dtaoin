import React from 'react';
import { Tooltip } from 'antd';

import BaseTable from '../../../components/base/BaseTable';
import TableWithPagination from '../../../components/widget/TableWithPagination';

import EditStatus from './EditStatus';
import Detail from './Detail';
import UseLog from './UseLog';

export default class List extends BaseTable {
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
        scroll={{ x: 1200 }}
      />
    );
  }

  render() {
    const self = this;
    const columns = [
      {
        title: '资产名称',
        dataIndex: 'name',
        key: 'name',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 8) {
            return <span>{value}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          );
        },
      }, {
        title: '品牌 型号',
        dataIndex: 'brand',
        key: 'brand',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 8) {
            return <span>{value}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          );
        },
      }, {
        title: '购买日期',
        dataIndex: 'buy_date',
        key: 'buy_date',
        width: '110px',
      }, {
        title: '购入单价',
        dataIndex: 'unit_price',
        key: 'unit_price',
        width: '80px',
        render: value => Number(value).toFixed(2),
      }, {
        title: '数量',
        dataIndex: 'total_count',
        key: 'total_count',
        width: '50px',
      }, {
        title: '总值',
        dataIndex: 'total_price',
        key: 'total_price',
        width: '105px',
        render: value => Number(value).toFixed(2),
      }, {
        title: '正常',
        dataIndex: 'zhengchang_count',
        key: 'zhengchang_count',
        width: '50px',
      }, {
        title: '维修',
        dataIndex: 'weixiu_count',
        key: 'weixiu_count',
        width: '50px',
      }, {
        title: '出借',
        dataIndex: 'chujie_count',
        key: 'chujie_count',
        width: '50px',
      }, {
        title: '丢失',
        dataIndex: 'diushi_count',
        key: 'diushi_count',
        width: '50px',
      }, {
        title: '报废',
        dataIndex: 'baofei_count',
        key: 'baofei_count',
        width: '50px',
      }, {
        title: '负责人',
        dataIndex: 'incharge_user_name',
        key: 'incharge_user_name',
        width: '75px',
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'action',
        className: 'center',
        width: '220px',
        fixed: 'right',
        render(value, record) {
          return (
            <span>
            <EditStatus _id={value} onSuccess={self.props.onSuccess} size="small" />
            <span className="ant-divider" />

            <Detail detail={record} size="small" />
            <span className="ant-divider" />
            
            <UseLog _id={value} detail={record} size="small" />
          </span>
          );
        },
      }];

    return this.renderTable(columns);
  }
}
