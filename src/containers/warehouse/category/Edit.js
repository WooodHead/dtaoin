import React from 'react';
import {Row, Col, Modal, Icon, Button, Form, Input, Radio} from 'antd';
import classNames from 'classnames';

import BaseModal from '../../../components/base/BaseModal';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';
import FormValidator from '../../../utils/FormValidator';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class Edit extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      itemLevelIndex: this.props.category.levels.length,
      quoteType: this.props.category.quote_type,
    };
    [
      'addItemLevel',
      'handleSubmit',
      'handleRadioChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  addItemLevel() {
    const {form} = this.props;

    let keys = form.getFieldValue('keys');
    keys = keys.concat(this.state.itemLevelIndex);
    form.setFieldsValue({keys});

    this.setState({itemLevelIndex: this.state.itemLevelIndex + 1});
  }

  deleteItemLevel(key) {
    const {form} = this.props;

    let keys = form.getFieldValue('keys');
    if (keys.length > 1) {
      keys.splice(keys.indexOf(key), 1);

      form.setFieldsValue({keys});

      this.setState({itemLevelIndex: this.state.itemLevelIndex - 1});
    }
  }

  handleSubmit() {
    let formData = this.props.form.getFieldsValue();
    if (this.state.quoteType == 1) {
      let levels = [];
      for (let i = 0; i <= this.state.itemLevelIndex; i++) {
        let nameProp = `name_${i}`,
          priceProp = `price_${i}`;

        if (formData[nameProp]) {
          let level = {
            name: formData[nameProp],
            price: formData[priceProp],
          };
          levels.push(level);
        }

        delete formData[nameProp];
        delete formData[priceProp];
      }
      formData.levels = JSON.stringify(levels);
    }
    delete formData.keys;

    api.ajax({
      url: api.warehouse.category.edit(),
      type: 'POST',
      data: formData,
    }, () => {
      this.hideModal();
      this.props.form.resetFields();
      location.reload();
    });
  }

  handleRadioChange(e) {
    this.setState({quoteType: e.target.value});
  }

  render() {
    const {formItemLayout} = Layout;
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const {visible} = this.state;
    const {category} = this.props;
    let categoryLevels;
    try {
      categoryLevels = JSON.parse(category.levels);
    } catch (e) {
      categoryLevels = [{'name': '', 'price': ''}];
    }

    let initKeys = [];
    for (let i = 0; i < categoryLevels.length; i++) {
      initKeys.push(i);
    }

    getFieldDecorator('keys', {
      initialValue: initKeys,
    });

    let keys = getFieldValue('keys');

    const itemLevelElements = getFieldValue('keys').map((k) => {
      return (
        <Row key={k}>
          <Col span={12}>
            <FormItem label={`配件档次${k + 1}`} labelCol={{span: 12}} wrapperCol={{span: 12}}>
              {getFieldDecorator(`name_${k}`, {initialValue: (k >= categoryLevels.length) ? '' : categoryLevels[k].name})(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col span={9}>
            <FormItem label="报价" labelCol={{span: 8}} wrapperCol={{span: 14}}>
              {getFieldDecorator(`price_${k}`, {initialValue: (k >= categoryLevels.length) ? '' : categoryLevels[k].price})(
                <Input
                  type="number"
                  addonAfter="元"
                  min={0}
                  placeholder="请输入报价"
                />
              )}
            </FormItem>
          </Col>
          <Col span={3}>
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              disabled={keys.length === 1}
              onClick={this.deleteItemLevel.bind(this, k)}
            />
          </Col>
        </Row>
      );
    });

    const itemLevelContainer = classNames({
      'hide': this.state.quoteType == 0,
    });

    return (
      <span>
        <Button
          type="primary"
          size="small"
          disabled={this.props.disabled}
          className="margin-left-20"
          onClick={this.showModal}
        >
          编辑
        </Button>

        <Modal
          title={<span><Icon type="plus" className="margin-right-10"/>编辑分类</span>}
          visible={visible}
          width="680px"
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
        >

          <Form horizontal>
            {getFieldDecorator('_id', {initialValue: category._id})(
              <Input type="hidden"/>
            )}

            <FormItem label="配件分类名称" {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: category.name,
                rules: FormValidator.getRulePartTypeName(),
                validateTrigger: 'onBlur',
              })(
                <Input placeholder="请输入配件分类名称"/>
              )}
            </FormItem>
            <Row>
              <Col span={13} offset={1}>
                <FormItem label="报价方式" {...formItemLayout}>
                  {getFieldDecorator('quote_type', {
                    initialValue: parseInt(category.quote_type) || 0,
                    onChange: this.handleRadioChange,
                  })(
                    <RadioGroup>
                      <Radio key="0" value={0}>现场报价</Radio>
                      <Radio key="1" value={1}>预设报价</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem label="顺序" {...formItemLayout} help="数值越大越靠前" labelCol={{span: 4}} wrapperCol={{span: 10}}>
                  {getFieldDecorator('order', {initialValue: category.order || 0})(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>

            <div className={itemLevelContainer}>
              {itemLevelElements}

              <Row>
                <Col span={6} offset={6}>
                  <Button type="dashed" onClick={this.addItemLevel} style={{width: '100%'}}>
                    <Icon type="plus"/> 添加配件档次
                  </Button>
                </Col>
              </Row>
            </div>
          </Form>
        </Modal>
      </span>
    );
  }
}

Edit = Form.create()(Edit);
export default Edit;
