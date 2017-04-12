import React from 'react';
import {Link} from 'react-router';

import BaseTable from '../../../components/base/BaseTable';

import Edit from './Edit';

export default class Table extends BaseTable {
  render() {
    const columns = [
      {
        title: '配件名',
        dataIndex: 'name',
        key: 'name',
        render: (item, record) => {
          return <Link to={{pathname: '/warehouse/part/detail', query: {id: record._id}}}>{item}</Link>;
        },
      }, {
        title: '配件号',
        dataIndex: 'part_no',
        key: 'part_no',
      }, {
        title: '产值类型',
        dataIndex: 'maintain_type_name',
        key: 'maintain_type_name',
      }, {
        title: '规格',
        className: 'text-right',
        render: (value, record) => `${record.spec || ''}${record.unit || ''}`,
      }, {
        title: '配件分类',
        dataIndex: 'part_type_name',
        key: 'part_type_name',
      }, {
        title: '适用车型',
        dataIndex: 'scope',
        key: 'scope',
      }, {
        title: '品牌',
        dataIndex: 'brand',
        key: 'brand',
      }, {
        title: '库存数量/已冻结',
        dataIndex: 'amount',
        key: 'amount',
        className: 'text-right',
        render: (item, record) => <span>{item}/{record.freeze}</span>,
      }, {
        title: '当前进货价（元）',
        dataIndex: 'in_price',
        key: 'in_price',
        className: 'text-right',
      }, {
        title: '进货时间',
        dataIndex: 'ctime',
        key: 'ctime',
        className: 'center',
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'action',
        className: 'center',
        render: (id, record) => <Edit part={record} onSuccess={this.props.onSuccess} size="small"/>,
      },
    ];

    return this.renderTable(columns);
  }
}
