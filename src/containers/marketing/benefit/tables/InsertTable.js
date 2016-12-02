import React, {Component} from 'react'
import {Tag, Table, Button} from 'antd'
export default class InsertProjectTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let {insertInfo} = this.props;
    let {columns} = this.props;
    const dataSource = insertInfo;

    return (
        <Table dataSource={dataSource} columns={columns} pagination={false} bordered/>
    )
  }
}