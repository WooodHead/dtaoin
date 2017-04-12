import React from 'react';
import {Row, Col, Select, message} from 'antd';

import api from '../../middleware/api';

import BaseList from '../../components/base/BaseList';

import Table from './TableCustomer';

const Option = Select.Option;

export default class ListCustomer extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      typeList: [],
      status: props.location.query.status || 0,
      type: '-1',
      page: 1,
      reload: false,
    };

    [
      'handleChangeStatus',
      'handleChangeType',
      'getCommonTaskTypeList',
      'handleChangeData',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getCommonTaskTypeList();
  }

  handleChangeStatus(value) {
    this.setState({status: value, page: 1});
  }

  handleChangeType(value) {
    this.setState({type: value, page: 1});
  }

  handleChangeData() {
    this.setState({reload: true});
  }

  //获取顾客任务类型
  getCommonTaskTypeList() {
    api.ajax({
      url: api.task.commonTaskTypeList(),
    }, (data) => {
      data.res.list.unshift({_id: '-1', name: '全部'});
      this.setState({typeList: data.res.list});
    }, () => {
      message.error('保存数据失败');
    });
  }

  render() {
    let {type, status, page, reload} = this.state;
    return (
      <div>
        <Row className="mb15">
          <Col span={24}>
            <label>任务状态：</label>
            <Select
              size="large"
              style={{width: 200}}
              defaultValue={String(status)}
              onSelect={this.handleChangeStatus}
            >
              <Option value="0">未跟进</Option>
              <Option value="1">进行中</Option>
              <Option value="2">已完成</Option>
            </Select>

            <label className="ml20">类型：</label>
            <Select
              size="large"
              defaultValue="全部"
              onSelect={this.handleChangeType}
              style={{width: 200}}
            >
              {this.state.typeList.map((item, index) =>
                <Option value={`${item._id}`} key={index}>{item.name}</Option>
              )}
            </Select>
          </Col>
        </Row>

        <Table
          page={page}
          source={api.task.getCustomerTask(type, status, page)}
          updateState={this.updateState}
          onSuccess={this.handleChangeData}
          reload={reload}
        />
      </div>
    );
  }
}
