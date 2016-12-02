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
      title: '项目名称',
      dataIndex: 'project_name',
      key: 'project_name',
    }, {
      title: '减价金额',
      dataIndex: 'discount_amount',
      key: 'discount_amount',
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render() {
        return (
          <div>
            <Link>删除</Link>
          </div>
        )
      }
    }];

    const dataSource = [{
      key: '1',
      num: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号'
    }, {
      key: '2',
      num: '胡彦祖',
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