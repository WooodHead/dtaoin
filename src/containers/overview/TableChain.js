import React from 'react';
import { Tag } from 'antd';

import api from '../../middleware/api';
import BaseTable from '../../components/base/BaseTable';
import TableWithPagination from '../../components/widget/TableWithPagination';

import CreateChain from './CreateChain';

export default class TableStore extends BaseTable {

  // 计算指定日期距离今天的天数 date格式为'yyyy-mm-rr'
  dueExpire(date) {
    const forceExpireTimeStamp = Date.parse(new Date(date));
    const todayTimeStamp = new Date().getTime();
    const dueDateStamp = forceExpireTimeStamp - todayTimeStamp;
    if (Number(dueDateStamp) > 0) {
      return parseInt(dueDateStamp / 1000 / 60 / 60 / 24);
    } else {
      return 0;
    }
  }

  renderTable(columns) {
    const { isFetching, list, total } = this.state;

    return (
      <TableWithPagination
        isLoading={isFetching}
        columns={columns}
        dataSource={list}
        total={total}
        currentPage={this.props.page}
        onPageChange={this.handlePageChange}
        pageSize={15}
      />
    );
  }

  render() {
    const columns = [{
      title: '连锁名称',
      dataIndex: 'chain_name',
      key: 'chain_name',
      render: (value, record) => {
        if (Number(record.cooperation_type) === 1) {
          return (
            <div>
              {value}
              <Tag className="ml10">FC</Tag>
            </div>
          );
        } else if (Number(record.cooperation_type) === 2) {
          return (
            <div>
              {value}
              <Tag className="ml10">MC</Tag>
            </div>
          );
        } else if (Number(record.cooperation_type) === 3) {
          return (
            <div>
              {value}
              <Tag color="orange-inverse" className="ml10">AP</Tag>
            </div>
          );
        } else if (Number(record.cooperation_type) === 4) {
          return (
            <div>
              {value}
              <Tag color="green-inverse" className="ml10">TP</Tag>
            </div>
          );
        } else {
          return value;
        }
      },
    }, {
      title: '连锁成员',
      dataIndex: 'company_list',
      key: 'company_list',
      width: '30%',
      render: value => {
        let memberList = '';
        value.map(item => {
          memberList = `${memberList}${item.name}; `;
        });
        return memberList.slice(0, -2);
      },
    }, {
      title: '总负责人',
      dataIndex: 'admin_name',
      key: 'admin_name',
    }, {
      title: '负责人电话',
      dataIndex: 'admin_phone',
      key: 'admin_phone',
    }, {
      title: '操作',
      dataIndex: '_id',
      key: 'action',
      className: 'center action-three',
      width: '5%',
      render: (id, record) => (
          <span key={id}>
            {
              api.isSuperAdministrator() ?
                <CreateChain chainInfo={record} size="small" onSuccess={this.props.onSuccess}/> :
                <span>编辑</span>
            }
          </span>
        ),
    }];

    return this.renderTable(columns);
  }
}
