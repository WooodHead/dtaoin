import React from 'react';

import api from '../../middleware/api';
import BaseTable from '../../components/base/BaseTable';

import Edit from './EditNew';

export default class Table extends BaseTable {
  render() {
    const userInfo = api.getLoginUser();
    const self = this;
    const columns = [
      {
        title: '排序',
        dataIndex: 'order',
        key: 'order',
        width: '75px',
      }, {
        title: '项目名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '产值类型',
        dataIndex: 'type_name',
        key: 'type_name',
      }, {
        title: '工时档次',
        key: 'level',
        render(value, record) {
          const ele = [];
          if (record.levels.length > 0) {
            const levels = JSON.parse(record.levels);
            levels.map((item, index) => {
              ele.push(
                <div className="in-table-line" key={`${record._id  }-${  index}`}>
                  {item.name}
                </div>,
              );
            });
          }
          return ele;
        },
      }, {
        title: '工时单价',
        key: 'price',
        className: 'column-money',
        width: '80px',
        render(value, record) {
          const ele = [];
          if (record.levels.length > 0) {
            const levels = JSON.parse(record.levels);
            levels.map((item, index) => {
              ele.push(
                <div className="in-table-line column-money" key={`${record._id  }-${  index}`}>
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
        width: '70px',
        render(value, record) {
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
