import React from 'react';
import {message, Popconfirm} from 'antd';

import api from '../../../middleware/api';
import text from '../../../config/text';

import BaseTable from '../../../components/base/BaseTable';

import Edit from './Edit';

export default class Table extends BaseTable {

  handleStop(id, status) {
    api.ajax({
      url: api.admin.account.modifyStatus(),
      type: 'POST',
      data: {
        _id: id,
        status,
      },
    }, () => {
      message.success('停用成功');
      this.props.onSuccess();
    }, (err) => {
      message.error(`停用失败[${err}]`);
    });
  }

  render() {
    let self = this;
    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    }, {
      title: '账号类型',
      dataIndex: 'user_type',
      key: 'user_type',
      render: userType => text.settings.account.userType[userType],
    }, {
      title: '管理连锁名称',
      dataIndex: 'chain_name',
      key: 'chain_name',
      render: (value) => {
        return value ? value : '--';
      },
    }, {
      title: '创建人',
      dataIndex: 'create_user_name',
      key: 'create_user_name',
    }, {
      title: '创建时间',
      dataIndex: 'ctime',
      key: 'ctime',
    }, {
      title: '操作',
      dataIndex: '_id',
      key: 'action',
      className: 'center',
      render (id, record) {
        return (
          <span>
            <Edit id={id} onSuccess={self.props.onSuccess}/>

            <span className="ant-divider"/>

            <Popconfirm
              placement="topRight"
              title="确定要停用吗？"
              onConfirm={self.handleStop.bind(self, id, -1)}
            >
              {record.status === '-1' ?
                <a href="javascript:" disabled>已停用</a> :
                <a href="javascript:">停用</a>
              }
            </Popconfirm>
          </span>
        );
      },
    }];

    return this.renderTable(columns);
  }
}
