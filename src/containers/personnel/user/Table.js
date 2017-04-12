import React from 'react';
import {Link} from 'react-router';

import BaseTable from '../../../components/base/BaseTable';

import EditUserModal from './Edit';
// import CalculateWageModal from './CalculateWage';
import FireUserModal from './FireUser';

export default class Table extends BaseTable {
  render() {
    let self = this;
    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render(value, record) {
        return (
          <Link to={{pathname: '/personnel/user/detail', query: {user_id: record._id}}}>
            {value}
          </Link>
        );
      },
    }, {
      title: '编号',
      dataIndex: '_id',
      key: '_id',
    }, {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    }, {
      title: '部门',
      dataIndex: 'department_name',
      key: 'department_name',
    }, {
      title: '职位',
      dataIndex: 'role_name',
      key: 'role_name',
    }, {
      title: '入职时间',
      dataIndex: 'hire_date',
      key: 'hire_date',
    }, {
      title: '固定工资(元)',
      dataIndex: 'base_salary',
      key: 'base_salary',
      className: 'column-money',
      render: value => Number(value).toFixed(2),
    }, {
      title: '系统权限',
      dataIndex: 'status',
      key: 'status',
      className: 'center',
      render: value => !!Number(value) ? '可登录' : '无权限',
    }, {
      title: '操作',
      dataIndex: '_id',
      key: 'action',
      className: 'center',
      render: function (id, record) {
        return (
          <span>
            <EditUserModal
              user={record}
              size="small"
              onSuccess={self.props.onSuccess}
            />

            <span className="ant-divider"/>

            {/*<CalculateWageModal
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
    }];

    return this.renderTable(columns);
  }
}
