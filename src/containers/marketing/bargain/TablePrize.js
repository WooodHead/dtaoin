import React from 'react';
import { Badge, Popconfirm } from 'antd';

import text from '../../../config/text';
import api from '../../../middleware/api';
import Record from './Record';
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
    const self = this;
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
        title: '价格',
        dataIndex: 'current_price',
        key: 'current_price',
        className: 'text-right',
        render: value => Number(value).toFixed(2),
      }, {
        title: '参与时间',
        dataIndex: 'ctime',
        key: 'ctime',
        width: '130px',
        render: value => value && value.indexOf('0000') > -1 ? '--' : DateFormatter.getFormatTime(value),
      }, {
        title: '邀请人',
        dataIndex: 'from_user_name',
        key: 'from_user_name',
      }, {
        title: '兑换时间',
        dataIndex: 'change_time',
        key: 'change_time',
        width: '130px',
        render: value => value && value.indexOf('0000') > -1 ? '--' : DateFormatter.getFormatTime(value),
      }, {
        title: '兑奖状态',
        dataIndex: 'status',
        key: 'status',
        className: 'center',
        render: value => {
          const status = (Number(value) === 0) ? 'default' : 'success';
          return <Badge status={status} text={text.prizeStatus[value]} />;
        },
      }, {
        title: '阅读数',
        dataIndex: 'view_count',
        key: 'view_count',
      }, {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        className: 'center',
        width: '118px',
        render: (value, record) => (
            <span>
              {
                Number(record.status) === 0
                  ? <span>
                    <Popconfirm
                      title="你确定要兑奖码，兑奖后状态不可修改"
                      onConfirm={e => self.handleGetPrize(record, e)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <a href="javascript:;">兑奖</a>
                    </Popconfirm>

                    <span className="ant-divider" />
                  </span>
                  : null
              }
              <Record detail={record} />
            </span>
          ),
      }];

    return this.renderTable(columns);
  }
}
