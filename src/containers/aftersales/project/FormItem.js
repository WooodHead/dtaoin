import React from 'react';
import {message, Form, Input, Select, Button, Row, Col} from 'antd';
import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';
import BaseModal from '../../../components/base/BaseModal';
import MaintainItemSearchBox from '../../../components/search/MaintainItemSearchBox';

const FormItem = Form.Item;
const Option = Select.Option;

// 与FormItem冲突，命名为ItemForm
class ItemForm extends BaseModal {
  constructor(props) {
    super(props);
    this.setMaintainItemName(props.maintain_item, props.memberDetailList);
    this.state = {
      fitterUsers: [],
      memberDetailList: props.memberDetailList,
      maintain_item: props.maintain_item ? props.maintain_item : {},
    };

    [
      'updateState',
      'handleFocusBlur',
      'getPreferentialAmount',
      'getPaidAmount',
      'setformDataTypeRate',
      'setMaintainItemName',
    ].map((method) => this[method] = this[method].bind(this));
  }

  componentWillMount() {
    //this.setState({part_id: this.props.part._id});
    this.getFitterUsers();
  }

  getFitterUsers() {
    api.ajax({url: api.user.getMaintainUsers(0)}, function (data) {
      this.setState({fitterUsers: data.res.user_list});
    }.bind(this));
  }

  handleTimeFeeBaseChange(event) {
    let timeFeeBase = event.target.value;

    let {maintain_item} = this.state;
    if (maintain_item) {
      maintain_item.time_fee_base = timeFeeBase;
      maintain_item.time_fee = (maintain_item.time_count || 1) * timeFeeBase;

      this.setformDataTypeRate(maintain_item, this.state.memberDetailList);
      maintain_item.coupon_discount = this.getPreferentialAmount(maintain_item);
      maintain_item.paid_amount = this.getPaidAmount(maintain_item);
    }

    this.setState({
      maintain_item: maintain_item,
    });
    let form = this.props.form;
    form.setFieldsValue({
      time_fee_base: maintain_item.time_fee_base,
    });
  }

  handleTimeCountChange(event) {
    let timeCount = event.target.value;

    let {maintain_item} = this.state;
    if (maintain_item) {
      maintain_item.time_count = timeCount;
      maintain_item.time_fee = maintain_item.time_fee_base * timeCount;

      this.setformDataTypeRate(maintain_item, this.state.memberDetailList);
      maintain_item.coupon_discount = this.getPreferentialAmount(maintain_item);
      maintain_item.paid_amount = this.getPaidAmount(maintain_item);
    }

    this.setState({
      maintain_item: maintain_item,
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
      maintain_item.time_fee = maintain_item.time_count * list[index].price;
    }

    this.setState({maintain_item: maintain_item});
    let form = this.props.form;
    form.setFieldsValue({
      time_fee_base: maintain_item.time_fee_base,
    });
  }

  handleFixerSelect() {
    // handleFixerSelect(value1, value2) {
    // console.log('select-value1'+value1);
    // console.log('select-value2'+value2);
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
      for (let i = 0; i < this.state.fitterUsers.length; i++) {
        if (userIdArray.indexOf(this.state.fitterUsers[i]._id) > -1) {
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
      level_name: (maintain_item.levels.length == 0) ? '现场报价' : '',
    });
  }

  handleFocusBlur(e) {
    this.setState({
      focus: e.target === document.activeElement,
    });
  }

  getPreferentialAmount(record) {
    switch (Number(record.type)) {
      case 1:
        if (Number(record.time_count) >= Number(record.coupon_time_count)) {
          return Number(record.coupon_time_count) * Number(record.time_fee_base);
        } else {
          return Number(record.time_count) * Number(record.time_fee_base);
        }
      case 2:
        if (Number(record.time_count) >= Number(record.coupon_time_count)) {
          return Number(record.time_fee_base * (1 - record.discount_rate) * record.coupon_time_count).toFixed(2);
        } else {
          return Number(record.time_fee_base * (1 - record.discount_rate) * record.time_count).toFixed(2);
        }
      case 3:
        return Number(record.discount_amount);
      default:
        return 0;
    }
  }

  getPaidAmount(record) {
    return Number(record.time_fee) - this.getPreferentialAmount(record);
  }

  setformDataTypeRate(formData, memberDetailList) {
    if (memberDetailList) {
      memberDetailList.map((item) => {
        if (Number(item._id) === Number(formData.customer_coupon_item_id)) {
          formData.type = item.coupon_item_info.type;
          formData.discount_rate = item.coupon_item_info.discount_rate;
        }
      });
    }
  }

  setMaintainItemName(maintain_item, memberDetailList) {
    if (memberDetailList) {
      memberDetailList.map((item) => {
        if (Number(item._id) === Number(maintain_item.customer_coupon_item_id)) {
          maintain_item.type = item.coupon_item_info.type;
          maintain_item.discount_rate = item.coupon_item_info.discount_rate;
          maintain_item.name = item.name;
        }
      });
    }
  }

  handleCommit(e) {
    e.preventDefault();
    let formData = this.props.form.getFieldsValue();
    let {maintain_items} = this.props;
    if (maintain_items) {
      for (let key of maintain_items) {
        if (Number(key[0]) === Number(formData.item_id)) {
          message.warn('该项目已经添加,请重新选择');
          return;
        }
      }
    }
    if (!formData.item_id || !formData.fitter_user_ids || isNaN(formData.paid_amount)) {
      message.warning('请完善表格');
      return;
    }
    this.setformDataTypeRate(formData, this.state.memberDetailList);
    formData.coupon_discount = this.getPreferentialAmount(formData);
    formData.paid_amount = this.getPaidAmount(formData);
    formData.time_fee = formData.time_count * formData.time_fee_base;
    this.props.onSuccess(formData);
    this.props.form.resetFields();
    this.setState({maintain_item: {}});
  }

  handleCommitNext(e) {
    e.preventDefault();
    let formData = this.props.form.getFieldsValue();
    let {maintain_items} = this.props;
    if (maintain_items) {
      for (let key of maintain_items) {
        if (Number(key[0]) === Number(formData.item_id)) {
          message.warn('该项目已经添加,请重新选择');
          return;
        }
      }
    }
    if (!formData.item_id || !formData.fitter_user_ids || isNaN(formData.paid_amount)) {
      message.warning('请完善表格');
      return;
    }
    formData.coupon_discount = this.getPreferentialAmount(formData);
    formData.paid_amount = this.getPaidAmount(formData);
    formData.time_fee = formData.time_count * formData.time_fee_base;
    this.props.onSuccess(formData, false);
    message.success('添加成功，请继续添加下一个');
    this.setState({maintain_item: {}});
    let form = this.props.form;
    form.setFieldsValue({
      time_fee_base: '',
      level_name: '现场报价',
    });
    this.props.form.resetFields();
  }

  render() {
    let {formItem8_15, selectStyle} = Layout;
    let {getFieldDecorator} = this.props.form;
    let {maintain_item} = this.state;
    let item_data = maintain_item.item_id ? [{_id: maintain_item.item_id, name: maintain_item.item_name}] : [];

    return (
      <Form>
        {getFieldDecorator('_id', {initialValue: maintain_item._id})(<Input type="hidden"/>)}
        {getFieldDecorator('item_id', {initialValue: maintain_item.item_id})(<Input type="hidden"/>)}
        {getFieldDecorator('item_name', {initialValue: maintain_item.item_name})(<Input type="hidden"/>)}
        {getFieldDecorator('fitter_user_ids', {initialValue: maintain_item.fitter_user_ids})(<Input type="hidden"/>)}
        {getFieldDecorator('fitter_user_names', {initialValue: maintain_item.fitter_user_names})(<Input
          type="hidden"/>)}
        {getFieldDecorator('maintain_type', {initialValue: maintain_item.maintain_type})(<Input type="hidden"/>)}
        {getFieldDecorator('maintain_type_name', {initialValue: maintain_item.maintain_type_name})(<Input
          type="hidden"/>)}
        {getFieldDecorator('level_name', {initialValue: maintain_item.level_name})(<Input type="hidden"/>)}
        {getFieldDecorator('customer_coupon_item_id', {initialValue: maintain_item.customer_coupon_item_id})(<Input
          type="hidden"/>)}
        {getFieldDecorator('type', {initialValue: maintain_item.type})(<Input type="hidden"/>)}
        {getFieldDecorator('discount_rate', {initialValue: maintain_item.discount_rate})(<Input type="hidden"/>)}
        {getFieldDecorator('coupon_discount', {initialValue: maintain_item.coupon_discount})(<Input type="hidden"/>)}

        <Row>
          <Col span={12}>
            <FormItem label="项目" {...formItem8_15} required>
              <MaintainItemSearchBox
                value={maintain_item.item_name}
                data={item_data}
                select={this.handleItemChange.bind(this)}
                style={{width: '100%'}}
                disabled={this.props.projectDisabled}
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="项目档次" {...formItem8_15}>
              {getFieldDecorator('level_name', {initialValue: maintain_item.level_name})(
                <Select
                  filterOption={false}
                  onSelect={this.handleLevelSelect.bind(this)}
                  disabled={!maintain_item.levels}
                  optionFilterProp="children"
                  placeholder="请选择档次">
                  {maintain_item.levels && maintain_item.levels.map(item => <Option
                    key={item.name}>{item.name}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem label="维修人员" {...formItem8_15} required>
              {getFieldDecorator('default_fitter', {initialValue: maintain_item.fitter_user_names ? maintain_item.fitter_user_ids.split(',') : []})(
                <Select
                  multiple
                  onSelect={this.handleFixerSelect.bind(this)}
                  onChange={this.handleFixerChange.bind(this)}
                  {...selectStyle}
                  className="no-margin-bottom"
                  placeholder="请选择维修人员">
                  {this.state.fitterUsers.map(user => <Option key={user._id}>{user.name}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>

        <div className="form-line-divider"/>

        <Row>
          <Col span={12}>
            <FormItem label="工时单价" {...formItem8_15} required>
              {getFieldDecorator('time_fee_base', {initialValue: maintain_item.time_fee_base})(
                <Input
                  type="number"
                  disabled={maintain_item.levels && maintain_item.levels.length > 0}
                  onChange={this.handleTimeFeeBaseChange.bind(this)} min={0} step={1} placeholder="请输入工时单价"
                  addonAfter="元"
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="工时数量" {...formItem8_15} required>
              {getFieldDecorator('time_count', {initialValue: maintain_item.time_count ? maintain_item.time_count : 1})(
                <Input
                  type="number"
                  onChange={this.handleTimeCountChange.bind(this)} min={1} step={1} placeholder="请输入工时数量"
                />
              )}
            </FormItem>
          </Col>
        </Row>

        <div className="form-line-divider"/>

        <Row>
          <Col span={12}>
            <FormItem label="优惠名称" {...formItem8_15}>
              {getFieldDecorator('coupon_item_name', {initialValue: maintain_item.name || ''})(
                <Input disabled/>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="优惠数量" {...formItem8_15}>
              {getFieldDecorator('coupon_time_count', {initialValue: maintain_item.coupon_time_count})(
                <Input type="number" disabled/>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem label="优惠金额" {...formItem8_15}>
              {getFieldDecorator('coupon_discount', {initialValue: maintain_item.coupon_discount})(
                <Input
                  type="number"
                  disabled
                  min={0}
                  step={1}
                  placeholder="优惠金额"
                  addonAfter="元"
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="实收金额" {...formItem8_15}>
              {getFieldDecorator('paid_amount', {initialValue: Number(maintain_item.time_fee - (maintain_item.coupon_discount || 0)).toFixed(2)})(
                <Input
                  type="number"
                  disabled
                  min={0} step={1} placeholder="实收金额" addonAfter="元"
                />
              )}
            </FormItem>
          </Col>
        </Row>

        <div className="form-action-container">
          <Button type="ghost" size="large" className="mr10" onClick={this.handleCommit.bind(this)}>完成</Button>
          <Button type="primary" size="large" onClick={this.handleCommitNext.bind(this)}>继续添加</Button>
        </div>
      </Form>
    );
  }
}

ItemForm = Form.create()(ItemForm);
export default ItemForm;
