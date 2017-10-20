import React from 'react';
import { Switch, Modal, Icon, Button, Form, Input, Row, Col, message } from 'antd';
import classNames from 'classnames';
import BaseModal from '../../../components/base/BaseModal';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';
import FormValidator from '../../../utils/FormValidator';

const FormItem = Form.Item;

class Edit extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      item: props.item || {},
      payMethod: props.item.partTypeConfig ? props.item.partTypeConfig.levels : JSON.stringify([]),
      quoteType: props.item.partTypeConfig ? props.item.partTypeConfig.quote_type : '0',
    };

    [
      'handleQuoteTypeChange',
      'handleAddItemLevel',
      'handleDeleteItemLevel',
      'handleSubmit',
      'handleLevelChange',
      'handlePriceChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.item) {
      this.setState({ item: nextProps.item });
    }
  }

  handleAddItemLevel() {
    const { payMethod } = this.state;
    let itemLevels = '';
    try {
      itemLevels = JSON.parse(payMethod);
    } catch (e) {
      itemLevels = [{ name: '', price: '' }];
    }
    itemLevels.push({ name: '', price: '' });

    this.setState({ payMethod: JSON.stringify(itemLevels) });
  }

  handleDeleteItemLevel(index) {
    const { payMethod } = this.state;
    let itemLevels = '';
    try {
      itemLevels = JSON.parse(payMethod);
    } catch (e) {
      itemLevels = [{ name: '', price: '' }];
    }
    itemLevels.splice(index, 1);

    if (itemLevels.length === 0) {
      this.setState({ payMethod: JSON.stringify(itemLevels), quoteType: '0' });
      this.props.form.setFieldsValue({ quote_type: false });
    } else {
      this.setState({ payMethod: JSON.stringify(itemLevels) });
    }
  }

  handleQuoteTypeChange(isUse) {
    isUse
      ? this.setState({ quoteType: '1', payMethod: JSON.stringify([{ name: '', price: '' }]) })
      : this.setState({ quoteType: '0', payMethod: JSON.stringify([]) });
  }

  handleLevelChange(e, index) {
    const { payMethod } = this.state;
    let itemLevels = '';
    try {
      itemLevels = JSON.parse(payMethod);
    } catch (e) {
      itemLevels = [{ name: '', price: '' }];
    }
    itemLevels[index].name = e.target.value;
    this.setState({ payMethod: JSON.stringify(itemLevels) });
  }

  handlePriceChange(e, index) {
    const { payMethod } = this.state;
    let itemLevels = '';
    try {
      itemLevels = JSON.parse(payMethod);
    } catch (e) {
      itemLevels = [{ name: '', price: '' }];
    }
    itemLevels[index].price = e.target.value;
    this.setState({ payMethod: JSON.stringify(itemLevels) });
  }

  handleSubmit() {
    const { quoteType, payMethod } = this.state;

    try {
      for (const item of JSON.parse(payMethod)) {
        if (!item.name || !item.price) {
          message.warn('配件档次信息未填写完整！');
          return false;
        }
      }
    } catch (e) {

    }

    const formData = this.props.form.getFieldsValue();

    formData.quote_type = quoteType;
    formData.markup_rate = Number(formData.markup_rate) / 100;

    if (String(quoteType) === '1') {
      formData.levels = payMethod;
    }

    api.ajax({
      url: api.warehouse.part.editPartType(),
      type: 'POST',
      data: formData,
    }, () => {
      this.hideModal();
      message.success('编辑成功！');
      this.props.onSuccess();
    }, () => {
      message.warn('编辑失败！');
    });
  }

  render() {
    const { visible, item, payMethod, quoteType } = this.state;
    const { formItemLayout, formItem_618 } = Layout;
    const { getFieldDecorator } = this.props.form;

    let itemLevels = '';

    try {
      itemLevels = JSON.parse(payMethod);
    } catch (e) {
      itemLevels = [{ name: '', price: '' }];
    }

    const payMethodShow = (
      itemLevels.map((item, index) => (
          <Row key={`${index}1`}>
            <Col span={12}>
              <FormItem label={'配件档次'} {...formItemLayout}>
                <Input
                  value={item.name}
                  onChange={e => this.handleLevelChange(e, index)}
                />
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem label="报价" {...formItem_618} required>
                <Input
                  type="number"
                  addonAfter="元"
                  min={0}
                  placeholder="请输入工时单价"
                  value={item.price}
                  onChange={e => this.handlePriceChange(e, index)}
                  style={{ width: '220px' }}
                />
              </FormItem>
            </Col>
            <Col span={1} className="ml10">
              <Icon
                className="dynamic-delete-button"
                type="delete"
                onClick={() => this.handleDeleteItemLevel(index)}
              />
            </Col>
          </Row>
        ))
    );

    const itemLevelContainer = classNames({
      hide: String(quoteType) === '0',
    });

    return (
      <span>
        <a href="javascript:;" onClick={this.showModal}>编辑</a>

        <Modal
          title={<span><Icon type="edit" /> 编辑配件分类</span>}
          visible={visible}
          onCancel={this.hideModal}
          onOk={this.handleSubmit}
          width={720}
        >
          <Form>
            {getFieldDecorator('part_type', { initialValue: item._id })(
              <Input type="hidden" />,
            )}
            <Row>
              <Col span={12}>
                <FormItem label="二级分类" {...formItemLayout}>
                 <p>{item.name}</p>
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem label="加价率" {...formItem_618}>
                  {getFieldDecorator('markup_rate', {
                    initialValue: item.partTypeConfig &&
                    parseInt(Number(item.partTypeConfig.markup_rate) * 100),
                    rules: FormValidator.getRulePartNo(),
                    validateTrigger: 'onBlur',
                  })(
                    <Input placeholder="请输入加价率" addonAfter="%" style={{ width: '221px' }} />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="预设报价" {...formItemLayout}>
                  {getFieldDecorator('quote_type', {
                    valuePropName: 'checked',
                    initialValue: String(quoteType) !== '0',
                    onChange: this.handleQuoteTypeChange,
                  })(
                    <Switch checkedChildren={'启用'} unCheckedChildren={'停用'} />,
                  )}
                </FormItem>
              </Col>
           </Row>

        <div className={itemLevelContainer}>
          {payMethodShow}
          <Row>
            <Col span={24} className="center">
              <Button
                type="dashed"
                onClick={this.handleAddItemLevel}
                className="ml3 font-size-13 mt5 mb5"
                style={{ width: '95%', color: '#333', marginLeft: '-1%' }}
              >
                <Icon type="plus" /> 添加项目档次
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
