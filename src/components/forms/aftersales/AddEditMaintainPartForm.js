import React, {Component} from 'react'
import {message, Form, Input, Select, Radio, Button, DatePicker, InputNumber, Tag, Row, Col} from 'antd'
import api from '../../../middleware/api'
import formatter from '../../../middleware/formatter'
import Layout from '../Layout'
import {Link} from 'react-router'
import BaseModal from '../../base/BaseModal'
import MaintainPartTypeSearchBox from '../../search/MaintainPartTypeSearchBox'
import PartSearchBox from '../../search/PartSearchBox'

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class AddEditMaintainPartForm extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      maintain_part: this.props.maintain_part ? this.props.maintain_part : {},
    };
    [
      'updateState',
      'handleFocusBlur'
    ].map((method) => this[method] = this[method].bind(this));
  }

  componentWillMount() {
    if (this.props.maintain_part && parseInt(this.props.maintain_part.part_id) > 0) {
      api.ajax({url: api.getPartsDetail(this.props.maintain_part.part_id)}, (data) => {        
          let {maintain_part} = this.state;
          maintain_part.part_amount = data.res.detail.amount - data.res.detail.freeze;

          if (maintain_part._id) {
              maintain_part.part_amount += maintain_part.real_count;
          }
          this.setState({maintain_part: maintain_part});
      });
    }
  }

  handleMaterialFeeBaseChange(event) {
    let materialFeeBase = event.target.value;
    console.log('handleMaterialFeeBaseChange:'+materialFeeBase);

    let {maintain_part} = this.state;
    if (maintain_part) {
      maintain_part.material_fee_base = materialFeeBase;
      maintain_part.material_fee   = maintain_part.count * materialFeeBase;
    }

    this.setState({
      maintain_part: maintain_part
    });
    let form = this.props.form;
    form.setFieldsValue({
      material_fee_base: maintain_part.material_fee_base
    });
  }

  handleMaterialCountChange(event) {
    let count = event.target.value;

    let {maintain_part} = this.state;
    if (maintain_part) {
      maintain_part.count = count;
      maintain_part.material_fee   = maintain_part.material_fee_base * count;
    }

    this.setState({
      maintain_part: maintain_part
    });
  }

  handleRealCountChange(event) {
    let real_count = event.target.value;
    console.log('handleRealCountChange:'+real_count);
    console.log('this.state.maintain_part.part_amount:'+this.state.maintain_part.part_amount);

    if (Number(real_count) > Number(this.state.maintain_part.part_amount)) {
      real_count = this.state.maintain_part.part_amount;
      message.warning('配件数量不够');
      return;
    }

    let {maintain_part} = this.state;
    maintain_part.real_count = real_count; 
    maintain_part.remain_count = Number(this.state.maintain_part.part_amount)-Number(real_count);

    this.setState({maintain_part: maintain_part});
  }

  updateState(obj) {
    this.setState(obj);
  }

  handleLevelSelect(value, option) {
    let {maintain_part} = this.state;

    let index = option.props.index;
    let list = maintain_part.levels;

    if (maintain_part) {
      maintain_part.material_fee_base = list[index].price;
      maintain_part.material_fee   = maintain_part.count * list[index].price;
    }

    this.setState({maintain_part: maintain_part});
    let form = this.props.form;
    form.setFieldsValue({
      material_fee_base: maintain_part.material_fee_base
    });
  }

  handlePartSelect(data) {
    let part = data.data;
    let {maintain_part} = this.state;

    if (maintain_part) {
      maintain_part.part_id = part._id;
      maintain_part.part_name = part.name;
      maintain_part.part_amount = part.amount - part.freeze;
      maintain_part.part_freeze = part.freeze;
      maintain_part.scope = part.scope;
      maintain_part.part_spec = part.spec;
      maintain_part.part_unit = part.unit;
      maintain_part.maintain_type = part.maintain_type;
      maintain_part.maintain_type_name = part.maintain_type_name;
      maintain_part.remain_count = part.amount - part.freeze;
    }

    this.setState({maintain_part: maintain_part});
  }

  handlePartTypeSelect(optPart) {
    let {maintain_part} = this.state;

    maintain_part._id = maintain_part._id ? maintain_part._id : 0;

    maintain_part.part_type_id = optPart._id;
    maintain_part.part_type_name = optPart.name;
    maintain_part.levels = optPart.levels ? JSON.parse(optPart.levels) : [];
    maintain_part.count = maintain_part.count ? maintain_part.count : 1;
    maintain_part.material_fee = maintain_part.material_fee ? maintain_part.material_fee : 0.00;

    this.setState({maintain_part: maintain_part});

    let form = this.props.form;
    form.setFieldsValue({
      level_name: (maintain_part.levels.length == 0) ? '现场报价' : '',
      material_fee_base: 0
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
    if (!formData.part_id || !formData.real_count) {
      message.warning('请完善表格');
      return;
    }
    if (Number(formData.real_count) <= 0) {
      message.warning('领料数量不能为0');
      return;
    }
    if (Number(formData.real_count) > Number(this.state.maintain_part.part_amount)) {
      message.warning('配件数量不够');
      return;
    }

    this.props.onSuccess(formData, true);
  }

  handleCommitNext(e) {
    e.preventDefault();
    let formData = this.props.form.getFieldsValue();
    if (!formData.part_id || !formData.real_count) {
      message.warning('请完善表格');
      return;
    }
    if (Number(formData.real_count) <= 0) {
      message.warning('领料数量不能为0');
      return;
    }
    if (Number(formData.real_count) > Number(this.state.maintain_part.part_amount)) {
      message.warning('配件数量不够');
      return;
    }

    this.props.onSuccess(formData, false);
    message.success('添加成功，请继续添加下一个');
    this.setState({maintain_part: {}});
  }

  render() {
    let {formItemLayout, buttonLayout, selectStyle} = Layout;
    let {getFieldProps, getFieldValue} = this.props.form;
    let {maintain_part} = this.state;
    let part_type_data = maintain_part.part_type_id ? [{_id: maintain_part.part_type_id, name: maintain_part.part_type_name}] : [];
    let part_data = maintain_part.part_id ? [{_id: maintain_part.part_id, name: maintain_part.part_name}] : [];

    return (
      <Form horizontal>
        <Input type="hidden" {...getFieldProps('_id', {initialValue: maintain_part._id})}/>
        <Input type="hidden" {...getFieldProps('part_type_id', {initialValue: maintain_part.part_type_id})}/>
        <Input type="hidden" {...getFieldProps('part_type_name', {initialValue: maintain_part.part_type_name})}/>
        <Input type="hidden" {...getFieldProps('part_id', {initialValue: maintain_part.part_id})}/>
        <Input type="hidden" {...getFieldProps('part_name', {initialValue: maintain_part.part_name})}/>
        <Input type="hidden" {...getFieldProps('part_spec', {initialValue: maintain_part.part_spec})}/>
        <Input type="hidden" {...getFieldProps('part_unit', {initialValue: maintain_part.part_unit})}/>
        <Input type="hidden" {...getFieldProps('scope', {initialValue: maintain_part.scope})}/>
        <Input type="hidden" {...getFieldProps('maintain_type', {initialValue: maintain_part.maintain_type})}/>
        <Input type="hidden" {...getFieldProps('maintain_type_name', {initialValue: maintain_part.maintain_type_name})}/>
        {/*
        <Input type="hidden" {...getFieldProps('level_name', {initialValue: maintain_part.level_name})}/>
        */}

        <Row>
          <Col sm={7}>
            <FormItem label='配件分类' {...formItemLayout} labelCol={{ span: 6 }} wrapperCol={{ span: 17 }} required>
              <MaintainPartTypeSearchBox
                value={maintain_part.part_type_name}
                data={part_type_data}
                select={this.handlePartTypeSelect.bind(this)}
                style={{width: '100%'}}
              />
            </FormItem>
          </Col>
          <Col sm={7}>
            <FormItem label="分类档次" {...formItemLayout} labelCol={{ span: 6 }} wrapperCol={{ span: 17 }}>
              <Select
                {...getFieldProps('level_name', {initialValue: maintain_part.level_name})}
                size="large"
                filterOption={false}
                onSelect={this.handleLevelSelect.bind(this)}
                disabled={!maintain_part.levels}
                optionFilterProp="children"
                placeholder="请选择档次">
                {maintain_part.levels && maintain_part.levels.map(part =><Option key={part.name}>{part.name}</Option>)}
              </Select>
            </FormItem>
          </Col>

          <Col sm={5}>
            <FormItem label="配件单价" {...formItemLayout} labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
              <Input type="number" {...getFieldProps('material_fee_base', {initialValue: maintain_part.material_fee_base})} disabled={maintain_part.levels && maintain_part.levels.length > 0} onChange={this.handleMaterialFeeBaseChange.bind(this)} min={0} step={0.01} placeholder="配件单价" addonAfter="元" />
            </FormItem>
          </Col>

          <Col sm={5}>
            <FormItem label="计费数量" {...formItemLayout} labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
              <Input type="number" {...getFieldProps('count', {initialValue: maintain_part.count})} disabled={!!maintain_part._id} onChange={this.handleMaterialCountChange.bind(this)} min={1} step={1} placeholder="客户显示数量" />
            </FormItem>
          </Col>

        </Row>

        <Row>
          <Col sm={7}>
            <FormItem label="配件名称" {...formItemLayout} labelCol={{ span: 6 }} wrapperCol={{ span: 17 }} required>
              <PartSearchBox 
                value={maintain_part.part_name ? maintain_part.part_name + ' ' + maintain_part.scope : ''}
                data={part_data}
                part_type_id={maintain_part.part_type_id} 
                select={this.handlePartSelect.bind(this)} 
              />
            </FormItem>
          </Col>

          <Col sm={7}>
            <FormItem label="领料数量" {...formItemLayout} labelCol={{ span: 6 }} wrapperCol={{ span: 17 }} required>
              <Input type="number" {...getFieldProps('real_count', {initialValue: maintain_part.real_count ? maintain_part.real_count : maintain_part.count})} onChange={this.handleRealCountChange.bind(this)} min={1} step={1} placeholder="实际使用数量" />
            </FormItem>
          </Col>

          <Col sm={5}>
            <FormItem label="剩余库存" {...formItemLayout} labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
              <Input type="number" {...getFieldProps('remain_count', {initialValue: maintain_part.real_count ? maintain_part.part_amount - maintain_part.real_count : maintain_part.part_amount - maintain_part.count})} disabled={true}/>
            </FormItem>
          </Col>

          <Col sm={5}>
            <FormItem label="材料费：" className="no-margin-bottom" labelCol={{span: 8}} wrapperCol={{span: 14}}>
              <span className="ant-input-wrapper ant-input-group">
                <Input
                  {...getFieldProps('material_fee', {initialValue: maintain_part.material_fee})}
                  type="number"
                  disabled={true}
                  className="ant-input ant-input-lg"
                  min={0}
                  placeholder="材料费"
                  addonAfter="元"
                />
              </span>
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

AddEditMaintainPartForm = Form.create()(AddEditMaintainPartForm);
export default AddEditMaintainPartForm
