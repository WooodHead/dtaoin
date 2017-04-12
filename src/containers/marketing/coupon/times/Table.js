import React from 'react';
import {Badge} from 'antd';

import text from '../../../../config/text';
import api from '../../../../middleware/api';

import Detail from '../Detail';

import BaseTable from '../../../../components/base/BaseTable';

export default class Table extends BaseTable {
  componentWillReceiveProps(nextProps) {
    if (this.props.source != nextProps.source) {
      this.getList(nextProps);
    }
    if (JSON.stringify(this.props.selectedItem) != JSON.stringify(nextProps.selectedItem)) {
      this.setState({list: [nextProps.selectedItem], total: 1});
    }
  }

  handleUseStatusChange(index, record) {
    let coupon_item_id = record._id;
    let status = Number(record.status) === 0 ? 1 : 0;
    api.ajax({
      url: api.coupon.updataCouponStatus(),
      type: 'POST',
      data: {coupon_item_id: coupon_item_id, status: status},
    }, () => {
      this.getList(this.props);
    });
  }

  render() {
    let self = this;

    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '描述',
        dataIndex: 'remark',
        key: 'remark',
      }, {
        title: '更新日期',
        dataIndex: 'mtime',
        key: 'mtime',
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        className: 'center',
        render: (value, record) => {
          let status = (Number(value) === 0) ? 'success' : 'default';
          return <Badge status={status} text={text.useStatus[record.status]}/>;
        },
      }, {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        width: '10%',
        className: 'center',
        render: (value, record, index) => {
          let userStatus = text.useStatus[-(record.status) + 1];
          return (
            <div>
              <a href="javascript:;" size="small" onClick={() => self.handleUseStatusChange(index, record)}>
                {userStatus}
              </a>
              <span className="ant-divider"/>
              <Detail data={record} size="small"/>
            </div>
          );
        },
      }];

    return this.renderTable(columns);
  }
}