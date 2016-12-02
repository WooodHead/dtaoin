import React, {Component} from 'react'
import {Tag, Table} from 'antd'
import {Link} from 'react-router'
export default class TimecoutTable extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const columns = [{
      title: '序号',
      dataIndex: 'num',
      key: 'num',
    }, {
      title: '配件',
      dataIndex: 'parts',
      key: 'parts',
    }, {
      title: '减价金额',
      dataIndex: 'discount_amount',
      key: 'discount_amount',
    }, {
      title: '计费数量',
      dataIndex: 'quantity',
      key: 'quantity',
    }, {
      title: '减价总额',
      dataIndex: 'total_amount',
      key: 'total_amount',
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render() {
        return (
          <div>
            <Link>编辑</Link>
            <span> </span>
            <Link>删除</Link>
          </div>
        )
      }
    }];

    const dataSource = [{
      key: '1',
      num: '胡彦斌',
      age: 32,
      operation: '西湖区湖底公园1号'
    }, {
      key: '2',
      num: '胡彦祖',
      age: 42,
      operation: '西湖区湖底公园1号'
    }];
    return (
      <div>
        <Table dataSource={dataSource} columns={columns} pagination={false} bordered/>
      </div>
    )
  }
}