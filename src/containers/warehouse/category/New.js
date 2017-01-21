import React from 'react';
import {message, Row, Col, Modal, Icon, Button, Form, Input, Radio} from 'antd';
import classNames from 'classnames';
import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';
import BaseModal from '../../../components/base/BaseModal';
import FormValidator from '../../../utils/FormValidator';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

let levelIndex = 0;

class New extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      quoteType: 0,
    };
    [
      'addItemLevel',
      'handleSubmit',
      'handleRadioChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  addItemLevel() {
    levelIndex++;

    const {form} = this.props;
    let keys = form.getFieldValue('keys');

    keys = keys.concat(levelIndex);
    form.setFieldsValue({keys});
  }

  deleteItemLevel(key) {
    const {form} = this.props;

    let keys = form.getFieldValue('keys');
    if (keys.length > 1) {
      keys.splice(keys.indexOf(key), 1);
      form.setFieldsValue({keys});
    }
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error('请填写配件分类名称');
        return;
      }

      let params = this.assembleFormData(values);

      api.ajax({
        url: api.warehouse.category.add(),
        type: 'POST',
        data: params,
      }, data => {
        this.props.onSuccess && this.props.onSuccess(data.res.part_type);
        this.props.form.resetFields();
        this.hideModal();
        location.reload();
      });
    });
  }

  handleRadioChange(e) {
    this.setState({quoteType: e.target.value});
  }

  assembleFormData(values) {
    if (this.state.quoteType == 1) {
      let levels = [];
      for (let i = 0; i <= levelIndex; i++) {
        let nameProp = `name_${i}`,
          priceProp = `price_${i}`;

        if (values[nameProp]) {
          let level = {
            name: values[nameProp],
            price: values[priceProp],
          };
          levels.push(level);
        }

        delete values[nameProp];
        delete values[priceProp];
      }
      values.levels = JSON.stringify(levels);
    }
    delete values.keys;

    return values;
  }

  render() {
    const {formItemLayout} = Layout;
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const {visible, quoteType} = this.state;

    getFieldDecorator('keys', {
      initialValue: [0],
    });

    let keys = getFieldValue('keys');

    const itemLevelElements = getFieldValue('keys').map((k) => {
      return (
        <Row key={k}>
          <Col span={12}>
            <FormItem label={`配件档次${k + 1}`} labelCol={{span: 12}} wrapperCol={{span: 12}}>
              {getFieldDecorator(`name_${k}`)(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col span={9}>
            <FormItem label="报价" labelCol={{span: 8}} wrapperCol={{span: 14}}>
              {getFieldDecorator(`price_${k}`)(
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
      'hide': quoteType == 0,
    });

    return (
      <span>
        <Button
          type="primary"
          className="margin-left-20"
          onClick={this.showModal}
        >
          新增分类
        </Button>

        <Modal
          title={<span><Icon type="plus" className="margin-right-10"/>新增分类</span>}
          visible={visible}
          width="680px"
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
        >
          <Form horizontal>
            <FormItem label="配件分类名称" {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: this.props.inputValue ? this.props.inputValue : '',
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
                    initialValue: 0,
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
                  {getFieldDecorator('order', {initialValue: 0})(
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

New = Form.create()(New);
export default New;
