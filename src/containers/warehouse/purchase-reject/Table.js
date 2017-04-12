import React from 'react';
import {Link} from 'react-router';
import {Badge, Popconfirm, message} from 'antd';

import api from '../../../middleware/api';

import BaseTable from '../../../components/base/BaseTable';

import AuthPay from './AuthPay';

export default class Table extends BaseTable {

  handleCancel(id) {
    api.ajax({
      type: 'post',
      url: api.warehouse.reject.cancel(),
      data: {reject_id: id},
    }, () => {
      message.success('取消成功');
      location.href = '/warehouse/purchase-reject/index';
    });
  }

  render() {
    let self = this;
    const columns = [
      {
        title: '开单时间',
        dataIndex: 'ctime',
        key: 'ctime',
      }, {
        title: '供应商',
        dataIndex: 'supplier_company',
        key: 'supplier_company',
      }, {
        title: '退货金额(元)',
        dataIndex: 'old_worth',
        key: 'old_worth',
        className: 'text-right',
        render: value => Number(value).toFixed(2),
      }, {
        title: '退款金额(元)',
        dataIndex: 'new_worth',
        key: 'new_worth',
        className: 'text-right',
      }, {
        title: '退款差价(元)',
        dataIndex: 'diff_worth',
        key: 'diff_worth',
        className: 'text-right',
      }, {
        title: '运费(元)',
        dataIndex: 'freight',
        key: 'freight',
        className: 'text-right',
      }, {
        title: '经办人',
        dataIndex: 'reject_user_name',
        key: 'reject_user_name',
        className: 'center',
      }, {
        title: '审核人',
        dataIndex: 'export_user_name',
        key: 'export_user_name',
        className: 'center',
      }, {
        title: '状态',
        dataIndex: 'status_name',
        key: 'status_name',
        className: 'center',
        render: (value, record) => {
          let statusValue = String(record.status);
          let statusLabel = 'default';

          if (statusValue === '0') {
            statusLabel = 'error';
          } else if (statusValue === '1') {
            statusLabel = 'success';
          }

          return <Badge status={statusLabel} text={value}/>;
        },
      }, {
        title: '出库时间',
        dataIndex: 'export_time',
        key: 'export_time',
        className: 'center',
        render: value => value.indexOf('0000') > -1 ? null : value,
      }, {
        title: '结算状态',
        dataIndex: 'pay_status_name',
        key: 'pay_status_name',
        className: 'center',
        render: (value, record) => {
          let payStatus = String(record.pay_status);

          if (payStatus === '1' && String(record.status) === '1') {
            return <span className="text-red">{value}</span>;
          } else if (payStatus === '2') {
            return <span className="text-success">{value}</span>;
          } else {
            return value;
          }
        },
      }, {
        title: '结算时间',
        dataIndex: 'pay_time',
        key: 'pay_time',
        className: 'center',
        render: value => value.indexOf('0000') > -1 ? '--' : value,
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'action',
        className: 'center',
        render: (id, record) => {
          let status = String(record.status);
          let payStatus = String(record.pay_status);
          switch (status) {
            case '0': // 未出库
              return (
                <span>
                  <Link to={{pathname: '/warehouse/purchase-reject/edit', query: {id}}}>编辑</Link>

                  <span className="ant-divider"/>

                  <Popconfirm
                    placement="topRight"
                    title="你确定要取消该退货单吗，取消后不可恢复"
                    onConfirm={self.handleCancel.bind(self, id)}
                  >
                  <a href="javascript:">取消</a>
                </Popconfirm>
                </span>
              );
            case '1': // 已出库
              return (
                <span>
                  <Link to={{pathname: '/warehouse/purchase-reject/detail', query: {id}}}>查看</Link>

                  {payStatus === '2' ? <span/> :
                    <span>
                      <span className="ant-divider"/>
                      <AuthPay id={id} detail={record} size="small"/>
                    </span>
                  }
                </span>
              );
            default: // -1 已取消
              return <Link to={{pathname: '/warehouse/purchase-reject/detail', query: {id}}}>查看</Link>;
          }
        },
      },
    ];

    return this.renderTable(columns);
  }
}
