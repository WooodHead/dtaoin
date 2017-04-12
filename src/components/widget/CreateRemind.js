import React from 'react';
import {Button, Modal, Select, DatePicker, Input, message, Form, Icon} from 'antd';

import api from '../../middleware/api';
import formatter from '../../utils/DateFormatter';
import FormLayout from '../../utils/FormLayout';

import BaseModal from '../base/BaseModal';
import NewRemindType from './CreateRemindType';

const FormItem = Form.Item;
const Option = Select.Option;

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
      'saveNewRemindType',
      'handleDateChange',
      'handleChangeType',
      'saveNewRemindType',
      'createCustomerTask',
      'handleRemark',
      'handleSubmit',
      'getCommonTaskTypeList',
      'createCommonTaskType',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.setState({
      remindDate: this.getNextDay(),
    });
  }

  showModal() {
    this.setState({visible: true});
    this.getCommonTaskTypeList();
  }

  handleDateChange(value) {
    let date = formatter.day(value);
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
    if (!this.state.type) {
      message.warning('请填写类型');
      return;
    } else if (!this.state.remark) {
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
        type: this.state.type,
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
    let date = new Date();
    date.setDate(date.getDate() + 1);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return year + '-' + month + '-' + day;
  }

  saveNewRemindType(newItem) {
    this.createCommonTaskType(newItem);
  }

  //获取顾客任务类型
  getCommonTaskTypeList(newItemId) {
    api.ajax({
      url: api.task.commonTaskTypeList(),
    }, (data) => {
      this.setState({
        typeList: data.res.list,
      });
      if (newItemId) {
        this.setState({
          type: String(newItemId),
        });
      }
    }, () => {
      message.error('保存数据失败');
    });
  }

  //创建顾客任务类型
  createCommonTaskType(newItem) {
    api.ajax({
      url: api.task.createCommonTaskType(),
      type: 'POST',
      data: {
        name: newItem,
      },
    }, (data) => {
      message.success('创建任务类型成功');
      this.getCommonTaskTypeList(data.res.detail._id);
    }, () => {
      message.error('创建任务类型失败');
    });
  }

  render() {
    const {formItemLayout} = FormLayout;
    let {size} = this.props;

    return (
      <span>
        {size === 'small' ?
          <a href="javascript:;" onClick={this.showModal}>创建提醒</a> :
          <Button type="primary" onClick={this.showModal}>创建提醒</Button>
        }

        <Modal
          title={<span><Icon type="clock-circle-o"/> 创建提醒</span>}
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
              />
            </FormItem>

            <FormItem label="类型" {...formItemLayout}>
              <Select
                size="large"
                onSelect={this.handleChangeType}
                style={{width: 142}}
                value={this.state.type}
                className="mr10"
              >
                {this.state.typeList.map((item, index) =>
                  <Option value={`${item._id}`} key={index}>{item.name}</Option>
                )}
              </Select>
              <NewRemindType save={this.saveNewRemindType}/>
            </FormItem>

            <FormItem label="任务描述" {...formItemLayout}>
              <Input
                type="textarea"
                style={{width: 430}}
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
