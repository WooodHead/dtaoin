import React, {Component} from 'react'
import {Tag, Table, Button} from 'antd'

import api from '../../../../middleware/api'

export default class CountTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      condition: {
        key: '',
        type: 1,
        status: 2,
      },
    };
    [
      'handleData',
      'getList',
    ].map(method => this[method] = this[method].bind(this));
  }


  componentWillMount() {
    let {type} = this.props;
    this.setState({conditon : Object.assign(this.state.condition, {type: type})});
    this.getList();
  }

  handleData(data) {
    this.props.handleData(data);
  }

  getList() {
    api.ajax({
      url: api.coupon.getCouponList(this.state.condition),
    }, (data) => {
      if(data.code !== 0) {
        message.error(data.msg);
      }else {
        let list = data.res.list ? data.res.list : [];
        this.handleData(list);
      }
    })
  }

  render() {
    let {data} = this.props;
    const columns = this.props.columns;
    return (
      <Table
        rowKey={record => record._id}
        dataSource={data}
        columns={columns}
        pagination={false}
        bordered
      />
    )
  }
}