import React from 'react';
import { Button, Modal, Select, DatePicker, Input, message, Form, Icon } from 'antd';

import api from '../../middleware/api';
import formatter from '../../utils/DateFormatter';
import FormLayout from '../../utils/FormLayout';

import BaseModal from '../base/BaseModal';
import NewRemindType from './CreateRemindType';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

/**
 * 创建提醒
 */
export default class CreateRemind extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      typeList: [],
      remark: '',
      remindDate: '',
      type: '',
    };

    [
      'getNextDay',
      'handleDateChange',
      'handleChangeType',
      'createCustomerTask',
      'handleRemark',
      'handleSubmit',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.setState({ remindDate: this.getNextDay() });
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

  handleChangeType(value) {
    this.setState({
      type: value,
    });
  }

  handleSubmit() {
    if (!this.state.remark) {
      message.warning('请填写任务描述');
      return;
    }

    this.createCustomerTask();
    this.hideModal();
  }

  createCustomerTask() {
    api.ajax({
      url: api.task.createCustomerTask(),
      type: 'POST',
      data: {
        customer_id: this.props.customer_id,
        type: 1,
        remind_date: this.state.remindDate || this.getNextDay(),
        remark: this.state.remark,
      },
    }, () => {
      message.success('保存数据成功');
    }, () => {
      message.error('保存数据失败');
    });
  }

  getNextDay() {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year  }-${  month  }-${  day}`;
  }

  disabledStartDate(current) {
    return current && current.valueOf() < new Date(new Date().setDate(new Date().getDate() - 1));
  }

  hideModal() {
    this.setState({ visible: false, remark: '' });
  }

  // saveNewRemindType(newItem) {
  //   this.createCommonTaskType(newItem);
  // }

  // 获取顾客任务类型
  // getCommonTaskTypeList(newItemId) {
  //   api.ajax({
  //     url: api.task.commonTaskTypeList(),
  //   }, (data) => {
  //     this.setState({
  //       typeList: data.res.list,
  //     });
  //     if (newItemId) {
  //       this.setState({
  //         type: String(newItemId),
  //       });
  //     }
  //   }, () => {
  //     message.error('保存数据失败');
  //   });
  // }

  // 创建顾客任务类型
  // createCommonTaskType(newItem) {
  //   api.ajax({
  //     url: api.task.createCommonTaskType(),
  //     type: 'POST',
  //     data: {
  //       name: newItem,
  //     },
  //   }, (data) => {
  //     message.success('创建任务类型成功');
  //     this.getCommonTaskTypeList(data.res.detail._id);
  //   }, () => {
  //     message.error('创建任务类型失败');
  //   });
  // }

  render() {
    const { formItemLayout } = FormLayout;
    const { size } = this.props;

    return (
      <span>
        {size === 'small' ? <a href="javascript:;" onClick={this.showModal}>提醒</a> :
          <Button type="primary" onClick={this.showModal}>回访提醒</Button>
        }

        <Modal
          title={<span><Icon type="clock-circle-o" /> 回访提醒</span>}
          visible={this.state.visible}
          width={720}
          onCancel={this.hideModal}
          onOk={this.handleSubmit}
        >
          <Form>
            <FormItem label="提醒日期" {...formItemLayout}>
              <DatePicker
                defaultValue={formatter.getMomentDate(this.getNextDay())}
                format={formatter.pattern.day}
                onChange={this.handleDateChange}
                allowClear={false}
                disabledDate={this.disabledStartDate}
              />
            </FormItem>

            <FormItem label="任务描述" {...formItemLayout}>
              <TextArea
                style={{ width: 430 }}
                onChange={this.handleRemark}
                placeholder="添加任务描述"
                value={this.state.remark}
              />
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}
