import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip, Icon, message } from 'antd';

import api from '../../../middleware/api';
import text from '../../../config/text';

import BaseTable from '../../../components/base/BaseTable';

export default class Table extends BaseTable {

  getList(props) {
    this.setState({ isFetching: true });
    api.ajax({
      url: props.source,
    }, data => {
      const { list, total, total_amount } = data.res;
      this.setState({
        isFetching: false,
        list,
        total: parseInt(total),
      });
      this.props.onTotalAmount(total_amount);
    }, error => {
      message.error(`获取列表数据失败[${error}]`);
      this.setState({ isFetching: false });
    });
  }

  render() {
    const itemTitle = (
      <div>
        <span className="mr10">提成项目</span>
        <Tooltip placement="top" title="提成项目包括工单内项目以及套餐卡销售。">
          <Icon type="question-circle-o" />
        </Tooltip>
      </div>
    );

    const columns = [
      {
        title: '提成时间',
        dataIndex: 'ctime',
        key: 'ctime',
      }, {
        title: '提成类型',
        dataIndex: 'type',
        key: 'type',
        render: value => text.commissionType[value],
      }, {
        title: '项目/会员卡/活动名称',
        dataIndex: 'item',
        key: 'item',
      }, {
        title: '提成金额',
        dataIndex: 'amount',
        key: 'amount',
        className: 'text-right',
        render: value => !!value ? Number(value).toFixed(2) : '--',
      }, {
        title: '操作',
        dataIndex: 'from_id',
        key: 'handle',
        className: 'center',
        render: (value, record) => {
          if (String(record.type) === '1' || String(record.type) === '2' ||
            String(record.type) === '3') {
            if (String(value).length >= 16) {
              return (
                <Link to={{ pathname: `/aftersales/project/detail/${value}` }} target="_blank">
                  查看详情
                </Link>
              );
            }
            return (
              <Link to={{ pathname: `/marketing/membercard/sale-detail/${value}` }} target="_blank">
                查看详情
              </Link>
            );
          } else {
            return '--';
          }
        },
      },
    ];

    return this.renderTable(columns);
  }
}
