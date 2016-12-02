import React from 'react'
import {Row, Col, Modal, Icon, Button, Form, Input, Radio} from 'antd'
import classNames from 'classnames'
import api from '../../../../middleware/api'
import Layout from '../../../forms/Layout'
import BaseModal from '../../../base/BaseModal'
import validator from '../../../../middleware/validator'
import formatter from '../../../../middleware/formatter'
import FormValidator from '../../../../components/forms/FormValidator'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class NewCategory extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      itemLevelIndex: 0,
      quoteType: 0,
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

    this.setState({itemLevelIndex: this.state.itemLevelIndex+1});
  }

  deleteItemLevel(key) {
    const {form} = this.props;

    let keys = form.getFieldValue('keys');
    if(keys.length > 1) {
      keys.splice(keys.indexOf(key), 1);

      form.setFieldsValue({keys});

      this.setState({itemLevelIndex: this.state.itemLevelIndex-1});
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
      url: api.warehouse.addCategory(),
      type: 'POST',
      data: formData
    }, data => {
      this.props.onSuccess && this.props.onSuccess(data.res.part_type);
      location.hash = api.getHash();
      this.hideModal();
    })
  }

  handleRadioChange(e) {
    this.setState({quoteType: e.target.value})
  }

  render() {
    const {formItemLayout} = Layout;
    const {getFieldProps, getFieldValue} = this.props.form;
    const {visible, quoteType} = this.state;

    const nameProps = getFieldProps('name', {
      initialValue: this.props.inputValue ? this.props.inputValue : '', 
      validate: [{
        rules: [{validator: FormValidator.validatePartTypeName}],
        trigger: ['onBlur', 'onChange']
      }, {
        rules: [{required: true, message: validator.required.partTypeName}],
        trigger: ['onBlur', 'onChange']
      }]
    });

    getFieldProps('keys', {
      initialValue: [0]
    });

    const itemLevelElements = getFieldValue('keys').map((k) => {
      return (
        <Row key={k}>
          <Col span="12">
            <FormItem label={`配件档次${k + 1}`} labelCol={{span: 12}} wrapperCol={{span: 12}}>
              <Input {...getFieldProps(`name_${k}`)}/>
            </FormItem>
          </Col>
          <Col span="7">
            <FormItem label="报价" labelCol={{span: 8}} wrapperCol={{span: 14}}>
              <Input
                type="number"
                {...getFieldProps(`price_${k}`)}
                addonAfter="元"
                min={0}
                placeholder="请输入报价"
              />
            </FormItem>
          </Col>
          <Col span="5">
            <div>
              <a href="javascript:;" onClick={this.deleteItemLevel.bind(this, k)}>
                <Icon type="minus-circle-o"/>
                <span>删除档次</span>
              </a>
            </div>
          </Col>
        </Row>
      );
    });

    const itemLevelContainer = classNames({
      'hide': quoteType == 0
    });

    return (
      <span>
        <Button
          type="primary"
          className="margin-left-20"
          onClick={this.showModal}>
          新增分类
        </Button>
        <Modal
          title={<span><Icon type="plus" className="margin-right-10"/>新增分类</span>}
          visible={visible}
          width="680px"
          onOk={this.handleSubmit}
          onCancel={this.hideModal}>

          <Form horizontal>
            <FormItem label="配件分类名称" {...formItemLayout}>
              <Input {...nameProps} placeholder="请输入配件分类名称"/>
            </FormItem>

            <FormItem label="报价方式" {...formItemLayout}>
              <RadioGroup {...getFieldProps('quote_type', {
                initialValue: 0,
                onChange: this.handleRadioChange
              })}>
                <Radio key="0" value={0}>现场报价</Radio>
                <Radio key="1" value={1}>预设报价</Radio>
              </RadioGroup>
            </FormItem>

            <div className={itemLevelContainer}>
              {itemLevelElements}

              <Row>
                <Col span="12" offset="6">
                  <a href="javascript:;" onClick={this.addItemLevel}>
                    <Icon type="plus-circle-o"/>
                    <span>添加配件档次</span>
                  </a>
                </Col>
              </Row>
            </div>
          </Form>
        </Modal>
      </span>
    );
  }
}

NewCategory = Form.create()(NewCategory);
export default NewCategory
