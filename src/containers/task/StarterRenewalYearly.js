import React from 'react';
import {Button, Modal, Row, Col, Select, Timeline, Input, message} from 'antd';

import text from '../../config/text';
import api from '../../middleware/api';

import BaseModal from '../../components/base/BaseModal';

const Option = Select.Option;
const TimeLineItem = Timeline.Item;

export default class StarterReneYear extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      remark: '',
      status: props.record.status || '',
    };

    [
      'handleOperate',
      'handleSubmit',
      'handleChangeStatus',
      'getTaskFollowUp',
      'handleRemark',
      'getTaskFollowHistory',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleOperate() {
    this.getTaskFollowHistory();
    this.showModal();
  }

  handleSubmit() {
    if (!this.state.remark) {
      message.error('请填写跟进记录');
      return;
    }
    this.getTaskFollowUp();
    this.hideModal();
  }

  handleChangeStatus(value) {
    this.setState({status: value});
  }

  handleRemark(e) {
    this.setState({remark: e.target.value});
  }

  getTaskFollowHistory() {
    api.ajax({
      url: api.task.taskFollowHistory(this.props.record._id, this.props.task_type),
    }, (data) => {
      let list = data.res.list;
      this.setState({data: list});
    }, () => {
    });
  }

  getTaskFollowUp() {
    api.ajax({
      url: api.task.taskFollowUp(),
      type: 'POST',
      data: {
        task_id: this.props.record._id,
        task_type: this.props.task_type,
        status: this.state.status,
        remark: this.state.remark,
      },
    }, () => {
      this.props.handleChangeData();
      message.success('保存数据成功');
    }, () => {
      message.error('保存数据失败');
    });
  }

  render() {
    let record = this.props.record;
    let data = this.state.data;

    let contentPending = (
      Number(record.status) === 2 ?
        false :
        <Input type="textarea" placeholder="添加跟踪记录" rows={3} onChange={this.handleRemark}/>
    );

    let contentFooter = (
      Number(record.status) === 2 ?
        null :
        [
          <Button key="back" type="ghost" size="large" onClick={this.hideModal}>取消</Button>,
          <Button key="submit" type="primary" size="large" onClick={this.handleSubmit}>
            确定
          </Button>,
        ]
    );

    return (
      <div>
        <a href="javascript:;" onClick={this.handleOperate}>{text.taskDetails[record.status]}</a>
        <Modal
          title="任务信息"
          visible={this.state.visible}
          onCancel={this.hideModal}
          onOk={this.handleSubmit}
          width="720px"
          footer={contentFooter}
        >
          <Row className="mb10">
            <Col span={24}>
              <label span={6} className="mr20">任务状态:</label>
              <Select
                size="large"
                defaultValue={record.status == 0 ? '1' : record.status}
                onSelect={this.handleChangeStatus}
                style={{width: 200}}
              >
                <Option value="1">进行中</Option>
                <Option value="2">已完成</Option>
              </Select>
            </Col>
          </Row>

          <Row>
            <Col span={3}>
              <label span={6} className="mr20">任务跟踪:</label>
            </Col>
            <Col span={18}>
              <Timeline pending={contentPending}>
                {data.map((item, index) =>
                  <TimeLineItem key={index}>{item.ctime + '  ' + item.user_name + '   : ' + item.remark}</TimeLineItem>
                )}
              </Timeline>
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}
