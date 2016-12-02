import React, {Component} from 'react'
import StopUse from './StopUse'
import {Tag, Table} from 'antd'
import {Link} from 'react-router'
export default class DiscountTable extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const columns = [{
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '折扣比例',
      dataIndex: 'rate',
      key: 'rate',
    }, {
      title: '描述',
      dataIndex: 'desc',
      key: 'desc',
    }, {
      title: '创建日期',
      dataIndex: 'date_create',
      key: 'date_create',
    }, {
      title: '状态',
      dataIndex: 'state',
      key: 'state'

    }, {
      title: '操作',
      dataIndex: 'handle',
      key: 'handle',
      render() {
        return (
          <div>
            {/*停用*/}
            <StopUse />
            <Link>查看详情</Link>
          </div>
        )
      }

    }];

    const dataSource = [{
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号'
    }, {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号'
    }];
    return (
      <div>
        <Table dataSource={dataSource} columns={columns} pagination={false} bordered/>
      </div>
    )
  }
}