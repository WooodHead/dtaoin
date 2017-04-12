import React from 'react';

import api from '../../middleware/api';
import BaseTable from '../../components/base/BaseTable';

import Edit from './EditNew';

export default class Table extends BaseTable {
  render() {
    let userInfo = api.getLoginUser();
    let self = this;
    const columns = [{
      title: '排序',
      dataIndex: 'order',
      key: 'order',
    }, {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '产值类型',
      dataIndex: 'type_name',
      key: 'type_name',
    }, {
      title: '配件分类',
      dataIndex: 'part_type_list',
      key: 'part_types',
      className: 'no-padding',
      render (value) {
        let ele = [];
        if (value.length > 0) {
          value.map(item => ele.push(item.name));
        }
        return ele.join(',');
      },
    }, {
      title: '工时档次',
      key: 'level',
      className: 'no-padding',
      render (value, record) {
        let ele = [];
        if (record.levels.length > 0) {
          let levels = JSON.parse(record.levels);
          levels.map(function (item, index) {
            ele.push(
              <div className="in-table-line" key={record._id + '-' + index}>
                {item.name}
              </div>
            );
          });
        }
        return ele;
      },
    }, {
      title: '工时单价(元)',
      key: 'price',
      className: 'column-money',
      render (value, record) {
        let ele = [];
        if (record.levels.length > 0) {
          let levels = JSON.parse(record.levels);
          levels.map(function (item, index) {
            ele.push(
              <div className="in-table-line column-money" key={record._id + '-' + index}>
                {Number(item.price).toFixed(2)}
              </div>);
          });
        }
        return ele;
      },
    }, {
      title: '操作',
      key: 'option',
      className: 'center',
      width: '5%',
      render (value, record) {
        return (
          <Edit
            item={record}
            disabled={userInfo.companyId != record.company_id}
            onSuccess={self.props.onSuccess}
            size="small"
          />
        );
      },
    }];

    return this.renderTable(columns);
  }
}
