import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Popconfirm, message, Tooltip } from 'antd';

import api from '../../../middleware/api';
import DateFormatter from '../../../utils/DateFormatter';

import BaseTable from '../../../components/base/BaseTable';
import TableWithPagination from '../../../components/widget/TableWithPagination';

import AuthPay from './AuthPay';

export default class Table extends BaseTable {

  handleCancel(id) {
    api.ajax({
      type: 'post',
      url: api.warehouse.purchase.cancel(),
      data: { purchase_id: id },
    }, () => {
      message.success('取消成功');
      location.href = '/warehouse/purchase/index';
    });
  }

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
        scroll={{ x: 1263 }}
      />
    );
  }

  render() {
    const self = this;
    const columns = [
      {
        title: '开单时间',
        dataIndex: 'ctime',
        key: 'ctime',
        width: '130px',
        render: value => DateFormatter.getFormatTime(value),
      }, {
        title: '类型',
        dataIndex: 'type_name',
        key: 'type_name',
        width: '89px',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 5) {
            return <span>{value}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          );
        },
      }, {
        title: '供应商',
        dataIndex: 'supplier_company',
        key: 'supplier_company',
      }, {
        title: '采购金额',
        dataIndex: 'worth',
        key: 'worth',
        className: 'text-right',
        width: '80px',
        render: value => Number(value).toFixed(2),
      }, {
        title: '实付金额',
        dataIndex: 'unpay_worth',
        key: 'unpay_worth',
        className: 'text-right',
        width: '80px',
        render: (value, record) => Number(parseFloat(record.worth) - parseFloat(value)).toFixed(2),
      }, {
        title: '运费',
        dataIndex: 'freight',
        key: 'freight',
        className: 'text-right',
        width: '80px',
        render: value => Number(value).toFixed(2),
      }, {
        title: '经办人',
        dataIndex: 'purchase_user_name',
        key: 'purchase_user_name',
        width: '75px',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 4) {
            return <span>{value}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          );
        },
      }, {
        title: '审核人',
        dataIndex: 'import_user_name',
        key: 'import_user_name',
        className: 'center',
        width: '75px',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 4) {
            return <span>{value}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          );
        },
      }, {
        title: '状态',
        dataIndex: 'status_name',
        key: 'status_name',
        className: 'center',
        width: '80px',
        render: (value, record) => {
          const statusValue = String(record.status);
          let statusLabel = 'default';

          if (statusValue === '0') {
            statusLabel = 'error';
          } else if (statusValue === '1') {
            statusLabel = 'success';
          }

          return <Badge status={statusLabel} text={value} />;
        },
      }, {
        title: '入库时间',
        dataIndex: 'arrival_time',
        key: 'arrival_time',
        className: 'center',
        width: '130px',
        render: value => value && value.indexOf('0000') > -1 ? '--' : DateFormatter.getFormatTime(value),
      }, {
        title: '结算状态',
        dataIndex: 'pay_status_name',
        key: 'pay_status_name',
        className: 'center',
        width: '80px',
        render: (value, record) => {
          const payStatus = String(record.pay_status);
          let statusLabel = 'default';

          if (payStatus === '1') {
            statusLabel = 'error';
          } else if (payStatus === '2') {
            statusLabel = 'success';
          }

          return <Badge status={statusLabel} text={value} />;
        },
      }, {
        title: '结算时间',
        dataIndex: 'pay_time',
        key: 'pay_time',
        className: 'center',
        width: '130px',
        render: value => value && value.indexOf('0000') > -1 ? '--' : DateFormatter.getFormatTime(value),
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'action',
        className: 'center',
        width: '94px',
        fixed: 'right',
        render: (id, record) => {
          const status = String(record.status);
          const payStatus = String(record.pay_status);
          switch (status) {
          case '0': // 未入库
            return (
                <span>
                  <Link to={{ pathname: `/warehouse/purchase/edit/${id}` }}>编辑</Link>

                  <span className="ant-divider" />

                  <Popconfirm
                    placement="topRight"
                    title="你确定要取消该进货单吗，取消后不可恢复"
                    onConfirm={self.handleCancel.bind(self, id)}
                  >
                  <a href="javascript:">取消</a>
                </Popconfirm>
                </span>
            );
          case '1': // 已入库
            return (
                <span>
                  <Link to={{ pathname: `/warehouse/purchase/detail/${id}` }}>查看</Link>

                  {payStatus === '2' ? null : <span>
                      <span className="ant-divider" />
                      <AuthPay id={id} detail={record} size="small" />
                    </span>
                  }
                </span>
            );
          default: // -1 已取消
            return <Link to={{ pathname: `/warehouse/purchase/detail/${id}` }}>查看</Link>;
          }
        },
      },
    ];

    return this.renderTable(columns);
  }
}
