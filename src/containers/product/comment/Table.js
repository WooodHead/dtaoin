import React from 'react';
import {Link} from 'react-router';

import BaseTable from '../../../components/base/BaseTable';

export default class Table extends BaseTable {
  render() {
    const columns = [{
      title: '门店',
      dataIndex: 'company_name',
      key: 'company_name',
    }, {
      title: '姓名',
      dataIndex: 'customer_name',
      key: 'customer_name',
    }, {
      title: '电话',
      dataIndex: 'customer_phone',
      key: 'customer_phone',
    }, {
      title: '车牌号',
      dataIndex: 'plate_num',
      key: 'plate_num',
    }, {
      title: '车型',
      dataIndex: 'auto_type_name',
      key: 'auto_type_name',
    }, {
      title: '服务态度',
      dataIndex: 'attitude',
      key: 'attitude',
      render: (value) => <span>{value}星</span>,
    }, {
      title: '施工质量',
      dataIndex: 'quality',
      key: 'quality',
      render: (value) => <span>{value}星</span>,
    }, {
      title: '店面环境',
      dataIndex: 'environment',
      key: 'environment',
      render: (value) => <span>{value}星</span>,
    }, {
      title: '评价',
      dataIndex: 'remark',
      key: 'remark',
    }, {
      title: '打分时间',
      dataIndex: 'ctime',
      key: 'ctime',
    }, {
      title: '操作',
      dataIndex: '_id',
      key: 'action',
      className: 'center',
      render: (value, record) => {
        return (
          <Link
            to={{
              pathname: '/aftersales/project/detail',
              query: {
                id: record.intention_id,
                customer_id: record.customer_id,
                auto_id: record.auto_id,
              },
            }} target="_blank">
            查看工单
          </Link>
        );
      },
    }];

    return this.renderTable(columns);
  }
}
