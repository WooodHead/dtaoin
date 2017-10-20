import React from 'react';
import { message, Modal, Icon, Button, Form, Input, Select, Row, Col } from 'antd';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';
import FormValidator from '../../../utils/FormValidator';

import BaseModal from '../../../components/base/BaseModal';

import Type from './Type';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

class NewPart extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      types: [],
      partId: '',
      partCategories: [],
    };

    [
      'handleNewPart',
      'handleSearch',
      'handleSearchSelect',
      'handleSubmit',
      'handleChoosePartType',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleNewPart() {
    this.getMaintainItemTypes();
    this.showModal();
    // this.props.hideModal();
  }

  handleSearch(key, successHandle, failHandle) {
    if (!!key) {
      api.ajax({ url: api.warehouse.category.search(key) }, data => {
        successHandle(data.res.list);
        this.setState({ partCategories: data.res.list });
      }, error => {
        failHandle(error);
        this.setState({ partCategories: [] });
      });
    } else {
      // failHandle('请输入搜索内容');
    }
  }

  handleSearchSelect(data) {
    this.setState({ part_type: data._id });
  }

  handleChoosePartType(pid) {
    this.setState({ partId: pid });
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.warning('请完善表单信息');
        return;
      }

      const { partId } = this.state;
      if (!partId) {
        message.warning('请选择配件分类');
        return;
      }

      values.part_type = partId;
      values.markup_rate = Number(values.markup_rate) / 100;

      api.ajax({
        url: api.warehouse.part.add(),
        type: 'POST',
        data: values,
      }, data => {
        message.success('添加成功！');
        this.props.onSuccess(data.res.auto_part);
        this.props.form.resetFields();
        this.hideModal();
      });
    });
  }

  hideModal() {
    this.setState({ visible: false });
    this.props.form.resetFields();
  }

  getMaintainItemTypes() {
    api.ajax({ url: api.aftersales.getMaintainItemTypes() }, data => {
      this.setState({ types: data.res.type_list });
    });
  }

  render() {
    const { formItemLayout, formItemLayoutHalf } = Layout;
    const { getFieldDecorator } = this.props.form;
    const { visible } = this.state;

    return (
      <span>
        <Button type="primary" onClick={this.handleNewPart}>创建配件</Button>
        <Modal
          title={<span><Icon type="plus" /> 创建配件</span>}
          visible={visible}
          onCancel={this.hideModal}
          onOk={this.handleSubmit}
          width={720}
          style={{ zIndex: '9999' }}
        >
          <Form>
            <Row>
              <Col span={12}>
                <FormItem label="配件名称" {...formItemLayout}>
                  {getFieldDecorator('name', {
                    initialValue: this.props.inputValue,
                    rules: FormValidator.getRulePartName(),
                    validateTrigger: 'onBlur',
                  })(
                    <Input placeholder="请输入配件名称" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="配件号" {...formItemLayout}>
                  {getFieldDecorator('part_no', {
                    rules: FormValidator.getRulePartNo(),
                    validateTrigger: 'onBlur',
                  })(
                    <Input placeholder="请输入配件号" />,
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem label="规格" {...formItemLayout}>
                  {getFieldDecorator('spec', { initialValue: '1' })(
                    <Input addonAfter={
                      getFieldDecorator('unit', { initialValue: '个' })(
                        <Select style={{ width: 45 }}>
                          <Option value="个">个</Option>
                          <Option value="升">升</Option>
                          <Option value="瓶">瓶</Option>
                          <Option value="件">件</Option>
                          <Option value="副">副</Option>
                          <Option value="根">根</Option>
                          <Option value="条">条</Option>
                        </Select>,
                      )
                    } placeholder="请输入规格" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="配件品牌" {...formItemLayout}>
                  {getFieldDecorator('brand')(
                    <Input placeholder="请输入配件品牌" />,
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem label="适用车型" {...formItemLayout}>
                  {getFieldDecorator('scope')(
                    <Input placeholder="请输入适用车型" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="配件分类" {...formItemLayout} required>
                  <Type onSuccess={this.handleChoosePartType} />
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem label="安全库存" {...formItemLayout}>
                  {getFieldDecorator('min_amount')(
                    <Input placeholder="请输入安全库存" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="加价率" {...formItemLayout}>
                  {getFieldDecorator('markup_rate')(
                    <Input
                      placeholder="请输入加价率"
                      addonAfter="%"
                      style={{ width: '200px' }}
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem label="备注" {...formItemLayoutHalf}>
                  {getFieldDecorator('remark', {
                    initialValue: '',
                  })(
                    <TextArea placeholder="请输入备注" />,
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </span>
    );
  }
}

NewPart = Form.create()(NewPart);
export default NewPart;
