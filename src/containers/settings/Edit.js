import React from 'react';
import {Button, Modal, Input, Form, Select} from 'antd';

import BaseModal from '../../components/base/BaseModal';
import Layout from '../../utils/FormLayout';

import api from '../../middleware/api';

const FormItem = Form.Item;
const Option = Select.Option;

class Edit extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };

    [
      'handleEdit',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleEdit() {
    let formData = this.props.form.getFieldsValue();

    api.ajax({
      url: this.props.isNew ? api.authority.create() : api.authority.edit(),
      type: 'POST',
      data: formData,
    }, data => {
      this.props.onSuccess(data.res.detail);
      this.hideModal();
    });
  }

  render() {
    let {visible} = this.state;
    let {value, isNew, type} = this.props;
    const {getFieldDecorator} = this.props.form;
    const {formItemLayout, selectStyle} = Layout;

    let title = isNew ? '添加' : '编辑';

    return (
      <span>
        {type === 'button' ?
          <Button type="primary" onClick={this.showModal}>{title}</Button> :
          <a href="javascript:;" onClick={this.showModal}>{title}</a>
        }

        <Modal
          visible={visible}
          title={title}
          onCancel={this.hideModal}
          onOk={this.handleEdit}
          width="720px"
        >
          <Form>
            {getFieldDecorator('auth_item_id', {initialValue: value._id})(
              <Input type="hidden"/>
            )}
            {getFieldDecorator('parent_id', {initialValue: value.parent_id})(
              <Input type="hidden"/>
            )}

            <FormItem label="名称" {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: value.name,
              })(
                <Input />
              )}
            </FormItem>

            <FormItem label="类型" {...formItemLayout}>
              {getFieldDecorator('type', {
                initialValue: value.type || '0',
              })(
                <Select {...selectStyle}>
                  <Option value="0">路由</Option>
                  <Option value="1">模态框</Option>
                  <Option value="2">授权</Option>
                </Select>
              )}
            </FormItem>

            <FormItem label="路由" {...formItemLayout}>
              {getFieldDecorator('path', {
                initialValue: value.path,
              })(
                <Input />
              )}
            </FormItem>

            <FormItem label="备注" {...formItemLayout}>
              {getFieldDecorator('remark', {
                initialValue: value.remark,
              })(
                <Input />
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
