import React from 'react';
import {Card, Table} from 'antd';

export default class AftersalesMembers extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    //因为要修改source 所以这里使用了深拷贝
    let source = this.props.source.concat();

    let newCountTotal = 0;
    let totalCountTotal = 0;
    let amountTotal = 0;

    if (source.length > 0) {
      source.map(item => newCountTotal += (Number(item.count) || 0));
    }
    if (source.length > 0) {
      source.map(item => totalCountTotal += (Number(item.total) || 0));
    }
    if (source.length > 0) {
      source.map(item => amountTotal += (Number(item.amount) || 0));
    }

    if (source.length > 0) {
      source.push({
        member_card_type_name: '总计',
        count: newCountTotal,
        total: totalCountTotal,
        amount: amountTotal,
        member_card_type: new Date().getTime(),
      });
    }

    const columns = [
      {
        title: '会员卡名称',
        dataIndex: 'member_card_type_name',
        key: 'member_card_type_name',
        render(value) {
          if (value == '总计') {
            return eval(<span className="font-size-18">{value}</span>);
          }
          return value;
        },
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
        title: '累计',
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
      <Card title="会员情况" className="mb15">
        <Table
          columns={columns}
          dataSource={source}
          pagination={false}
          bordered
          size="small"
          rowKey={record => record.member_card_type}
        />
      </Card>
    );
  }
}
