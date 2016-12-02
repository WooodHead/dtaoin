import React, {Component} from 'react'
import {message, Form, Input, Select, Radio, Button, DatePicker, InputNumber, Tag, Row, Col} from 'antd'
import Qiniu from '../../../middleware/UploadQiniu'
import api from '../../../middleware/api'
import formatter from '../../../middleware/formatter'
import Layout from '../Layout'
import UploadComponent from '../../base/BaseUpload'
import validator from '../../../middleware/validator'
import NewPartSupplierModal from '../../modals/warehouse/supplier/NewPartSupplierModal'

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class StockAutoPartForm extends UploadComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      supplier_list: [],
      supplier_id: '',
    };
    [
      'handleSearchChange',
      'updateState',
      'handleFocusBlur'
    ].map((method) => this[method] = this[method].bind(this));
  }

  componentWillMount() {
    this.setState({part_id: this.props.part._id, part: this.props.part});

    this.getPartSupplierList();
    this.getPartDetail(this.props.part._id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
      this.setState({part_id: this.props.part._id, part: this.props.part});

      this.getPartSupplierList();
      this.getPartDetail(this.props.part._id);
    }
  }

  initForm() {
    this.props.form.resetFields();
    this.setState({
      supplier_id: ''
    });
  }

  clearForm() {
    this.props.form.resetFields();
    this.setState({
      supplier_id: ''
    });
  }

  getPartDetail(part_id) {
    api.ajax({url: api.warehouse.getPart(part_id)}, function (data) {
      this.setState({part: data.res.detail});
    }.bind(this))
  }

  getPartSupplierList() {
    api.ajax({url: api.getPartsSupplierList()}, function (data) {
      this.setState({supplier_list: data.res.list});
    }.bind(this))
  }

  handleSearchChange(key) {
    this.setState({searchValue: key});

    if (key == '') {
      this.clearForm();
    }
    if (key) {
      if (validator.enNum(key) && (key.length < 4 )) {
        return;
      }

      if (!validator.enNum(key) && key.length < 2) {
        return;
      }

      this.searchByKey(key);
    }
  }

  setFormFieldValue(name, value) {
    this.props.form.setFieldValue({
      name: value
    })
  }

  updateState(obj) {
    this.setState(obj);
  }

  handleFocusBlur(e) {
    this.setState({
      focus: e.target === document.activeElement
    });
  }

  handlePreview(e) {
    e.preventDefault();
    let formData = this.props.form.getFieldsValue();
    if (!formData.amount || !formData.in_price || !formData.supplier_id) {
      message.warning('请完善表格');
      return;
    }

    this.props.onSuccess({
      currentStep: 1,
      visibility_form_part: 'hide',
      visibility_form_preview: '',
      formData: formData
    });
  }

  render() {
    let {formItemLayout, buttonLayout, selectStyle} = Layout;
    let {getFieldProps, getFieldValue} = this.props.form;
    let {part}=this.state;
    let {
      searchValue,
      supplier_list,
      supplier_id
    }=this.state;

    return (
      <Form horizontal>
        <Input type="hidden" {...getFieldProps('part_id', {initialValue: part._id})}/>

        <Row>
          <Col sm={8}>
            <FormItem label="配件名" {...formItemLayout} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} >
              <p className="ant-form-text" id="name" name="name">{part.name}</p>
            </FormItem>
          </Col>

          <Col sm={8}>
            <FormItem label="适用车型" {...formItemLayout} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
              <p className="ant-form-text" id="scope" name="scope">{part.scope}</p>
            </FormItem>
          </Col>

          <Col sm={8}>
            <FormItem label="配件品牌" {...formItemLayout} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
              <p className="ant-form-text" id="brand" name="brand">{part.brand}</p>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col sm={8}>
            <FormItem label="配件号" {...formItemLayout} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
              <p className="ant-form-text" id="part_no" name="part_nod">{part.part_no}</p>
            </FormItem>
          </Col>

          <Col sm={8}>
            <FormItem label="产值类型" {...formItemLayout} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
              <p className="ant-form-text" id="maintain_type_name" name="maintain_type_name">{part.maintain_type_name}</p>
            </FormItem>
          </Col>

          <Col sm={8}>
            <FormItem label="配件分类" {...formItemLayout} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
              <p className="ant-form-text" id="part_type_name" name="part_type_name">{part.part_type_name}</p>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col sm={8}>
            <FormItem label="配件规格" {...formItemLayout} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
              <p className="ant-form-text" id="spec_unit" name="spec_unit">{part.spec}{part.unit}</p>
            </FormItem>
          </Col>
        </Row>

        <FormItem label='供应商' {...formItemLayout} required>
          <Select
            {...getFieldProps('supplier_id', {initialValue: supplier_id})}
            size="large"
            style={{width: '70%'}}
            showSearch
            optionFilterProp="children"
            placeholder="请选择供应商">
            {supplier_list.map(item =><Option key={item._id}>{item.supplier_company}</Option>)}
          </Select>

          <NewPartSupplierModal
            updateState={this.updateState.bind(this)}
            getPartSupplierList={this.getPartSupplierList.bind(this)}
          />
        </FormItem>

        <FormItem label="进货数量" {...formItemLayout} required>
          <Input
            type="number"
            {...getFieldProps('amount')}
            min={0}
            addonAfter="个" placeholder="请输入进货数量"/>
          <span className="ant-form-text">进货后库存数：{(Number(part.amount) || 0) + (Number(getFieldValue('amount')) || 0)}个</span>
        </FormItem>

        <FormItem label="进货价" {...formItemLayout} required>
          <Input
            type="number"
            {...getFieldProps('in_price')}
            min={0}
            step={0.01}
            addonAfter="元"
            placeholder="请输入进货价"
          />
        </FormItem>

        <FormItem label="付款方式" {...formItemLayout} required>
          <RadioGroup {...getFieldProps('pay_type', {initialValue: 0})}>
            <Radio value={0}>挂账</Radio>
            <Radio value={1}>现金</Radio>
          </RadioGroup>
          <span>小计：{Number(getFieldValue('amount')) && Number(getFieldValue('in_price')) ? (getFieldValue('amount') * getFieldValue('in_price')).toFixed(2) : 0}元</span>
        </FormItem>

        <FormItem label="备注" {...formItemLayout}>
          <Input type="textarea"{...getFieldProps('remark')}/>
        </FormItem>

        <FormItem {...buttonLayout}>
          <Button type="ghost" className="mr15" onClick={this.props.cancelModal}>取消</Button>
          <Button type="primary" onClick={this.handlePreview.bind(this)}>预览</Button>
        </FormItem>
      </Form>
    )
  }
}

StockAutoPartForm = Form.create()(StockAutoPartForm);
export default StockAutoPartForm
