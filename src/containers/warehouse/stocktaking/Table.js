import React from 'react';
import {Link} from 'react-router';
import {Popconfirm, Badge} from 'antd';

import api from '../../../middleware/api';
import DateFormatter from '../../../utils/DateFormatter';

import BaseTable from '../../../components/base/BaseTable';

import AuthPopover from './AuthPopover';

export default class Table extends BaseTable {

  handleCancel(id) {
    api.ajax({
      url: api.warehouse.stocktaking.cancel(),
      type: 'post',
      data: {stocktaking_id: id},
    }, () => {
      this.props.updateState({reload: true});
    });
  }

  render() {
    let self = this;
    const columns = [
      {
        title: '盘点日期',
        dataIndex: 'stocktaking_time',
        key: 'stocktaking_time',
        className: 'center',
        render (value) {
          return DateFormatter.day(value);
        },
      }, {
        title: '盘盈数量',
        dataIndex: 'panying_amount',
        key: 'panying_amount',
        className: 'center',
      }, {
        title: '盘盈金额',
        dataIndex: 'panying_worth',
        key: 'panying_worth',
        className: 'text-right',
      }, {
        title: '盘亏数量',
        dataIndex: 'pankui_amount',
        key: 'pankui_amount',
        className: 'center',
      }, {
        title: '盘亏金额',
        dataIndex: 'pankui_worth',
        key: 'pankui_worth',
        className: 'text-right',
      }, {
        title: '盘前总值',
        dataIndex: 'panqian_worth',
        key: 'panqian_worth',
        className: 'text-right',
      }, {
        title: '盘后总值',
        dataIndex: 'panhou_worth',
        key: 'panhou_worth',
        className: 'text-right',
      }, {
        title: '差值',
        dataIndex: 'diff_worth',
        key: 'diff_worth',
        className: 'text-right',
        render(value) {
          let diffWorth = parseFloat(value);
          if (diffWorth < 0) {
            return <span className="text-red">{value}</span>;
          } else if (diffWorth == 0) {
            return <span className="text-gray">{value}</span>;
          } else {
            return value;
          }
        },
      }, {
        title: '状态',
        dataIndex: 'status_name',
        key: 'status_name',
        className: 'center',
        render(value, record) {
          let statusValue = String(record.status);
          let statusLabel = 'default';
          if (statusValue === '0') {
            statusLabel = 'error';
          } else if (statusValue === '1') {
            statusLabel = 'success';
          }
          return <Badge status={statusLabel} text={value}/>;
        },
      }, {
        title: '盘点人',
        dataIndex: 'stocktaking_user_name',
        key: 'stocktaking_user_name',
        className: 'center',
      }, {
        title: '审核人',
        dataIndex: 'authorize_user_name',
        key: 'authorize_user_name',
        className: 'center',
      }, {
        title: '审核时间',
        dataIndex: 'authorize_time',
        key: 'authorize_time',
        className: 'center',
        render(value){
          if (value === '0000-00-00 00:00:00') {
            return null;
          } else {
            return DateFormatter.day(value);
          }
        },
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'action',
        className: 'center',
        render(value, record){
          let actions = '';
          switch (record.status.toString()) {
            case '0':
              actions = (
                <div>
                  <Link to={{pathname: '/warehouse/stocktaking/edit', query: {id: value}}}>编辑</Link>
                  <span className="ant-divider"/>

                  <AuthPopover id={value} type="auth"/>
                  <span className="ant-divider"/>

                  <Popconfirm
                    placement="topRight"
                    title="你确定要放弃该盘点单吗，放弃后不可恢复"
                    onConfirm={self.handleCancel.bind(self, value)}
                  >
                    <a href="javascript:;">放弃</a>
                  </Popconfirm>
                </div>
              );
              break;
            case '1':
              actions = (
                <div>
                  <Link to={{pathname: '/warehouse/stocktaking/edit', query: {id: value}}}>盘点单</Link>
                  <span className="ant-divider"/>

                  <AuthPopover id={value} type="auth" text="审核单"/>
                </div>
              );
              break;
            case '-1':
              actions = <Link to={{pathname: '/warehouse/stocktaking/edit', query: {id: value}}}>盘点单</Link>;
              break;
          }
          return actions;
        },
      },
    ];

    return this.renderTable(columns);
  }
}
