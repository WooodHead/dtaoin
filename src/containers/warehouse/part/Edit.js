import React from 'react';
import { message, Modal, Icon, Button, Form, Input, Select, Row, Col } from 'antd';

import BaseModal from '../../../components/base/BaseModal';
import Type from './Type';

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
      partTypeId: '',
      partCategories: [],
    };

    [
      'editPart',
      'handleSubmit',
      'handleSearch',
      'handleSearchSelect',
      'handleChoosePartType',
    ].map(method => this[method] = this[method].bind(this));
  }

  editPart() {
    const { part } = this.props;

    this.getMaintainItemTypes();
    this.setState({
      visible: true,
      part,
      partTypeId: part.part_type,
      part_type_name: part.part_type_name,
    });
  }

  handleChoosePartType(pid) {
    this.setState({ partTypeId: pid });
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.warning('请完善表单信息');
        return;
      }

      const { partTypeId } = this.state;
      if (!partTypeId) {
        message.warning('请选择配件分类');
        return;
      }

      values.part_type = partTypeId;
      values.markup_rate = Number(values.markup_rate) / 100;

      api.ajax({
        url: api.warehouse.part.edit(),
        type: 'POST',
        data: values,
      }, data => {
        message.success('编辑成功！');
        this.hideModal();
        this.props.onSuccess(data.res.auto_part);
      });
    });
  }

  handleSearch(key, successHandle, failHandle) {
    if (!!key) {
      const url = api.warehouse.category.search(key);
      api.ajax({ url }, data => {
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

  getMaintainItemTypes() {
    api.ajax({ url: api.aftersales.getMaintainItemTypes() }, data => {
      this.setState({ types: data.res.type_list });
    });
  }

  render() {
    const { visible } = this.state;
    const { formItemLayout, formItemLayoutHalf } = Layout;
    const { getFieldDecorator } = this.props.form;
    const { part, type } = this.props;

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
          width={720}
        >
          <Form>
            {getFieldDecorator('_id', { initialValue: part._id })(
              <Input type="hidden"/>
            )}
            <Row>
              <Col span={12}>
                <FormItem label="配件名称" {...formItemLayout}>
                  {getFieldDecorator('name', {
                    initialValue: part.name,
                    rules: FormValidator.getRulePartName(),
                    validateTrigger: 'onBlur',
                  })(
                    <Input placeholder="请输入配件名称"/>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="配件号" {...formItemLayout}>
                  {getFieldDecorator('part_no', {
                    initialValue: part.part_no,
                    rules: FormValidator.getRulePartNo(),
                    validateTrigger: 'onBlur',
                  })(
                    <Input placeholder="请输入配件号"/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem label="规格" {...formItemLayout}>
                  {getFieldDecorator('spec', { initialValue: part.spec })(
                    <Input addonAfter={
                      getFieldDecorator('unit', { initialValue: part.unit })(
                        <Select style={{ width: 45 }}>
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
              </Col>
              <Col span={12}>
                <FormItem label="配件品牌" {...formItemLayout}>
                  {getFieldDecorator('brand', { initialValue: part.brand })(
                    <Input placeholder="请输入配件品牌"/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem label="适用车型" {...formItemLayout}>
                  {getFieldDecorator('scope', { initialValue: part.scope })(
                    <Input placeholder="请输入适用车型"/>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="配件分类" {...formItemLayout} required>
                  <Type
                    defaultValue={part.part_type_name}
                    onSuccess={this.handleChoosePartType}
                    size="small"
                  />
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem label="安全库存" {...formItemLayout}>
                  {getFieldDecorator('min_amount', { initialValue: part.min_amount })(
                    <Input placeholder="请输入适用车型"/>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="加价率" {...formItemLayout}>
                  {getFieldDecorator('markup_rate', { initialValue: !!part.markup_rate ? Number(part.markup_rate) * 100 : '0' })(
                    <Input
                      placeholder="请输入加价率"
                      addonAfter="%"
                      style={{ width: '200px' }}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem label="备注" {...formItemLayoutHalf}>
                  {getFieldDecorator('remark', { initialValue: part.remark })(
                    <Input type="textarea" placeholder="请输入备注"/>
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

Edit = Form.create()(Edit);
export default Edit;
