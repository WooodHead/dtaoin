import React from 'react'
import {Card, Table} from 'antd'

export default class AftersalesMembers extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {source} = this.props;
    let total = 0;
    if (source) {
      source.map(item => total += Number(item.all));
    }

    const columns = [
      {
        title: '会员类型',
        dataIndex: 'name',
        key: 'name'
      }, {
        title: '新增会员数',
        dataIndex: 'new',
        key: 'new'
      }, {
        title: '累计会员数',
        dataIndex: 'all',
        key: 'all'
      }, {
        title: '累计会员数占比',
        dataIndex: 'all',
        key: 'rate',
        className: 'text-right',
        render(property, record){
          if (property) {
            return `${(Number(property) / total * 100).toFixed(2)}%`
          }
          return '0%'
        }
      }
    ];

    return (
      <Card title="会员统计" className="mb15">
        <Table
          columns={columns}
          dataSource={source}
          pagination={false}
          bordered
          size="small"
          rowKey={record => record.name}
        />
      </Card>
    )
  }
}