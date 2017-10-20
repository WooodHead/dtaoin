import React from 'react';
import { Table, Tooltip, Icon, Card } from 'antd';

export default class AftersalesMembers extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { source, couponFee } = this.props;

    const amountObj = source[0];
    const profitObj = source[2];

    let amount = 0;
    let profit = 0;

    for (const key in amountObj) {
      if (amountObj.hasOwnProperty(key) && key !== 'type') {
        amount += Number(amountObj[key]);
      }
    }

    for (const key in profitObj) {
      if (profitObj.hasOwnProperty(key) && key !== 'type') {
        profit += Number(profitObj[key]);
      }
    }

    amount -= couponFee;
    profit -= couponFee;

    let averageProfit = 0;
    if (Number(amount) !== 0) {
      averageProfit = ((Number(profit) / Number(amount)) * 100).toFixed(2);
    }

    const itemTitle = (
      <div>
        <span className="mr10">合计</span>
        <Tooltip placement="top" title={
          <div>
            <div>营业额 = 各类型营业额加和-整单优惠</div>
            <div>毛利 = 营业额 - 配件成本</div>
            <div>毛利率 = 毛利/营业额</div>
          </div>
        }>
          <Icon type="question-circle-o" />
        </Tooltip>
      </div>
    );

    const columns = [
      {
        title: ' ',
        dataIndex: 'type',
        key: 'type',
      }, {
        title: '洗车',
        dataIndex: '洗车',
        key: '洗车',
        render: (value, record) => {
          if (record.type === '占比') {
            return value;
          }
          if (record.type === '毛利率') {
            return `${(Number(value) * 100).toFixed(2)  }%`;
          }
          return Number(value).toFixed(2);
        },
      }, {
        title: '美容',
        dataIndex: '美容',
        key: '美容',
        render: (value, record) => {
          if (record.type === '占比') {
            return value;
          }
          if (record.type === '毛利率') {
            return `${(Number(value) * 100).toFixed(2)  }%`;
          }
          return Number(value).toFixed(2);
        },
      }, {
        title: '保养',
        dataIndex: '保养',
        key: '保养',
        render: (value, record) => {
          if (record.type === '占比') {
            return value;
          }
          if (record.type === '毛利率') {
            return `${(Number(value) * 100).toFixed(2)  }%`;
          }
          return Number(value).toFixed(2);
        },
      }, {
        title: '轮胎',
        dataIndex: '轮胎',
        key: '轮胎',
        render: (value, record) => {
          if (record.type === '占比') {
            return value;
          }
          if (record.type === '毛利率') {
            return `${(Number(value) * 100).toFixed(2)  }%`;
          }
          return Number(value).toFixed(2);
        },
      }, {
        title: '钣喷',
        dataIndex: '钣喷',
        key: '钣喷',
        render: (value, record) => {
          if (record.type === '占比') {
            return value;
          }
          if (record.type === '毛利率') {
            return `${(Number(value) * 100).toFixed(2)  }%`;
          }
          return Number(value).toFixed(2);
        },
      }, {
        title: '维修',
        dataIndex: '维修',
        key: '维修',
        render: (value, record) => {
          if (record.type === '占比') {
            return value;
          }
          if (record.type === '毛利率') {
            return `${(Number(value) * 100).toFixed(2)  }%`;
          }
          return Number(value).toFixed(2);
        },
      }, {
        title: '配件销售',
        dataIndex: '配件销售',
        key: '配件销售',
        render: (value, record) => {
          if (record.type === '占比') {
            return value;
          }
          if (record.type === '毛利率') {
            return `${(Number(value) * 100).toFixed(2)  }%`;
          }
          return Number(value).toFixed(2);
        },
      }, {
        title: '套餐卡',
        dataIndex: '套餐卡',
        key: '套餐卡',
        render: (value, record) => {
          if (record.type === '占比') {
            return value;
          }
          if (record.type === '毛利率') {
            return `${(Number(value) * 100).toFixed(2)  }%`;
          }
          return Number(value).toFixed(2);
        },
      }, {
        title: itemTitle,
        key: '合计',
        render: (value, record) => {
          if (record.type === '营业额') {
            return Number(amount).toFixed(2);
          }
          if (record.type === '毛利率') {
            return `${Number(averageProfit).toFixed(2)  }%`;
          }
          if (record.type === '占比') {
            return '100%';
          }
          if (record.type === '毛利') {
            return Number(profit).toFixed(2);
          }

          let total = 0;
          for (const key in record) {
            if (record.hasOwnProperty(key) && key !== 'type') {
              total += Number(record[key]);
            }
          }
          return total.toFixed(2);
        },
      },
    ];

    return (
      <Card title={<div><Icon type="pay-circle-o" /> 业务分析</div> } className="mb15">
        <Table
          columns={columns}
          dataSource={source}
          pagination={false}
          bordered={false}
          size="middle"
          rowKey={record => record.type}
        />
      </Card>
    );
  }
}
