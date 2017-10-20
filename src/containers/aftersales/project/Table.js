import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Tooltip } from 'antd';

import text from '../../../config/text';
import DateFormatter from '../../../utils/DateFormatter';

import BaseTable from '../../../components/base/BaseTable';
import TableWithPagination from '../../../components/widget/TableWithPagination';

import PayNow from './PayNow';
import PayRepayment from './PayRepayment';

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
        scroll={{ x: 977 }}
      />
    );
  }

  render() {
    const self = this;
    const columns = [
      {
        title: '车牌号',
        dataIndex: 'auto_plate_num',
        key: 'auto_plate_num',
        className: 'center',
        width: '90px',
      }, {
        title: '品牌',
        dataIndex: 'auto_brand_name',
        key: 'auto_brand_name',
        width: '103px',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 6) {
            return <span>{value}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          );
        },
      }, {
        title: '姓名',
        dataIndex: 'customer_name',
        key: 'customer_name',
        width: '110px',
        render(item, record) {
          return (
            <Link to={{ pathname: `/customer/detail/${record.customer_id}` }} target="_blank">
              {item} {Number(record.customer_gender) === 0
              ? '女士'
              : (Number(record.customer_gender) === 1 ? '男士' : '')}
            </Link>
          );
        },
      }, {
        title: '电话',
        dataIndex: 'customer_phone',
        key: 'customer_phone',
        width: '110px',
      }, {
        title: '维修项目',
        dataIndex: 'item_names',
        key: 'item_names',
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
        title: '金额',
        dataIndex: 'total_fee',
        key: 'total_fee',
        className: 'text-right',
        width: '95px',
        render: value => Number(value).toFixed(2),
      }, {
        title: '里程数',
        dataIndex: 'mileage',
        key: 'mileage',
        className: 'text-right',
        width: '70px',
      }, {
        title: '进厂时间',
        dataIndex: 'start_time',
        key: 'start_time',
        className: 'center',
        width: '130px',
        render: value => DateFormatter.getFormatTime(value),
      }, {
        title: '工单状态',
        dataIndex: 'pay_status',
        key: 'pay_status',
        className: 'center',
        width: '80px',
        render(value, record) {
          const status = String(record.status);
          const payStatus = String(value);

          const payStatusLabelText = text.project.payStatus[value];
          const statusLabelText = text.project.status[status];

          let payStatusLabel = 'default';
          let statusLabel = 'default';

          // 状态是服务中和作废
          if (status === '0' || status === '-1') {
            if (status === '0') {
              statusLabel = 'processing';
            } else if (status === '-1') {
              statusLabel = 'error';
            }
            return <Badge status={statusLabel} text={statusLabelText} />;
          }

          // 状态是待付款 挂账 已结算 坏账
          if (payStatus === '1') {
            payStatusLabel = 'processing';
          } else if (payStatus === '2') {
            payStatusLabel = 'success';
          } else if (payStatus === '3') {
            payStatusLabel = 'error';
          }
          return <Badge status={payStatusLabel} text={payStatusLabelText} />;
        },
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'operation',
        width: '94px',
        className: 'center',
        fixed: 'right',
        render(id, record) {
          const status = String(record.status);
          const payStatus = String(record.pay_status);

          const printOptionProps = {
            project_id: id,
            customer_id: record.customer_id,
            project: record,
            customer: { name: record.customer_name, phone: record.customer_phone },
            materialFee: record.material_fee_in,
            timeFee: record.time_fee,
            realTotalFee: record.total_fee,
          };
          return (
            <span>
              {status === '0' && (
                <Link
                  to={{ pathname: `/aftersales/project/edit/${id}/${record.auto_id}` }}
                  target="_blank">
                  编辑
                </Link>
              )}

              {['-1', '1'].indexOf(status) > -1 && (
                <Link
                  to={{ pathname: `/aftersales/project/detail/${id}/${record.auto_id}` }}
                  target="_blank">
                  详情
                </Link>
              )}

              {(payStatus === '0' || payStatus === '1') && (String(status) !== '-1') && (
                <span>
                <span className="ant-divider" />
                  {
                    String(payStatus) === '1' ? <PayRepayment
                      detail={record}
                      printOptionProps={printOptionProps}
                      size="small"
                    /> : <PayNow
                      detail={record}
                      printOptionProps={printOptionProps}
                      size="small"
                      onFinish={() => self.props.updateState({ reload: true })}
                    />
                  }
              </span>
              )}
            </span>
          );
        },
      },
    ];

    return this.renderTable(columns);
  }
}
