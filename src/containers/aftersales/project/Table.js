import React from 'react';
import {Link} from 'react-router';
import {Badge} from 'antd';

import text from '../../../config/text';

import BaseTable from '../../../components/base/BaseTable';
import Pay from './Pay';

export default class Table extends BaseTable {
  render() {
    const columns = [
      {
        title: '工单编号',
        dataIndex: '_id',
        key: '_id',
        width: '5%',
      }, {
        title: '车牌号',
        dataIndex: 'auto_plate_num',
        key: 'auto_plate_num',
        width: '7%',
        className: 'center',
      }, {
        title: '车型',
        dataIndex: 'auto_type_name',
        key: 'auto_type_name',
        width: '10%',
      }, {
        title: '姓名',
        dataIndex: 'customer_name',
        key: 'customer_name',
        width: '5%',
        render(item, record){
          return (
            <Link to={{pathname: '/customer/detail', query: {customerId: record.customer_id}}}>
              {item} {record.customer_gender == 0 ? '女士' : (record.customer_gender == 1 ? '男士' : '')}
            </Link>
          );
        },
      }, {
        title: '电话',
        dataIndex: 'customer_phone',
        key: 'customer_phone',
        width: '9%',
      }, {
        title: '维修项目',
        dataIndex: 'item_names',
        key: 'item_names',
        width: '10%',
      }, {
        title: '工人',
        dataIndex: 'fitter_user_names',
        key: 'fitter_user_names',
        width: '8%',
      }, {
        title: '金额(元)',
        dataIndex: 'total_fee',
        key: 'total_fee',
        width: '6%',
        className: 'text-right',
      }, {
        title: '里程数(km)',
        dataIndex: 'mileage',
        key: 'mileage',
        width: '7%',
        className: 'text-right',
      }, {
        title: '创建时间',
        dataIndex: 'ctime',
        key: 'ctime',
        width: '12%',
        className: 'center',
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: '6%',
        className: 'center',
        render(value) {
          let statusValue = String(value);
          let statusLabel = 'default';

          if (statusValue === '0') {
            statusLabel = 'processing';
          } else if (statusValue === '1') {
            statusLabel = 'success';
          }

          return <Badge status={statusLabel} text={text.project.status[value]}/>;
        },
      }, {
        title: '结算状态',
        dataIndex: 'pay_status',
        key: 'pay_status',
        width: '6%',
        className: 'center',
        render(value, record) {
          let status = String(record.status);
          let payStatus = String(value);
          let payStatusLabel = text.project.payStatus[value];

          if (status === '0' || status === '-1') {
            return '--';
          }

          if (payStatus === '1') {
            return <span className="text-red">{payStatusLabel}</span>;
          } else if (payStatus === '2') {
            return <span className="text-success">{payStatusLabel}</span>;
          } else {
            return payStatusLabel;
          }
        },
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'operation',
        width: '10%',
        className: 'center action-two',
        render (id, record) {
          let status = String(record.status);
          let payStatus = String(record.pay_status);

          return (
            <span>
              {status === '0' && (
                <Link
                  to={{pathname: '/aftersales/project/edit', query: {id: id, auto_id: record.auto_id}}}
                  target="_blank">
                  编辑
                </Link>
              )}

              {['-1', '1'].indexOf(status) > -1 && (
                <Link
                  to={{pathname: '/aftersales/project/detail', query: {id: id, auto_id: record.auto_id}}}
                  target="_blank">
                  详情
                </Link>
              )}

              {status === '1' && payStatus !== '2' && (
                <span>
                  <span className="ant-divider"/>
                  <Pay
                    project_id={id}
                    customer_id={record.customer_id}
                    project={record}
                    customer={{name: record.customer_name, phone: record.customer_phone}}
                    materialFee={record.material_fee_in}
                    timeFee={record.time_fee}
                    realTotalFee={record.total_fee}
                    size="small"
                  />
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
