import React, {Component} from 'react'
import {message, Form, Input, Select, Radio, Button, DatePicker, InputNumber, Tag, Row, Col} from 'antd'
import api from '../../../middleware/api'
import formatter from '../../../middleware/formatter'
import Layout from '../Layout'
import {Link} from 'react-router'
import BaseModal from '../../base/BaseModal'
import validator from '../../../middleware/validator'
import MaintainItemSearchBox from '../../search/MaintainItemSearchBox'

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class AddEditMaintainItemForm extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      fitterUsers: [],
      maintain_item: this.props.maintain_item ? this.props.maintain_item : {},
    };
    [
      'updateState',
      'handleFocusBlur'
    ].map((method) => this[method] = this[method].bind(this));
  }

  componentWillMount() {
    //this.setState({part_id: this.props.part._id});
    this.getFitterUsers();
  }

  getFitterUsers() {
    api.ajax({url: api.user.getMaintainUsers(0)}, function (data) {
      this.setState({fitterUsers: data.res.user_list});
    }.bind(this))
  }

  handleTimeFeeBaseChange(event) {
    let timeFeeBase = event.target.value;

    let {maintain_item} = this.state;
    if (maintain_item) {
      maintain_item.time_fee_base = timeFeeBase;
      maintain_item.time_fee   = maintain_item.time_count * timeFeeBase;
    }

    this.setState({
      maintain_item: maintain_item
    });
    let form = this.props.form;
    form.setFieldsValue({
      time_fee_base: maintain_item.time_fee_base
    });
  }

  handleTimeCountChange(event) {
    let timeCount = event.target.value;

    let {maintain_item} = this.state;
    if (maintain_item) {
      maintain_item.time_count = timeCount;
      maintain_item.time_fee   = maintain_item.time_fee_base * timeCount;
    }

    this.setState({
      maintain_item: maintain_item
    });
  }

  updateState(obj) {
    this.setState(obj);
  }

  handleLevelSelect(value, option) {
    let {maintain_item} = this.state;

    let index = option.props.index;
    let list = maintain_item.levels;

    if (maintain_item) {
      maintain_item.time_fee_base = list[index].price;
      maintain_item.time_fee   = maintain_item.time_count * list[index].price;
    }

    this.setState({maintain_item: maintain_item});
    let form = this.props.form;
    form.setFieldsValue({
      time_fee_base: maintain_item.time_fee_base
    });
  }

  handleFixerSelect(value1, value2) {
    console.log('select-value1'+value1);
    console.log('select-value2'+value2);
    //let userIds = value ? value.toString() : '';
    //console.log(userIds);
    //let {maintain_item} = this.state;

    //if (maintain_item) {
    //  maintain_item.fitter_user_ids = userIds;
    //}

    //this.setState({maintain_item: maintain_item});
  }

  handleFixerChange(value) {
    let userIds = value ? value.toString() : '';
    let {maintain_item} = this.state;

    if (maintain_item) {
      let userIdArray = userIds.split(',');
      let userNameArray = [];
      for(let i = 0; i < this.state.fitterUsers.length; i++){
          if(userIdArray.indexOf(this.state.fitterUsers[i]._id) > -1) {
            userNameArray.push(this.state.fitterUsers[i].name);
          }
      }
      maintain_item.fitter_user_ids = userIds;
      maintain_item.fitter_user_names = userNameArray.join(',');
    }

    this.setState({maintain_item: maintain_item});
  }

  handleItemChange(optItem) {
    let {maintain_item} = this.state;

    maintain_item._id = maintain_item._id ? maintain_item._id : 0;

    maintain_item.item_id = optItem._id;
    maintain_item.item_name = optItem.name;
    maintain_item.levels = optItem.levels ? JSON.parse(optItem.levels) : [];
    maintain_item.time_count = maintain_item.time_count ? maintain_item.time_count : 1;
    maintain_item.maintain_type = optItem.maintain_type;
    maintain_item.maintain_type_name = optItem.maintain_type_name;

    this.setState({maintain_item: maintain_item});

    let form = this.props.form;
    form.setFieldsValue({
      level_name: (maintain_item.levels.length == 0) ? '现场报价' : ''
    });
  }

  handleFocusBlur(e) {
    this.setState({
      focus: e.target === document.activeElement
    });
  }

  handleCommit(e) {
    e.preventDefault();
    let formData = this.props.form.getFieldsValue();
    if (!formData.item_id || !formData.fitter_user_ids || isNaN(formData.time_fee)) {
      message.warning('请完善表格');
      return;
    }

    this.props.onSuccess(formData, true);
  }

  handleCommitNext(e) {
    e.preventDefault();
    let formData = this.props.form.getFieldsValue();
    if (!formData.item_id || !formData.fitter_user_ids || isNaN(formData.time_fee)) {
      message.warning('请完善表格');
      return;
    }

    this.props.onSuccess(formData, false);
    message.success('添加成功，请继续添加下一个');
    this.setState({maintain_item: {}});
    let form = this.props.form;
    form.setFieldsValue({
      time_fee_base: '',
      level_name: '现场报价'
    });
  }

  render() {
    let {formItemLayout, buttonLayout, selectStyle} = Layout;
    let {getFieldProps, getFieldValue} = this.props.form;
    let {maintain_item} = this.state;
    let item_data = maintain_item.item_id ? [{_id: maintain_item.item_id, name: maintain_item.item_name}] : [];

    return (
      <Form horizontal>
        <Input type="hidden" {...getFieldProps('_id', {initialValue: maintain_item._id})}/>
        <Input type="hidden" {...getFieldProps('item_id', {initialValue: maintain_item.item_id})}/>
        <Input type="hidden" {...getFieldProps('item_name', {initialValue: maintain_item.item_name})}/>
        <Input type="hidden" {...getFieldProps('fitter_user_ids', {initialValue: maintain_item.fitter_user_ids})}/>
        <Input type="hidden" {...getFieldProps('fitter_user_names', {initialValue: maintain_item.fitter_user_names})}/>
        <Input type="hidden" {...getFieldProps('maintain_type', {initialValue: maintain_item.maintain_type})}/>
        <Input type="hidden" {...getFieldProps('maintain_type_name', {initialValue: maintain_item.maintain_type_name})}/>
        <Input type="hidden" {...getFieldProps('level_name', {initialValue: maintain_item.level_name})}/>

        <Row>
          <Col sm={8}>
            <FormItem label='项目' {...formItemLayout} labelCol={{ span: 6 }} wrapperCol={{ span: 17 }} required>
              <MaintainItemSearchBox
                value={maintain_item.item_name}
                data={item_data}
                select={this.handleItemChange.bind(this)}
                style={{width: '100%'}}
              />
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem label="项目档次" {...formItemLayout} labelCol={{ span: 6 }} wrapperCol={{ span: 17 }}>
              <Select
                {...getFieldProps('level_name', {initialValue: maintain_item.level_name})}
                size="large"
                filterOption={false}
                onSelect={this.handleLevelSelect.bind(this)}
                disabled={!maintain_item.levels}
                optionFilterProp="children"
                placeholder="请选择档次">
                {maintain_item.levels && maintain_item.levels.map(item =><Option key={item.name}>{item.name}</Option>)}
              </Select>
            </FormItem>
          </Col>

          <Col sm={8}>
            <FormItem label="工时单价" {...formItemLayout} labelCol={{ span: 6 }} wrapperCol={{ span: 17 }} required>
              <Input type="number" {...getFieldProps('time_fee_base', {initialValue: maintain_item.time_fee_base})} disabled={maintain_item.levels && maintain_item.levels.length > 0} onChange={this.handleTimeFeeBaseChange.bind(this)} min={0} step={1} placeholder="请输入工时单价" addonAfter="元"/>
            </FormItem>
          </Col>

        </Row>

        <Row>
          <Col sm={8}>
            <FormItem label="维修人员" {...formItemLayout} labelCol={{ span: 6 }} wrapperCol={{ span: 17 }} required>
              <Select
                multiple
                {...getFieldProps('default_fitter', {initialValue: maintain_item.fitter_user_names ? maintain_item.fitter_user_ids.split(',') : []})}
                onSelect={this.handleFixerSelect.bind(this)}
                onChange={this.handleFixerChange.bind(this)}
                {...selectStyle}                                                                 
                className="no-margin-bottom"
                placeholder="请选择维修人员">
                {this.state.fitterUsers.map(user => <Option key={user._id}>{user.name}</Option>)}
              </Select>
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem label="工时数量" {...formItemLayout} labelCol={{ span: 6 }} wrapperCol={{ span: 17 }} required>
              <Input type="number" {...getFieldProps('time_count', {initialValue: maintain_item.time_count ? maintain_item.time_count : 1})} onChange={this.handleTimeCountChange.bind(this)} min={1} step={1} placeholder="请输入工时数量" />
            </FormItem>
          </Col>

          <Col sm={8}>
            <FormItem label="工时费：" className="no-margin-bottom" labelCol={{span: 6}} wrapperCol={{span: 17}} addonAfter="元">
              <Input
                {...getFieldProps('time_fee', {initialValue: maintain_item.time_fee})}
                type="number"
                disabled={true}
                className="ant-input ant-input-lg"
                min={0}
                placeholder="工时费"
                addonAfter="元"
              />
            </FormItem>
          </Col>
        </Row>

        <FormItem {...buttonLayout}>
          <Button type="ghost" className="mr15" onClick={this.props.cancelModal}>取消</Button>
          <Button type="primary" className="mr15" onClick={this.handleCommit.bind(this)}>提交</Button>
          <Button type="primary" className="mr15" onClick={this.handleCommitNext.bind(this)}>提交并下一个</Button>
        </FormItem>
      </Form>
    )
  }
}

AddEditMaintainItemForm = Form.create()(AddEditMaintainItemForm);
export default AddEditMaintainItemForm
