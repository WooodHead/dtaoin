import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Tooltip } from 'antd';

import TableWithPagination from '../../../components/widget/TableWithPagination';

export default class TableIntention extends React.Component {
  render() {
    const { isFetching, page, total, list } = this.props;
    const columns = [
      {
        title: '客户姓名',
        dataIndex: 'customer_name',
        key: 'customer_name',
        width: 110,
      }, {
        title: '手机号',
        dataIndex: 'customer_phone',
        key: 'customer_phone',
        width: 110,
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
        width: 200,
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
        title: '融资类型',
        dataIndex: 'product_type_name',
        key: 'product_type_name',
        width: 90,
      }, {
        title: '状态',
        dataIndex: 'status_name',
        key: 'status_name',
        className: 'center',
        width: 95,
        render: (value, record) => {
          const statusValue = String(record.status);
          let statusLabel = 'default';

          switch (statusValue) {
          case '-1': // 交易取消
            statusLabel = 'error';
            break;
          case '0': // 意向
            statusLabel = 'default';
            break;
          case '1': // 待进件
            statusLabel = 'default';
            break;
          case '2': // 进件中
            statusLabel = 'processing';
            break;
          case '3': // 驳回
            statusLabel = 'warning';
            break;
          case '4': // 待交定金
            statusLabel = 'processing';
            break;
          case '5': // 签单中
            statusLabel = 'processing';
            break;
          case '6': // 贷后
            statusLabel = 'default';
            break;
          case '7': // 交易成功
            statusLabel = 'success';
            break;
          default:
            break;
          }

          return <Badge status={statusLabel} text={value} />;
        },
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'action',
        className: 'center',
        width: 48,
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

