import React from 'react';
import {Link} from 'react-router';

import text from '../../../config/text';

import BaseTable from '../../../components/base/BaseTable';

import Pay from './Pay';

export default class Table extends BaseTable {

  componentWillReceiveProps(nextProps) {
    if (this.props.source != nextProps.source) {
      this.getList(nextProps);
    }
    if (JSON.stringify(this.props.selectedItem) != JSON.stringify(nextProps.selectedItem)) {
      this.setState({list: [nextProps.selectedItem], total: 1});
    }
  }

  render() {
    const columns = [
      {
        title: '销售单号',
        dataIndex: '_id',
        key: '_id',
      }, {
        title: '姓名',
        className: 'center',
        dataIndex: 'customer_name',
        key: 'customer_name',
      }, {
        title: '电话',
        dataIndex: 'customer_phone',
        key: 'customer_phone',
      }, {
        title: '配件名称',
        dataIndex: 'part_names',
        key: 'part_names',
      }, {
        title: '销售人员',
        dataIndex: 'sell_user_name',
        key: 'sell_user_name',
      }, {
        title: '金额(元)',
        dataIndex: 'real_amount',
        key: 'real_amount',
        className: 'text-right',
      }, {
        title: '创建时间',
        dataIndex: 'ctime',
        key: 'ctime',
      }, {
        title: '结算状态',
        dataIndex: 'status',
        key: 'status',
        className: 'center',
        render: value => {
          let statusLabel = text.project.payStatus[value];
          let className = Number(value) === 2 ? 'text-success' : (Number(value) === 1 ? 'text-red' : '');
          return <span className={className}>{statusLabel}</span>;
        },
      }, {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        className: 'center',
        width: '10%',
        render: (value, record) => {
          let textLabel = Number(record.status) === 0 ? '编辑' : '详情';
          return (
            <div>
              <Link
                to={{pathname: '/aftersales/part-sale/edit', query: {id: record._id}}}
                target="_blank"
              >
                {textLabel}
              </Link>
              <span className="ant-divider"/>
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
