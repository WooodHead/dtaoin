import React from 'react';
import {message, Modal, Icon, Button, Form, Input, Select} from 'antd';

import BaseModal from '../../../components/base/BaseModal';
import SearchSelectBox from '../../../components/widget/SearchSelectBox';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';
import FormValidator from '../../../utils/FormValidator';

const FormItem = Form.Item;
const Option = Select.Option;

class Edit extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      types: [],
      partCategories: [],
    };

    [
      'editPart',
      'handleSubmit',
      'handleSearch',
      'handleSearchSelect',
    ].map(method => this[method] = this[method].bind(this));
  }

  editPart() {
    let {part} = this.props;

    this.getMaintainItemTypes();
    this.setState({
      visible: true,
      part,
      part_type: part.part_type,
      part_type_name: part.part_type_name,
    });
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.warning('请完善表单信息');
        return;
      }

      values.part_type = this.state.part_type;

      api.ajax({
        url: api.warehouse.part.edit(),
        type: 'POST',
        data: values,
      }, () => {
        message.success('编辑成功！');
        this.hideModal();
        this.props.onSuccess();
      });
    });
  }

  handleSearch(key, successHandle, failHandle) {
    if (!!key) {
      let url = api.warehouse.category.search(key);
      api.ajax({url}, (data) => {
        successHandle(data.res.list);
        this.setState({partCategories: data.res.list});
      }, (error) => {
        failHandle(error);
        this.setState({partCategories: []});
      });
    } else {
      // failHandle('请输入搜索内容');
    }
  }

  handleSearchSelect(data) {
    this.setState({part_type: data._id});
  }

  getMaintainItemTypes() {
    api.ajax({url: api.aftersales.getMaintainItemTypes()}, data => {
      this.setState({types: data.res.type_list});
    });
  }

  render() {
    const {visible, part_type_name}=this.state;
    const {formItemLayout, selectStyle} = Layout;
    const {getFieldDecorator} = this.props.form;
    const {part, type} = this.props;

    return (
      <span>
        {type ?
          <Button type="primary" onClick={this.editPart}>编辑</Button> :
          <a href="javascript:;" onClick={this.editPart}>编辑</a>
        }

        <Modal
          title={<span><Icon type="edit"/> 编辑配件</span>}
          visible={visible}
          onCancel={this.hideModal}
          onOk={this.handleSubmit}
        >
          <Form>
            {getFieldDecorator('_id', {initialValue: part._id})(
              <Input type="hidden"/>
            )}

            <FormItem label="配件名称" {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: part.name,
                rules: FormValidator.getRulePartName(),
                validateTrigger: 'onBlur',
              })(
                <Input placeholder="请输入配件名称"/>
              )}
            </FormItem>

            <FormItem label="适用车型" {...formItemLayout}>
              {getFieldDecorator('scope', {initialValue: part.scope})(
                <Input placeholder="请输入适用车型"/>
              )}
            </FormItem>

            <FormItem label="配件品牌" {...formItemLayout}>
              {getFieldDecorator('brand', {initialValue: part.brand})(
                <Input placeholder="请输入配件品牌"/>
              )}
            </FormItem>

            <FormItem label="配件号" {...formItemLayout}>
              {getFieldDecorator('part_no', {
                initialValue: part.part_no,
                rules: FormValidator.getRulePartNo(),
                validateTrigger: 'onBlur',
              })(
                <Input placeholder="请输入配件号"/>
              )}
            </FormItem>

            <FormItem label="产值类型" {...formItemLayout} required>
              {getFieldDecorator('maintain_type', {initialValue: part.maintain_type})(
                <Select{...selectStyle} placeholder="请选择产值类型">
                  {this.state.types.map(type => <Option key={type._id}>{type.name}</Option>)}
                </Select>
              )}
            </FormItem>

            <FormItem label="配件分类" {...formItemLayout} required>
              <SearchSelectBox
                defaultKey={part_type_name}
                placeholder={'请输入分类名称搜索'}
                onSearch={this.handleSearch}
                autoSearchLength={1}
                onSelectItem={this.handleSearchSelect}
              />
            </FormItem>

            <FormItem label="规格" {...formItemLayout}>
              {getFieldDecorator('spec', {initialValue: part.spec})(
                <Input addonAfter={
                  getFieldDecorator('unit', {initialValue: part.unit})(
                    <Select style={{width: 45}}>
                      <Option value="个">个</Option>
                      <Option value="升">升</Option>
                      <Option value="瓶">瓶</Option>
                      <Option value="件">件</Option>
                      <Option value="副">副</Option>
                      <Option value="根">根</Option>
                      <Option value="条">条</Option>
                    </Select>
                  )
                } placeholder="请输入规格"/>
              )}
            </FormItem>

            <FormItem label="备注" {...formItemLayout}>
              {getFieldDecorator('remark', {initialValue: part.remark})(
                <Input type="textarea" placeholder="请输入备注"/>
              )}
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

Edit = Form.create()(Edit);
export default Edit;
