import React from 'react';
import {message, Modal, Icon, Button, Form, Input, Select} from 'antd';

import BaseModal from '../../../components/base/BaseModal';
import SearchSelectBox from '../../../components/base/SearchSelectBox';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';
import FormValidator from '../../../utils/FormValidator';

const FormItem = Form.Item;
const Option = Select.Option;

class NewPart extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      types: [],
      partCategories: [],
    };
    [
      'handleNewPart',
      'handleSubmit',
      'handleSearch',
      'handleSearchSelect',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleNewPart() {
    this.getMaintainItemTypes();
    this.showModal();
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.warning('请完善表单信息');
        return;
      }

      let {part_type} = this.state;
      if (!part_type) {
        message.warning('请选择配件分类');
        return;
      }

      values.part_type = part_type;

      api.ajax({
        url: api.warehouse.part.add(),
        type: 'POST',
        data: values,
      }, () => {
        message.info('添加成功！');
        this.props.onSuccess();
        this.props.form.resetFields();
        this.hideModal();
      });
    });
  }

  handleSearch(key, successHandle, failHandle) {
    let url = api.warehouse.category.search(key);
    api.ajax({url}, (data) => {
      successHandle(data.res.list);
      this.setState({partCategories: data.res.list});
    }, (error) => {
      failHandle(error);
      this.setState({partCategories: []});
    });
  }

  handleSearchSelect(data) {
    this.setState({part_type: data._id});
  }

  getMaintainItemTypes() {
    api.ajax({url: api.getMaintainItemTypes()}, data => {
      this.setState({types: data.res.type_list});
    });
  }

  render() {
    const {visible}=this.state;
    const {formItemLayout, selectStyle} = Layout;
    const {getFieldDecorator} = this.props.form;

    return (
      <span>
        <Button
          type="primary"
          className="mr15"
          onClick={this.handleNewPart}
        >
          添加配件
        </Button>

        <Modal
          title={<span><Icon type="plus"/> 添加配件</span>}
          visible={visible}
          onCancel={this.hideModal}
          onOk={this.handleSubmit}
        >
          <Form horizontal>
            <FormItem label="配件名称" {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: this.props.inputValue,
                rules: FormValidator.getRulePartName(),
                validateTrigger: 'onBlur',
              })(
                <Input placeholder="请输入配件名称"/>
              )}
            </FormItem>

            <FormItem label="适用车型" {...formItemLayout}>
              {getFieldDecorator('scope')(
                <Input placeholder="请输入适用车型"/>
              )}
            </FormItem>

            <FormItem label="配件品牌" {...formItemLayout}>
              {getFieldDecorator('brand')(
                <Input placeholder="请输入配件品牌"/>
              )}
            </FormItem>

            <FormItem label="配件号" {...formItemLayout}>
              {getFieldDecorator('part_no', {
                rules: FormValidator.getRulePartNo(),
                validateTrigger: 'onBlur',
              })(
                <Input placeholder="请输入配件号"/>
              )}
            </FormItem>

            <FormItem label="产值类型" {...formItemLayout}>
              {getFieldDecorator('maintain_type', {
                rules: FormValidator.getRuleNotNull(),
                validateTrigger: 'onBlur',
              })(
                <Select{...selectStyle} placeholder="请选择产值类型">
                  {this.state.types.map(type => <Option key={type._id}>{type.name}</Option>)}
                </Select>
              )}
            </FormItem>

            <FormItem label="配件分类" {...formItemLayout} required>
              <SearchSelectBox
                placeholder={'请输入分类名称搜索'}
                onSearch={this.handleSearch}
                autoSearchLength={1}
                onSelectItem={this.handleSearchSelect}
              />
            </FormItem>

            <FormItem label="规格" {...formItemLayout}>
              {getFieldDecorator('spec')(
                <Input addonAfter={
                  getFieldDecorator('unit', {initialValue: '个'})(
                    <Select style={{width: 45}}>
                      <Option value="个">个</Option>
                      <Option value="升">升</Option>
                      <Option value="瓶">瓶</Option>
                      <Option value="件">件</Option>
                      <Option value="副">副</Option>
                      <Option value="根">根</Option>
                    </Select>
                  )
                } placeholder="请输入规格"/>
              )}
            </FormItem>

            <FormItem label="备注" {...formItemLayout}>
              {getFieldDecorator('remark')(
                <Input type="textarea" placeholder="请输入备注"/>
              )}
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

NewPart = Form.create()(NewPart);
export default NewPart;
