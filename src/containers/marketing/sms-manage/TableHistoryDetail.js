import React from 'react';
import { message, Tooltip, Icon, Badge } from 'antd';

import api from '../../../middleware/api';
import text from '../../../config/text';

import BaseTable from '../../../components/base/BaseTable';

export default class TableHistoryDetail extends BaseTable {

  handleCancel(id) {
    api.ajax({
      type: 'post',
      url: api.warehouse.purchase.cancel(),
      data: { purchase_id: id },
    }, () => {
      message.success('取消成功');
      location.href = '/warehouse/purchase/index';
    });
  }

  render() {
    const number = (
      <div>
        <span className="mr5">计费数</span>
        <Tooltip
          placement="top"
          title={
            <div>
              <p>计费数：</p>
              <p>短信计费规则为：每67字（包含标点符号和空格）计算为1条短信，含有标签（如门店、优惠券）的短信以实际发送字符数计算，超过67个字符会发送2条短信。</p>
            </div>
          }
        >
          <Icon type="question-circle-o" />
        </Tooltip>
      </div>
    );

    const columns = [
      {
        title: '手机号码',
        dataIndex: 'phone',
        key: 'phone',
        width: '110px',
      }, {
        title: '发送时间',
        dataIndex: 'ctime',
        key: 'ctime',
        width: '150px',
      }, {
        title: number,
        dataIndex: 'fee_count',
        key: 'fee_count',
        width: '85px',
      }, {
        title: '发送状态',
        dataIndex: 'status',
        key: 'status',
        width: '95px',
        render: value => {
          let status = 'success';
          switch (Number(value)) {
          case 0:
            status = 'processing';
            break;
          case 1:
            status = 'success';
            break;
          case 2:
            status = 'error';
          }
          return <Badge status={status} text={text.smsStatus[value]} />;
        },
      }, {
        title: '短信类型',
        dataIndex: 'sub_type_desc',
        key: 'sub_type_desc',
        width: '110px',
      }, {
        title: '短信内容',
        dataIndex: 'content',
        key: 'content',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 8) {
            return <span>{value}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          );
        },
      }];

    return this.renderTable(columns);
  }
}
