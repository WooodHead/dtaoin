import React from 'react';
import {Button, Modal, Row, Col, Select, Timeline, Input, message, DatePicker} from 'antd';
import text from '../../config/text';
import BaseModal from '../../components/base/BaseModal';
import api from '../../middleware/api';
import formatter from '../../utils/DateFormatter';

const Option = Select.Option;
const TimeLineItem = Timeline.Item;

export default class CustomerTaskModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      remark: '',
      status: (props.record.status == 0 ? '1' : props.record.status) || 1,
      remindDate: '',
      datePickValue: '',
    };
    [
      'handleOperate',
      'handleSubmit',
      'handleChangeStatus',
      'PostTaskFollowUp',
      'handleRemark',
      'handleDateChange',
      'getNextDay',
      'getTaskFollowHistory',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.setState({
      remindDate: this.getNextDay(),
      datePickValue: formatter.getMomentDate(this.getNextDay()),
    });
  }

  getTaskFollowHistory() {
    api.ajax({
      url: api.task.taskFollowHistory(this.props.record._id),
    }, (data) => {
      let list = data.res.list;
      this.setState({
        data: list,
      });
    }, () => {
    });
  }

  handleDateChange(value) {
    let date = formatter.day(value);
    this.setState({
      remindDate: date,
      datePickValue: formatter.getMomentDate(value),
    }, () => {
    });
  }

  PostTaskFollowUp() {
    api.ajax({
      url: api.task.taskFollowUp(),
      type: 'POST',
      data: {
        task_id: this.props.record._id,
        task_type: this.props.task_type,
        status: this.state.status,
        remark: this.state.remark,
        remind_date: this.state.remindDate,
      },
    }, () => {
      message.success('保存数据成功');
      this.props.handleChangeData();
    }, () => {
      message.error('保存数据失败');
    });
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
    this.PostTaskFollowUp();
    this.hideModal();
  }

  handleChangeStatus(value) {
    this.setState({
      status: value,
    });
    if(Number(value) === 2) {
      this.setState({
        remindDate: null,
      });
    }
  }

  handleRemark(e) {
    this.setState({
      remark: e.target.value,
    });
  }

  getNextDay() {
    let date = new Date();
    date.setDate(date.getDate() + 1);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return year + '-' + month + '-' + day;
  }

  render() {
    let record = this.props.record;
    let data = this.state.data;
    let contentPending = (
      Number(record.status) === 2 ? false :
        <Input type="textarea" placeholder="添加跟踪记录" rows={3} onChange={this.handleRemark}/>
    );
    let contentFooter = (
      Number(record.status) === 2 ? null :
        [
          <Button key="back" type="ghost" size="large" onClick={this.hideModal}>取消</Button>,
          <Button key="submit" type="primary" size="large" onClick={this.handleSubmit}>
            确定
          </Button>,
        ]
    );
    return (
      <div>
        <Button
          onClick={this.handleOperate}
          size="small"
        >
          {text.taskDetails[record.status]}
        </Button>

        <Modal
          title="客户任务"
          visible={this.state.visible}
          onCancel={this.hideModal}
          onOk={this.handleSubmit}
          width="620px"
          footer={contentFooter}
        >
          <Row className="margin-bottom-40">
            <Col span={12}>
              <label span={3} className="margin-right-20">任务状态:</label>
              <Select
                size="large"
                defaultValue={record.status == 0 ? '1' : record.status}
                onSelect={this.handleChangeStatus} style={{width: 200}}
                disabled={Number(record.status) === 2}
              >
                <Option value="1">进行中</Option>
                <Option value="2">已完成</Option>
              </Select>
            </Col>

            <Col span={12}>
              <label span={3} className="margin-right-20">下次提醒:</label>
              <DatePicker
                format={formatter.pattern.day}
                onChange={this.handleDateChange}
                disabled={Boolean(Number(this.state.status) === 2 || Number(record.status) === 2)}
                value={Boolean(Number(this.state.status) === 2 || Number(record.status) === 2) ? null : this.state.datePickValue}
              />
            </Col>
          </Row>

          <Row className="margin-bottom-40">
            <Col span={4}>
              <label span={6} className="margin-right-20">任务描述:</label>
            </Col>
            <Col span={18}>
              <p>{record.remark}</p>
            </Col>
          </Row>
          <Row>
            <Col span={4}>
              <label span={6} className="margin-right-20">任务跟踪:</label>
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
