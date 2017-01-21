import React from 'react';
import {message, Form, Input, Select, Button, DatePicker, Radio, Row, Col, Icon} from 'antd';
import api from '../../../middleware/api';
import formatter from '../../../utils/DateFormatter';
import Layout from '../../../utils/FormLayout';
import validator from '../../../utils/validator';
import BaseProject from '../../base/BaseProject';
import FormValidator from '../../../utils/FormValidator';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class NewProjectForm extends BaseProject {
  constructor(props) {
    super(props);
    this.state = {
      isNew: true,
      isEmpty: true,
      btnDisable: false,
      fitterAdmins: [],
      fitterUsers: [],
      startDate: new Date(),
      endDate: new Date(),
      itemHtml: [],
      partHtml: [],
      itemMap: new Map(),
      partMap: new Map(),
      deleteItemSet: new Set(),
      deletePartSet: new Set(),
      timeFee: 0,
      materialFee: 0,
      totalFee: 0,
    };
    [
      'handlePrevStep',
      'handlePreview',
      'handleSubmit',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    // isLeader 1 or 0
    this.getFitterAdmins(1);
    this.getFitterUsers(0);
  }

  handlePrevStep(e) {
    e.preventDefault();

    this.props.onSuccess({
      currentStep: this.props.prevStep,
      autoForm: '',
      projectForm: 'hide',
    });
  }

  handlePreview(e) {
    this.handleSubmit(e, 'NEXT');
  }

  handleSubmit(e, action) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error(validator.hasError);
        return;
      }

      let {isNew, itemMap, partMap, deleteItemSet, deletePartSet} = this.state,
        itemNames = [],
        partNames = [],
        items = [],
        parts = [],
        deleteItemIds = new Set(),
        deletePartIds = new Set();

      if (!isNew) {
        for (let item of deleteItemSet.values()) {
          deleteItemIds.add(item._id);
        }
        for (let part of deletePartSet.values()) {
          deletePartIds.add(part._id);
        }
        values.item_delete_ids = Array.from(deleteItemIds).toString();
        values.part_delete_ids = Array.from(deletePartIds).toString();
      }

      for (let item of itemMap.values()) {
        itemNames.push(item.item_name);
        items.push(item);
      }
      let partMap_count = 1;
      for (let part of partMap.values()) {
        partNames.push(part.part_name);
        parts.push(part);

        let partRemainderProp = 'part_remainder_' + partMap_count++;
        if (this.state[partRemainderProp] < 0) {
          message.error(part.part_name + ' 剩余库存不足,请重新填写或进货', 2);
          return false;
        }
      }

      values.start_time = formatter.date(this.state.startDate);
      values.end_time = formatter.date(this.state.endDate);
      values.item_names = itemNames.toString();
      values.part_names = partNames.toString();
      values.item_list = JSON.stringify(items);
      values.part_list = JSON.stringify(parts);
      values.total_fee = this.calculateTotalFee();

      // this.setState({btnDisable: true});
      api.ajax({
        url: isNew ? api.addMaintainIntention() : api.editMaintainIntention(),
        type: 'POST',
        data: values,
      }, (data) => {
        message.success(isNew ? '新增维保记录成功' : '修改维保记录成功');
        this.setState({
          isNew: false,
          // btnDisable: false
        });

        if (action === 'NEXT') {
          let projectId = data.res.intention_id,
            itemsSaved = data.res.item_list_saved,
            partsSaved = data.res.part_list_saved;

          this.getOptItems(projectId);
          this.getPartItems(projectId);

          this.props.onSuccess({
            currentStep: this.props.nextStep,
            projectForm: 'hide',
            confirmProject: '',
            project_id: projectId,
            project: values,
            items: itemsSaved,
            parts: partsSaved,
          });
        } else {
          this.props.cancelModal();
          location.reload();
        }
      }, (error) => {
        console.error(error);
        this.setState({btnDisable: false});
      });
    });
  }

  render() {
    const {formItemLayout, buttonLayout, selectStyle} = Layout;
    const {getFieldDecorator} = this.props.form;
    let {
      isNew,
      btnDisable,
      fitterAdmins,
      itemHtml,
      partHtml,
    } = this.state;

    let materialFee = this.calculateTotalMaterialFee(),
      timeFee = this.calculateTotalTimeFee(),
      totalFee = this.calculateTotalFee();

    return (
      <Form horizontal>
        {isNew ? '' : getFieldDecorator('_id', {initialValue: this.props.project_id})(
            <Input type="hidden"/>
          )}
        {getFieldDecorator('customer_id', {initialValue: this.props.customer_id})(
          <Input type="hidden"/>
        )}
        {getFieldDecorator('auto_id', {initialValue: this.props.auto_id})(
          <Input type="hidden"/>
        )}

        <Row>
          <Col span={11}>
            <FormItem label="维保负责人" labelCol={{span: 13}} wrapperCol={{span: 8}}>
              {getFieldDecorator('fitter_admin_id', {
                rules: [{required: true, message: validator.required.notNull}, {validator: FormValidator.notNull}],
                validateTrigger: 'onBlur',
              })(
                <Select
                  {...selectStyle}
                  placeholder="请选择维保负责人"
                >
                  {fitterAdmins.map(admin => <Option key={admin._id}>{admin.name}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={11}>
            <FormItem label="里程数" labelCol={{span: 4}} wrapperCol={{span: 11}}>
              {getFieldDecorator('mileage')(
                <Input type="number"  min={0} addonAfter="Km"/>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={11}>
            <FormItem label="进厂日期" labelCol={{span: 13}} wrapperCol={{span: 8}}>
              <DatePicker
                disabledDate={this.disabledStartDate.bind(this)}
                value={this.state.startDate}
                onChange={this.handleDateChange.bind(this, 'startDate')}
                placeholder="请选择进厂时间"/>
            </FormItem>
          </Col>
          <Col span={11}>
            <FormItem label="出厂日期" labelCol={{span: 4}} wrapperCol={{span: 11}}>
              <DatePicker
                disabledDate={this.disabledEndDate.bind(this)}
                value={this.state.endDate}
                onChange={this.handleDateChange.bind(this, 'endDate')}
                placeholder="请选择出厂时间"/>
            </FormItem>
          </Col>
        </Row>

        <FormItem label="是否事故车" {...formItemLayout}>
          {getFieldDecorator('is_accident', {initialValue: '0'})(
            <RadioGroup>
              <Radio value="0">否</Radio>
              <Radio value="1">是</Radio>
            </RadioGroup>
          )}
        </FormItem>

        <FormItem label="维修项目" className="form-item-container" {...formItemLayout}>
          {itemHtml.map(item => item)}
          <a href="javascript:;" onClick={this.addItem}><Icon type="plus"/> 添加维修项目</a>
        </FormItem>

        <FormItem label="维修配件" className="form-item-container" {...formItemLayout}>
          {partHtml.map(part => part)}
          <a href="javascript:;" onClick={this.addPart}><Icon type="plus"/> 添加配件</a>
        </FormItem>

        <Row>
          <Col span={11}>
            <FormItem label="材料费" labelCol={{span: 13}} wrapperCol={{span: 8}}>
              <p className="ant-form-text">{materialFee}元</p>
            </FormItem>
          </Col>
          <Col span={11}>
            <FormItem label="工时费" labelCol={{span: 4}} wrapperCol={{span: 11}}>
              <p className="ant-form-text">{timeFee}元</p>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={11}>
            <FormItem label="辅料费" labelCol={{span: 13}} wrapperCol={{span: 8}}>
              {getFieldDecorator('auxiliary_material_fee', {
                initialValue: 0,
                onChange: this.calculateTotalFee,
              })(
                <Input
                  type="number"
                  placeholder="请输入辅料费"
                  min={0}
                  addonAfter="元"
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <FormItem label="优惠券优惠" labelCol={{span: 13}} wrapperCol={{span: 8}}>
              {getFieldDecorator('coupon', {onChange: this.calculateTotalFee})(
                <Input
                type="number"
                defaultValue="0"
                placeholder="请输入优惠券优惠金额"
                min={0}
                addonAfter="元"
              />
              )}
            </FormItem>
          </Col>
          <Col span={11}>
            <FormItem label="抹零优惠" labelCol={{span: 4}} wrapperCol={{span: 11}}>
              {getFieldDecorator('discount', {onChange: this.calculateTotalFee})(
                <Input
                type="number"
                defaultValue="0"
                placeholder="请输入抹零优惠金额"
                min={0}
                addonAfter="元"
              />
              )}
            </FormItem>
          </Col>
        </Row>

        <FormItem label="结算金额" {...formItemLayout}>
          <p className="ant-form-text">{totalFee}元</p>
        </FormItem>

        <FormItem label="备注" {...formItemLayout}>
          {getFieldDecorator('remark')(
            <Input type="textarea"/>
          )}
        </FormItem>

        <FormItem {...buttonLayout}>
          <Button type="ghost" className="mr15" onClick={this.handlePrevStep}>上一步</Button>
          <Button type="primary" className="mr15" onClick={this.handlePreview} disabled={btnDisable}>预览</Button>
          <Button type="ghost" onClick={this.handleSubmit} disabled={btnDisable}>保存并退出</Button>
        </FormItem>
      </Form>
    );
  }
}

NewProjectForm = Form.create()(NewProjectForm);
export default NewProjectForm;
