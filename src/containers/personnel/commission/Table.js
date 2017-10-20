import React from 'react';
import { Tooltip, Icon } from 'antd';

import text from '../../../config/text';

import BaseTable from '../../../components/base/BaseTable';
import PersonList from './PersonList';

export default class Table extends BaseTable {

  render() {
    const month = (
      <div>
        <span className="mr10">发放月份</span>
        <Tooltip placement="top" title="发放月份以自然月为准。即：若发放月份为10月，为10月1日至10月31日。">
          <Icon type="question-circle-o" />
        </Tooltip>
      </div>
    );

    const self = this;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'user_info',
        key: 'user_info_name',
        width: '110px',
        render: value => value.name,
      }, {
        title: '部门',
        dataIndex: 'user_info',
        key: 'user_info_department',
        width: '75px',
        render: value => text.department[value.department],
      }, {
        title: '职位',
        dataIndex: 'user_info',
        key: 'user_info_role_name',
        width: '75px',
        render: value => value.role_name,
      }, {
        title: '薪资组',
        dataIndex: 'user_info',
        key: 'user_info_salary_groups',
        render: value => value.salary_groups,
      }, {
        title: month,
        width: '103px',
        render: () => {
          let month = self.props.month.split('-')[1];
          if (String(month[0]) === '0') {
            month = month.substr(1, month.length - 1);
          }
          return `${month  }月`;
        },
      }, {
        title: '当月提成',
        dataIndex: 'merit_pay',
        key: 'merit_pay',
        className: 'text-right',
        width: '75px',
        render: value => Number(value).toFixed(2),
      }, {
        title: '操作',
        className: 'center',
        width: '90px',
        render: (value, record) => <PersonList month={self.props.month} detail={record} />,
      },
    ];

    return this.renderTable(columns);
  }
}
