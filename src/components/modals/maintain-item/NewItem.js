import React from 'react'
import {Row, Col, Modal, Icon, Button, Form, Input, Select, Radio} from 'antd'
import classNames from 'classnames'
import api from '../../../middleware/api'
import Layout from '../../forms/Layout'
import SearchMultipleBox from '../../search/SearchMultipleBox'
import BaseModal from '../../base/BaseModal'
import validator from '../../../middleware/validator'
import formatter from '../../../middleware/formatter'
import FormValidator from '../../../components/forms/FormValidator'

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class NewItem extends BaseModal {
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
    api.ajax({url: api.warehouse.searchCategory(key)}, data => {
      this.setState({partTypes: data.res.list})
    })
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
    formData.part_types = this.state.selectedPartTypes.join(',');

    api.ajax({
      url: api.maintain.addItem(),
      type: 'POST',
      data: formData
    }, data => {
      this.props.onSuccess(data.res.item);
      !this.props.onSuccess && this.hideModal();
    })
  }

  handleRadioChange(e) {
    this.setState({quoteType: e.target.value})
  }

  getMaintainItemTypes() {
    api.ajax({url: api.getMaintainItemTypes()}, data => {
      this.setState({types: data.res.type_list});
    })
  }

  render() {
    const {formItemLayout, selectStyle} = Layout;
    const {getFieldProps, getFieldValue} = this.props.form;
    const {visible, types, quoteType} = this.state;

    const nameProps = getFieldProps('name', {
      initialValue: this.props.inputValue ? this.props.inputValue : '', 
      validate: [{
        rules: [{validator: FormValidator.validateItemName}],
        trigger: ['onBlur', 'onChange']
      }, {
        rules: [{required: true, message: validator.required.itemName}],
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
            <FormItem label={`项目档次${k + 1}`} labelCol={{span: 12}} wrapperCol={{span: 12}}>
              <Input {...getFieldProps(`name_${k}`)}/>
            </FormItem>
          </Col>
          <Col span="7">
            <FormItem label="工时单价" labelCol={{span: 8}} wrapperCol={{span: 14}}>
              <Input
                type="number"
                {...getFieldProps(`price_${k}`)}
                addonAfter="元"
                min={0}
                placeholder="请输入工时单价"
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
      'hide': this.state.quoteType == 0
    });

    return (
      <span>
        <Button
          type="primary"
          className="margin-left-20"
          onClick={this.newItem}>
          新增项目
        </Button>
        <Modal
          title={<span><Icon type="plus" className="margin-right-10"/>新增项目</span>}
          visible={visible}
          width="680px"
          onOk={this.handleSubmit.bind(this)}
          onCancel={this.hideModal}>

          <Form horizontal>
            <FormItem label="项目名称" {...formItemLayout}>
              <Input {...nameProps} placeholder="请输入项目名称"/>
            </FormItem>

            <FormItem label="产值类型" {...formItemLayout}>
              <Select
                {...getFieldProps('maintain_type')}
                {...selectStyle}
                placeholder="请选择产值类型">
                {types.map(type => <Option key={type._id}>{type.name}</Option>)}
              </Select>
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
              <Col span="14">
                <FormItem label="报价方式" {...formItemLayout}  labelCol={{span: 10}} wrapperCol={{span: 12}}>
                  <RadioGroup {...getFieldProps('quote_type', {
                    initialValue: 0,
                    onChange: this.handleRadioChange
                    })}>
                    <Radio key="0" value={0}>现场报价</Radio>
                    <Radio key="1" value={1}>预设报价</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="顺序" {...formItemLayout} help="数值越大越靠前"  labelCol={{span: 4}} wrapperCol={{span: 10}}>
                  <Input {...getFieldProps('order', {initialValue: 0})} />
                </FormItem>
              </Col>
            </Row>

            <div className={itemLevelContainer}>
              {itemLevelElements}

              <Row className="mb15">
                <Col span="12" offset="6">
                  <a href="javascript:;" onClick={this.addItemLevel}>
                    <Icon type="plus-circle-o"/>
                    <span>添加项目档次</span>
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

NewItem = Form.create()(NewItem);
export default NewItem
