import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'antd';

import TableWithPagination from '../../../components/widget/TableWithPagination';

export default class Table extends React.Component {
  render() {
    const { isFetching, page, total, list } = this.props;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'customer_name',
        key: 'customer_name',
        width: '110px',
      }, {
        title: '车辆名称',
        dataIndex: 'auto_type_name',
        key: 'auto_type_name',
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
        title: '产品名称',
        dataIndex: 'product_name',
        key: 'product_name',
      }, {
        title: '资源方',
        dataIndex: 'resource_name',
        key: 'resource_name',
      }, {
        title: '区域',
        dataIndex: 'company_city',
        key: 'company_city',
        render: (value, record) => `${record.company_province} ${value === '市辖区' ? '' : value}`,
      }, {
        title: '收益',
        dataIndex: 'total',
        key: 'total',
        className: 'text-right',
        width: '100px',
        render: value => Number(value).toFixed(2),
      }, {
        title: '成交时间',
        dataIndex: 'ctime',
        key: 'ctime',
        width: '150px',
      }, {
        title: '操作',
        key: 'action',
        dataIndex: 'order_id',
        className: 'center',
        width: '48px',
        render: value => (
          <Link
            to={{ pathname: `/new-car/order/detail/${value}` }}
            target="_blank">
            查看
          </Link>
        ),
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

