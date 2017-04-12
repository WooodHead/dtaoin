import React from 'react';

import BaseTable from '../../components/base/BaseTable';

import Edit from './Edit';
import SwitchCompany from './SwitchCompany';

export default class Table extends BaseTable {
  render() {
    let self = this;
    const columns = [{
      title: '门店编号',
      dataIndex: 'company_num',
      key: 'company_num',
    }, {
      title: '门店名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '省份',
      dataIndex: 'province',
      key: 'province',
    }, {
      title: '城市',
      dataIndex: 'city',
      key: 'city',
    }, {
      title: '区县',
      dataIndex: 'country',
      key: 'country',
    }, {
      title: '详细地址',
      dataIndex: 'address',
      key: 'address',
    }, {
      title: '店总负责人',
      dataIndex: 'admin_name',
      key: 'admin_name',
    }, {
      title: '负责人电话',
      dataIndex: 'admin_phone',
      key: 'admin_phone',
    }, {
      title: '其他联系人',
      dataIndex: 'other_name',
      key: 'other_name',
    }, {
      title: '联系电话',
      dataIndex: 'other_phone',
      key: 'other_phone',
    }, {
      title: '服务电话',
      dataIndex: 'service_phone',
      key: 'service_phone',
    }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      className: 'center',
      render: function (value, record) {
        return (
          <span>
            <Edit company={record} onSuccess={self.props.onSuccess}/>

            <span className="ant-divider"/>

            <SwitchCompany company={record}/>
          </span>
        );
      },
    }];

    return this.renderTable(columns);
  }
}
