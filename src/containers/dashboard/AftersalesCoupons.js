import React from 'react';
import { Card, Table, Icon, Tooltip } from 'antd';

export default class AftersalesMembers extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // 因为要修改source 所以这里使用了深拷贝
    const source = this.props.source.concat();

    let newCountTotal = 0;
    let totalCountTotal = 0;
    let amountTotal = 0;

    if (source.length > 0) {
      source.map(item => {
        newCountTotal += (Number(item.count) || 0);
        totalCountTotal += (Number(item.total) || 0);
        amountTotal += (Number(item.amount) || 0);
      });
    }

    if (source.length > 0) {
      source.push({
        coupon_card_type_name: <span className="blue-line-color">{'合计'}</span>,
        count: <span className="blue-line-color">{newCountTotal}</span>,
        total: <span className="blue-line-color">{totalCountTotal}</span>,
        amount: <span className="blue-line-color">{Number(amountTotal).toFixed(2)}</span>,
        member_card_type: new Date().getTime(),
      });
    }

    const itemTitle = (
      <div>
        <span className="mr10">累计</span>
        <Tooltip placement="top" title={
          <span>套餐卡累计数量指的是截止到昨天，仍然有效的套餐卡的总数</span>
        }>
          <Icon type="question-circle-o" />
        </Tooltip>
      </div>
    );

    const columns = [
      {
        title: '套餐卡名称',
        dataIndex: 'coupon_card_type_name',
        key: 'coupon_card_type_name',
      }, {
        title: '新增',
        dataIndex: 'count',
        key: 'count',
        render(value) {
          if (value) {
            return value;
          } else {
            return 0;
          }
        },
      }, {
        title: '新增占比',
        dataIndex: 'count',
        key: 'countProportion',
        render(value) {
          if (typeof value === 'object') {
            return '';
          }
          if (Number(newCountTotal) === 0) {
            return '0%';
          }
          if (value) {
            return `${(Number(value) / newCountTotal * 100).toFixed(2)}%`;
          } else {
            return '0%';
          }
        },
      }, {
        title: itemTitle,
        dataIndex: 'total',
        key: 'total',
        render(value) {
          if (value) {
            return value;
          } else {
            return 0;
          }
        },
      }, {
        title: '累计占比',
        dataIndex: 'total',
        key: 'totalProportion',
        render(value) {
          if (typeof value === 'object') {
            return '';
          }
          if (Number(totalCountTotal) === 0) {
            return '0%';
          }
          if (value) {
            return `${(Number(value) / totalCountTotal * 100).toFixed(2)}%`;
          } else {
            return '0%';
          }
        },
      }, {
        title: '销售收入',
        dataIndex: 'amount',
        key: 'amount',
        render(value) {
          if (value) {
            return value;
          } else {
            return '0.00';
          }
        },
      }, {
        title: '收入占比',
        dataIndex: 'amount',
        key: 'amountProportion',
        render(value) {
          if (typeof value === 'object') {
            return '';
          }
          if (Number(amountTotal) === 0) {
            return '0%';
          }
          if (value) {
            return `${(Number(value) / amountTotal * 100).toFixed(2)}%`;
          } else {
            return '0%';
          }
        },
      },
    ];

    return (
      <Card title={<div><Icon type="credit-card" /> 套餐卡情况</div> } className="mb15">
        <Table
          columns={columns}
          dataSource={source}
          pagination={false}
          bordered={false}
          size="middle"
          rowKey={record => record.member_card_type + record.coupon_card_type_name}
        />
      </Card>
    );
  }
}
