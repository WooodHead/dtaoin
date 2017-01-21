import React from 'react';
import {Button, Modal, Row, Col, Select, DatePicker, Input, message} from 'antd';
import BaseModal from '../../base/BaseModal';
import NewRemindType from './NewRemindType';
import formatter from '../../../utils/DateFormatter';
import api from '../../../middleware/api';


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
    return (
      <span>
        {
          this.props.transaction
            ?
            <Button
              className="mr15"
              size="small"
              onClick={this.showModal}
            >
              创建提醒
            </Button>
            :
            <Button
              type="primary"
              size={this.props.size || 'default'}
              onClick={this.showModal}
            >
              创建提醒
            </Button>
        }

        <Modal
          title="创建提醒"
          visible={this.state.visible}
          width="750px"
          onCancel={this.hideModal}
          onOk={this.handleSubmit}
        >
          <Row className="margin-bottom-40">
            <Col span={9}>
              <label className="margin-right-35">提醒日期:</label>
              <DatePicker
                defaultValue={formatter.getMomentDate(this.getNextDay())}
                format={formatter.pattern.day}
                onChange={this.handleDateChange}
              />
            </Col>

            <Col span={9}>
              <label span={4} className="margin-right-20">类型:</label>
              <Select
                size="large"
                onSelect={this.handleChangeType}
                style={{width: '200px'}}
                value={this.state.type}
              >
                {this.state.typeList.map((item, index) =>
                  <Option value={`${item._id}`} key={index}>{item.name}</Option>
                )}
              </Select>
            </Col>
            <Col span={3}>
              <NewRemindType save={this.saveNewRemindType}/>
            </Col>
          </Row>
          <Row>
            <Col span={3}>
              <label span={24} className="margin-right-20">任务描述:</label>
            </Col>

            <Col span={18}>
              <Input type="textarea" placeholder="添加任务描述" style={{width: '430px'}} onChange={this.handleRemark}/>
            </Col>
          </Row>
        </Modal>
      </span>
    );
  }
}
