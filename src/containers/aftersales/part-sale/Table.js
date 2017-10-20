import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Tooltip } from 'antd';

import text from '../../../config/text';
import BaseTable from '../../../components/base/BaseTable';
import DateFormatter from '../../../utils/DateFormatter';

import Pay from './Pay';

export default class Table extends BaseTable {

  componentWillReceiveProps(nextProps) {
    if (this.props.source != nextProps.source) {
      this.getList(nextProps);
    }
    if (JSON.stringify(this.props.selectedItem) != JSON.stringify(nextProps.selectedItem)) {
      this.setState({ list: [nextProps.selectedItem], total: 1 });
    }
  }

  render() {
    const columns = [
      {
        title: '销售单号',
        dataIndex: '_id',
        key: '_id',
        width: '150px',
      }, {
        title: '姓名',
        dataIndex: 'customer_name',
        key: 'customer_name',
        width: '110px',
      }, {
        title: '电话',
        dataIndex: 'customer_phone',
        key: 'customer_phone',
        width: '120px',
      }, {
        title: '配件名称',
        dataIndex: 'part_names',
        key: 'part_names',
      }, {
        title: '销售人员',
        dataIndex: 'sell_user_name',
        key: 'sell_user_name',
        width: '75px',
        render: value => {
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
        title: '金额(元)',
        dataIndex: 'real_amount',
        key: 'real_amount',
        className: 'text-right',
        width: '95px',
      }, {
        title: '创建时间',
        dataIndex: 'ctime',
        key: 'ctime',
        width: '130px',
        render: value => DateFormatter.getFormatTime(value),
      }, {
        title: '结算状态',
        dataIndex: 'status',
        key: 'status',
        className: 'center',
        width: '80px',
        render: value => {
          const statusLabel = text.project.payStatus[value];
          const status = Number(value) === 2 ? 'success' : (Number(value) === 1
            ? 'error'
            : 'processing');
          return <Badge status={status} text={statusLabel} />;
        },
      }, {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        className: 'center',
        width: '94px',
        render: (value, record) => {
          const textLabel = Number(record.status) === 0 ? '编辑' : '详情';
          return (
            <div>
              <Link to={{ pathname: `/aftersales/part-sale/edit/${record._id}` }} target="_blank">
                {textLabel}
              </Link>
              <span className="ant-divider" />
              <Pay
                status={record.status}
                orderId={record._id}
                size="small"
              />
            </div>
          );
        },
      }];
    return this.renderTable(columns);
  }
}
