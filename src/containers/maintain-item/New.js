import React from 'react';
import {Row, Col, Modal, Icon, Button, Form, Input, Select, Radio} from 'antd';
import classNames from 'classnames';
import api from '../../middleware/api';
import Layout from '../../utils/FormLayout';
import SearchMultipleBox from '../../components/search/SearchMultipleBox';
import BaseModal from '../../components/base/BaseModal';
import FormValidator from '../../utils/FormValidator';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

let levelIndex = 0;

class New extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      itemLevelIndex: 0,
      types: [],
      selectedPartTypes: [],
      partTypes: [],
      quoteType: 0,
    };
    [
      'newItem',
      'handleChange',
      'handleSelect',
      'addItemLevel',
      'handleSubmit',
      'handleRadioChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  newItem() {
    this.getMaintainItemTypes();
    this.showModal();
  }

  handleSelect(data) {
    this.setState({selectedPartTypes: data});
  }

  handleChange(key) {
    api.ajax({url: api.warehouse.category.search(key)}, data => {
      this.setState({partTypes: data.res.list});
    });
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
    let formData = this.props.form.getFieldsValue();
    if (this.state.quoteType == 1) {
      let levels = [];
      for (let i = 0; i <= levelIndex; i++) {
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
    formData.part_types = this.state.selectedPartTypes.join(',');

    api.ajax({
      url: api.maintainItem.add(),
      type: 'POST',
      data: formData,
    }, data => {
      this.props.onSuccess(data.res.item);
      this.hideModal();
    });
  }

  handleRadioChange(e) {
    this.setState({quoteType: e.target.value});
  }

  getMaintainItemTypes() {
    api.ajax({url: api.getMaintainItemTypes()}, data => {
      this.setState({types: data.res.type_list});
    });
  }

  render() {
    const {formItemLayout, selectStyle} = Layout;
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const {visible, types} = this.state;

    getFieldDecorator('keys', {
      initialValue: [0],
    });
    let keys = getFieldValue('keys');

    const itemLevelElements = getFieldValue('keys').map((k) => {
      return (
        <Row key={k}>
          <Col span={12}>
            <FormItem label={`项目档次${k + 1}`} labelCol={{span: 12}} wrapperCol={{span: 12}}>
              {getFieldDecorator(`name_${k}`)(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col span={9}>
            <FormItem label="工时单价" labelCol={{span: 8}} wrapperCol={{span: 14}}>
              {getFieldDecorator(`price_${k}`)(
                <Input
                  type="number"
                  addonAfter="元"
                  min={0}
                  placeholder="请输入工时单价"
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
          className="margin-left-20"
          onClick={this.newItem}
        >
          新增项目
        </Button>

        <Modal
          title={<span><Icon type="plus" className="margin-right-10"/>新增项目</span>}
          visible={visible}
          width="680px"
          onOk={this.handleSubmit.bind(this)}
          onCancel={this.hideModal}
        >
          <Form horizontal>
            <FormItem label="项目名称" {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: this.props.inputValue ? this.props.inputValue : '',
                rules: FormValidator.getRuleItemName(),
                validateTrigger: 'onBlur',
              })(
                <Input placeholder="请输入项目名称"/>
              )}
            </FormItem>

            <FormItem label="产值类型" {...formItemLayout}>
              {getFieldDecorator('maintain_type')(
                <Select{...selectStyle}
                       placeholder="请选择产值类型">
                  {types.map(type => <Option key={type._id}>{type.name}</Option>)}
                </Select>
              )}
            </FormItem>

            <FormItem label="关联配件分类" {...formItemLayout}>
              <SearchMultipleBox
                data={this.state.partTypes}
                defaultValue={this.state.selectedPartTypes}
                change={this.handleChange}
                select={this.handleSelect}
                placeholder="请输入配件分类"
              />
            </FormItem>

            <Row>
              <Col span={14}>
                <FormItem label="报价方式" {...formItemLayout} labelCol={{span: 10}} wrapperCol={{span: 12}}>
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

             <Row>
              <Col span={24}>
                <FormItem label="在App展示" labelCol={{span: 6}} wrapperCol={{span: 14}}>
                  {getFieldDecorator('is_show_on_app', {initialValue: '0'})(
                    <RadioGroup>
                      <Radio value="0">否</Radio>
                      <Radio value="1">是</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
            </Row>

            <div className={itemLevelContainer}>
              {itemLevelElements}

              <Row>
                <Col span={6} offset={6}>
                  <Button type="dashed" onClick={this.addItemLevel} style={{width: '100%'}}>
                    <Icon type="plus"/> 添加项目档次
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
