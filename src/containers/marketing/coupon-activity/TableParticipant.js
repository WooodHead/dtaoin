import React from 'react';

import api from '../../../middleware/api';
import ReceiveRecord from './ReceiveRecord';
import DateFormatter from '../../../utils/DateFormatter';

import BaseTable from '../../../components/base/BaseTable';

export default class Table extends BaseTable {
  handleGetPrize(record) {
    api.ajax({
      url: api.coupon.bargainActivityChange(),
      type: 'POST',
      data: {
        activity_id: record.activity_id,
        attend_id: record._id,
      },
    }, () => {
      this.props.onSuccess && this.props.onSuccess();
    });
  }

  render() {
    const columns = [
      {
        title: '微信头像',
        dataIndex: 'avatar_url',
        key: 'avatar_url',
        width: '75px',
        render: value => (
            <img src={value} style={{
              width: '34px',
              height: '34px',
              borderRadius: '17px',
              marginBottom: '-6px',
            }} />
          ),
      }, {
        title: '微信昵称',
        dataIndex: 'nick_name',
        key: 'nick_name',
      }, {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
      }, {
        title: '领取时间',
        dataIndex: 'ctime',
        key: 'ctime',
        width: '130px',
        render: value => value && value.indexOf('0000') > -1 ? '--' : DateFormatter.getFormatTime(value),
      }, {
        title: '邀请人',
        dataIndex: 'from_user_name',
        key: 'from_user_name',
        render: value => value || '--',
      }, {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        className: 'center',
        width: '10%',
        render: (value, record) => (
            <ReceiveRecord detail={record} />
          ),
      }];

    return this.renderTable(columns);
  }
}
