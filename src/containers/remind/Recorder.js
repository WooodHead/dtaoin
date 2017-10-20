import React from 'react';
import { Button, Col, Input, message, Modal, Row, Select, Timeline } from 'antd';

import path from '../../config/path';
import text from '../../config/text';
import api from '../../middleware/api';

import BaseModal from '../../components/base/BaseModal';

const Option = Select.Option;
const TimeLineItem = Timeline.Item;
const TextArea = Input.TextArea;

/**
 * 记录提醒跟进状态
 */
export default class StartReminder extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      remark: '',
      status: ((props.record.status) === '0' ? '1' : props.record.status) || 1,
      hasPermission: false,
    };

    [
      'handleOperate',
      'handleSubmit',
      'handleChangeStatus',
      'handleRemark',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.isAuthorization();
  }

  handleOperate() {
    this.getTaskFollowHistory(this.props.record._id, this.props.task_type);
    this.showModal();
  }

  handleSubmit() {
    if (!this.state.remark) {
      message.error('请填写跟进记录');
      return;
    }
    this.getTaskFollowUp();
    this.hideModal();
    this.setState({ remark: '' });
  }

  handleChangeStatus(value) {
    this.setState({ status: value });
  }

  handleRemark(e) {
    this.setState({ remark: e.target.value });
  }

  getTaskFollowHistory(id, taskType) {
    api.ajax({ url: api.task.taskFollowHistory(id, taskType) }, data => {
      const list = data.res.list;
      this.setState({ data: list });
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
      message.success('保存数据成功');
      this.props.onSuccess();
    }, () => {
      message.error('保存数据失败');
    });
  }

  async isAuthorization() {
    const hasPermission = await api.checkPermission(path.customer.reminder);
    this.setState({ hasPermission });
  }

  render() {
    const { record, task_type } = this.props;
    const { data, hasPermission, remark } = this.state;

    const contentPending = Number(record.status) === 2
      ? false
      : <TextArea placeholder="添加跟踪记录" rows={3} onChange={this.handleRemark} value={remark} />;

    const contentFooter = Number(record.status) === 2
      ? null
      : [
        <Button key="back" type="ghost" size="large" onClick={this.hideModal}>取消</Button>,
        <Button key="submit" type="primary" size="large" onClick={this.handleSubmit}>
          确定
        </Button>,
      ];

    return (
      <span>
        <a href="javascript:;" onClick={this.handleOperate} disabled={!hasPermission}>
          {text.task.action[record.status]}
        </a>

        <Modal
          title="跟进记录"
          visible={this.state.visible}
          onCancel={this.hideModal}
          onOk={this.handleSubmit}
          width="720px"
          footer={contentFooter}
        >
          <Row className="mb20">
            <Col span={12}>
              <label span={3} className="mr20">任务状态:</label>
              <Select
                size="large"
                defaultValue={String(record.status) === '0' ? '1' : record.status}
                onSelect={this.handleChangeStatus}
                style={{ width: 200 }}
                disabled={Number(record.status) === 2}
              >
                <Option value="1">跟进中</Option>
                <Option value="2">已完成</Option>
              </Select>
            </Col>
          </Row>

          {parseInt(task_type, 10) === 7 && (
            <Row className="mb20">
              <Col span={3}>
                <label span={2} className="mr20">任务描述:</label>
              </Col>
              <Col span={18}>
                <p className="font-size-14">{record.remark}</p>
              </Col>
            </Row>
          )}

          <Row>
            <Col span={3}>
              <label span={2} className="mr20">任务跟踪:</label>
            </Col>
            <Col span={18}>
              <Timeline pending={contentPending} style={{ marginTop: 5 }}>
                {data.map((item, index) =>
                  <TimeLineItem key={index}>
                    {`${item.ctime} ${item.user_name}: ${item.remark}`}
                  </TimeLineItem>,
                )}
              </Timeline>
            </Col>
          </Row>
        </Modal>
      </span>
    );
  }
}
