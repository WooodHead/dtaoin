import React from 'react'
import {Row, Col, message, Modal, Icon, Button, Form, Input, Select} from 'antd'
import api from '../../../../middleware/api'
import BaseModal from '../../../base/BaseModal'
import SearchOneBox from '../../../search/SearchOneBox'
import Layout from '../../../forms/Layout'
import validator from '../../../../middleware/validator'
import formatter from '../../../../middleware/formatter'
import FormValidator from '../../../../components/forms/FormValidator'

const FormItem = Form.Item;
const Option = Select.Option;

class EditPart extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      part_type: this.props.part.part_type,
      part_type_name: this.props.part.part_type_name,
      types: [],
      partCategories: [],
    };
    [
      'editPart',
      'handleSubmit',
      'handleSearchChange',
      'handleSearchSelect',
    ].map(method => this[method] = this[method].bind(this));
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  editPart() {
    this.getMaintainItemTypes();
    this.showModal();
  }

  handleSubmit() {
    let formData = this.props.form.getFieldsValue();
    formData.part_type = this.state.part_type;

    api.ajax({
      url: api.warehouse.editPart(),
      type: "POST",
      data: formData
    }, (data) => {
      message.info('编辑成功！');
      this.hideModal();
      location.reload();
    })
  }

  handleSearchChange(key) {
    api.ajax({url: api.warehouse.searchCategory(key)}, data => {
      this.setState({partCategories: data.res.list})
    })
  }
  handleSearchSelect(data) {
    this.setState({part_type: data._id});
  }

  getMaintainItemTypes() {
    api.ajax({url: api.getMaintainItemTypes()}, data => {
      this.setState({types: data.res.type_list});
    })
  }

  render() {
    const {visible}=this.state;
    const {formItemLayout, selectStyle} = Layout;
    const {getFieldProps} = this.props.form;
    const {part} = this.props;

    const partNameProps = getFieldProps('name', {
      initialValue: part.name,
      validate: [{
        rules: [{validator: FormValidator.validatePartName}],
        trigger: ['onBlur', 'onChange']
      }, {
        rules: [{required: true, message: validator.required.partName}],
        trigger: ['onBlur', 'onChange']
      }]
    });

    const partNoProps = getFieldProps('part_no', {
      initialValue: part.part_no,
      validate: [{
        rules: [{validator: FormValidator.validatePartNo}],
        trigger: ['onBlur', 'onChange']
      }, {
        rules: [{message: validator.required.partNo}],
        trigger: ['onBlur', 'onChange']
      }]
    });

    const selectAfter = (
      <Select style={{ width: 70 }} {...getFieldProps('unit', {initialValue: part.unit})}>
        <Option value="个">个</Option>
        <Option value="升">升</Option>
        <Option value="瓶">瓶</Option>
        <Option value="件">件</Option>
        <Option value="副">副</Option>
        <Option value="根">根</Option>
      </Select>
    );

    return (
      <span>
        <Button
          type="primary"
          size={this.props.size ? this.props.size : 'default'}
          className="mr5"
          onClick={this.editPart}>
          编辑
        </Button>

        <Modal
          title={<span><Icon type="plus"/> 编辑配件</span>}
          visible={visible}
          onCancel={this.hideModal}
          onOk={this.handleSubmit}>

          <Form horizontal>
            <Input type="hidden" {...getFieldProps('_id', {initialValue: part._id})} />

            <FormItem label='配件名称' {...formItemLayout}>
              <Input {...partNameProps} placeholder="请输入配件名称"/>
            </FormItem>

            <FormItem label='适用车型' {...formItemLayout}>
              <Input {...getFieldProps('scope', {initialValue: part.scope})} placeholder="请输入适用车型"/>
            </FormItem>

            <FormItem label='配件品牌' {...formItemLayout}>
              <Input {...getFieldProps('brand', {initialValue: part.brand})} placeholder="请输入配件品牌"/>
            </FormItem>

            <FormItem label='配件号' {...formItemLayout}>
              <Input {...partNoProps} placeholder="请输入配件号"/>
            </FormItem>

            <FormItem label='产值类型' {...formItemLayout} required>
              <Select
                {...getFieldProps('maintain_type', {initialValue: part.maintain_type})}
                {...selectStyle}
                placeholder="请选择产值类型">
                {this.state.types.map(type => <Option key={type._id}>{type.name}</Option>)}
              </Select>
            </FormItem>

            <FormItem label='配件分类' {...formItemLayout} required>
              <SearchOneBox
                value={this.state.part_type_name}
                data={this.state.partCategories}
                change={this.handleSearchChange}
                select={this.handleSearchSelect}
                placeholser="请输入分类名称搜索"
              />
            </FormItem>

            <FormItem label='规格' {...formItemLayout}>
              <Row gutter={6}>
                <Col>
                  <Input {...getFieldProps('spec', {initialValue: part.spec})} size="large" placeholder="请输入规格" addonAfter={selectAfter}/>
                </Col>
              </Row>
            </FormItem>

            <FormItem label="备注" {...formItemLayout}>
              <Input type="textarea"{...getFieldProps('remark', {initialValue: part.remark})} placeholder="请输入备注"/>
            </FormItem>
          </Form>
        </Modal>
      </span>
    )
  }
}

EditPart = Form.create()(EditPart);
export default EditPart
