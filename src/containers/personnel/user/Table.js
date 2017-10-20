import React from 'react';
import { Tooltip } from 'antd';
import { Link } from 'react-router-dom';

import text from '../../../config/text';

import BaseTable from '../../../components/base/BaseTable';

import EditUserModal from './Edit';
import FireUserModal from './FireUser';

export default class Table extends BaseTable {
  render() {
    const self = this;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: '75px',
        render(value, record) {
          return (
            <Link to={{
              pathname: `/personnel/user/detail/${record._id}`,
            }}>
              {
                value.length <= 4
                  ? value
                  : (
                    <Tooltip placement="topLeft" title={value}>
                      {value}
                    </Tooltip>
                  )
              }
            </Link>
          );
        },
      }, {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
        width: '115px',
      }, {
        title: '部门',
        dataIndex: 'department',
        key: 'department',
        width: '75px',
        render: value => text.department[value],
      }, {
        title: '职位',
        dataIndex: 'role_name',
        key: 'role_name',
        width: '75px',
      }, {
        title: '入职时间',
        dataIndex: 'hire_date',
        key: 'hire_date',
        width: '110px',
      }, {
        title: '薪资组',
        dataIndex: 'salary_groups',
        key: 'salary_groups',
      }, {
        title: '固定工资',
        dataIndex: 'base_salary',
        key: 'base_salary',
        className: 'column-money',
        width: '80px',
        render: value => Number(value).toFixed(2),
      }, {
        title: '系统权限',
        dataIndex: 'status',
        key: 'status',
        className: 'center',
        width: '75px',
        render: value => !!Number(value) ? '可登录' : '--',
      }, {
        title: '工作端权限',
        dataIndex: 'can_app_login',
        key: 'can_app_login',
        className: 'center',
        width: '89px',
        render: value => Number(value) === 1 ? '可登录' : '--',
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'action',
        className: 'center',
        width: '94px',
        render(id, record) {
          return (
            <span>
              <EditUserModal user={record} size="small" onSuccess={self.props.onSuccess} />

              <span className="ant-divider" /> {/* <CalculateWageModal
               type="month"
               user={record}
               disabled={record.status === '1'}
               size="small"
               onSuccess={self.props.onSuccess}
               />

               <span className="ant-divider"/>*/}

              <FireUserModal
                user={record}
                disabled={record.status === '-1'}
                size="small"
                onSuccess={self.props.onSuccess}
              />
            </span>
          );
        },
      },
    ];

    return this.renderTable(columns);
  }
}
