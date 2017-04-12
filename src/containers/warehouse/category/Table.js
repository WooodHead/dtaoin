import React from 'react';

import api from '../../../middleware/api';

import BaseTable from '../../../components/base/BaseTable';

import Edit from './Edit';

export default class Table extends BaseTable {
  render() {
    let self = this;
    const columns = [
      {
        title: '序号',
        dataIndex: 'order',
        key: 'order',
      }, {
        title: '配件分类名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '配件档次',
        dataIndex: 'levels',
        key: 'level',
        render (value) {
          let ele = [];
          if (value.length > 0) {
            let levels = JSON.parse(value);
            levels.map(function (item, index) {
              ele.push(
                <div className="in-table-line" key={index}>
                  {item.name}
                </div>
              );
            });
          }
          return ele;
        },
      }, {
        title: '单价(元)',
        dataIndex: 'levels',
        key: 'price',
        render (value) {
          let ele = [];
          if (value.length > 0) {
            let levels = JSON.parse(value);
            levels.map(function (item, index) {
              ele.push(
                <div className="in-table-line column-money" key={index}>
                  {Number(item.price).toFixed(2)}
                </div>);
            });
          }
          return ele;
        },
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'operation',
        className: 'center width-80',
        render: (item, record) => (
          <Edit
            category={record}
            onSuccess={self.props.onSuccess}
            disabled={api.getLoginUser().companyId != record.company_id}
          />
        ),
      },
    ];

    return this.renderTable(columns);
  }
}
