import React from 'react';
import {Link} from 'react-router';

import BaseTable from '../../../components/base/BaseTable';

import AuthPopover from './AuthPopover';
import CreateRemind from '../../../components/widget/CreateRemind';

export default class Table extends BaseTable {

  componentDidMount() {
    this.getList(this.props);
  }

  render() {
    const columns = [{
      title: '姓名',
      dataIndex: 'customer_name',
      key: 'customer_name',
      render: (value, record) => {
        return <Link to={{pathname: '/customer/detail', query: {customerId: record.customer_id}}}>{value}</Link>;
      },
    }, {
      title: '手机号',
      dataIndex: 'customer_phone',
      key: 'customer_phone',
    }, {
      title: '车牌号',
      dataIndex: 'auto_plate_num',
      key: 'auto_plate_num',
    }, {
      title: '购买车型',
      dataIndex: 'auto_type_name',
      key: 'auto_type_name',
    }, {
      title: '成交时间',
      dataIndex: 'deal_date',
      key: 'deal_date',
    }, {
      title: '销售姓名',
      dataIndex: 'seller_user_name',
      key: 'seller_user_name',
    }, {
      title: '结算状态',
      dataIndex: 'pay_status_name',
      key: 'pay_status_name',
      className: 'center',
      render: (value, record) => {
        if (String(record.pay_status) === '0') {
          return <span className="text-red">{value}</span>;
        } else {
          return <span className="text-success">{value}</span>;
        }
      },
    }, {
      title: '操作',
      dataIndex: '_id',
      key: 'action',
      className: 'center action-three',
      render: (id, record) => {
        return (
          <span key={id}>
              <Link to={{
                pathname: '/presales/deal/detail',
                query: {
                  autoDealId: id,
                  customerId: record.customer_id,
                  autoId: record.auto_id,
                  intentionId: record.intention_id,
                },
              }}>详情</Link>

              <span className="ant-divider"/>
              <AuthPopover detail={record} size="small"/>

              <span className="ant-divider"/>
              <CreateRemind customer_id={record.customer_id} size="small"/>
            </span>
        );
      },
    }];

    return this.renderTable(columns);
  }
}
