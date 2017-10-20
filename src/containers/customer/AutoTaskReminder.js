import React from 'react';
import { Button, Modal, DatePicker, Input, message, Form, Icon } from 'antd';

import api from '../../middleware/api';
import formatter from '../../utils/DateFormatter';
import FormLayout from '../../utils/FormLayout';

import BaseModal from '../../components/base/BaseModal';

const FormItem = Form.Item;

export default class AutoTaskReminder extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      disabled: false,
      remark: '',
      remindDate: '',
    };

    [
      'getNextDay',
      'handleDateChange',
      'handleRemark',
      'handleSubmit',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.setState({
      remindDate: this.getNextDay(),
    });
  }

  showModal() {
    this.setState({ visible: true });
  }

  handleDateChange(value) {
    const date = formatter.day(value);
    this.setState({
      remindDate: date,
    });
  }

  handleRemark(e) {
    this.setState({
      remark: e.target.value,
    });
  }

  handleSubmit() {
    const { auto } = this.props;

    if (!this.state.remark) {
      message.warning('请填写任务描述');
      return false;
    }

    this.setState({ disabled: true });

    api.ajax({
      url: api.task.createMaintainTask(),
      type: 'POST',
      data: {
        customer_id: auto.customer_id,
        auto_id: auto._id,
        remind_date: this.state.remindDate || this.getNextDay(),
        remark: this.state.remark,
      },
    }, () => {
      message.success('保存数据成功');
      location.reload();
    }, () => {
      message.error('保存数据失败');
    });

    this.hideModal();
  }

  getNextDay() {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year  }-${  month  }-${  day}`;
  }

  render() {
    const { formItemLayout } = FormLayout;
    const { size, auto } = this.props;
    const { disabled } = this.state;

    return (
      <span>
        {size === 'small' ? <a href="javascript:;" onClick={this.showModal}>提醒保养</a> :
          <Button type="primary" onClick={this.showModal} disabled={disabled}>提醒保养</Button>
        }

        <Modal
          title={<span><Icon type="clock-circle-o" /> 创建保养提醒</span>}
          visible={this.state.visible}
          width={720}
          onCancel={this.hideModal}
          onOk={this.handleSubmit}
        >
          <Form>

            <FormItem label="车牌号" {...formItemLayout}>
              <p>{auto.plate_num}</p>
            </FormItem>

            <FormItem label="提醒日期" {...formItemLayout}>
              <DatePicker
                defaultValue={formatter.getMomentDate(this.getNextDay())}
                format={formatter.pattern.day}
                onChange={this.handleDateChange}
                allowClear={false}
              />
            </FormItem>

            <FormItem label="任务描述" {...formItemLayout}>
              <Input
                type="textarea"
                style={{ width: 430 }}
                onChange={this.handleRemark}
                placeholder="添加任务描述"
              />
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}
