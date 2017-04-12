import React from 'react';
import {message, Form, Input, Button, DatePicker, Row, Col} from 'antd';
import className from 'classnames';

import Layout from '../../../utils/FormLayout';
import formatter from '../../../utils/DateFormatter';
import validator from '../../../utils/validator';
import FormValidator from '../../../utils/FormValidator';
import api from '../../../middleware/api';

import NumberInput from '../../../components/widget/NumberInput';

const FormItem = Form.Item;

class NewDecorationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isNew: true,
      isEdit: true,
      decorationInfo: {},
    };
    [
      'handleIsEdit',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    let {customerId, autoDealId, autoId} = this.props;
    this.getDecorationInfo(customerId, autoDealId);
    if (!!autoId || !!autoDealId) {
      this.setState({isEdit: false});
    }
  }

  handleIsEdit() {
    let {isEdit} = this.state;
    this.setState({
      isEdit: !isEdit,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    let {isNew} = this.state;
    let {autoDealId, customerId} = this.props;
    if (!autoDealId) {
      message.error('请先填写交易信息并保存');
      return false;
    }

    this.props.form.validateFieldsAndScroll((errors, values) => {

      if (!!errors) {
        message.error(validator.text.hasError);
        return false;
      }

      values.deal_date = formatter.date(values.deal_date);

      api.ajax({
        url: isNew ? api.presales.deal.addDecoration() : api.presales.deal.editDecoration(),
        type: 'POST',
        data: values,
      }, () => {
        message.success(isNew ? '新增加装交易成功' : '修改加装交易成功');
        this.getDecorationInfo(customerId, autoDealId);
        this.handleIsEdit();
      });
    });
  }

  getDecorationInfo(customerId, autoDealId) {
    api.ajax({url: api.presales.deal.getDecorationLogDetail(customerId, autoDealId)}, data => {
      this.setState({
        decorationInfo: data.res.detail || {},
        isNew: !(data.res.detail),
        isEdit: !(data.res.detail),
      });
    }, () => {
      this.setState({
        isNew: true,
        isEdit: true,
      });
    });
  }

  render() {
    const {formItemLayout} = Layout;
    let {getFieldDecorator} = this.props.form;
    let {isEdit, decorationInfo} = this.state;
    let {customerId, autoId, autoDealId} = this.props;

    const show = className({
      '': !isEdit,
      'hide': isEdit,
    });

    const inputShow = className({
      'hide': !isEdit,
      '': isEdit,
    });

    return (
      <div>
        <Form className={inputShow}>
          {getFieldDecorator('_id', {initialValue: decorationInfo._id})(
            <Input type="hidden"/>
          )}
          {getFieldDecorator('customer_id', {initialValue: customerId})(
            <Input type="hidden"/>
          )}
          {getFieldDecorator('auto_id', {initialValue: autoId})(
            <Input type="hidden"/>
          )}

          {getFieldDecorator('auto_deal_id', {initialValue: autoDealId})(
            <Input type="hidden"/>
          )}
          <Row>
            <Col span={6}>
              <NumberInput
                label="加装金额"
                defaultValue={(decorationInfo.price && Number(decorationInfo.price).toFixed(2)) || ''}
                id="price"
                self={this}
                layout={formItemLayout} ßß
                placeholder="请输入加装金额"
                rules={FormValidator.getRuleNotNull()}
              />
            </Col>

            <Col span={6}>
              <FormItem label="加装时间" {...formItemLayout}>
                {getFieldDecorator('deal_date', {
                  initialValue: formatter.getMomentDate(decorationInfo.deal_date),
                })(
                  <DatePicker placeholder="加装时间" allowClear={false}/>
                )}
              </FormItem>
            </Col>

          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="加装内容" labelCol={{span: 3}} wrapperCol={{span: 16}}>
                {getFieldDecorator('content', {
                  initialValue: decorationInfo.content,
                  rules: FormValidator.getRuleNotNull(),
                })(
                  <Input type="textarea"/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={18}>
              <Col span={24} offset={2}>
                <div className="pull-left">
                  <Button type="dash" onClick={this.handleIsEdit}>取消</Button>
                  <span className="ml10">
                    <Button type="primary" onClick={this.handleSubmit.bind(this)}>保存</Button>
                  </span>
                </div>
              </Col>
            </Col>
          </Row>
        </Form>

        <Form className={show}>
          <Row>
            <Col span={6}>
              <FormItem label="加装金额" {...formItemLayout}>
                <span>{(decorationInfo.price && Number(decorationInfo.price).toFixed(2)) || ''}</span>
              </FormItem>
            </Col>

            <Col span={6}>
              <FormItem label="加装时间" {...formItemLayout}>
                <span>{decorationInfo.deal_date}</span>
              </FormItem>
            </Col>

          </Row>

          <Row>
            <Col span={12}>
              <FormItem label="加装内容" labelCol={{span: 3}} wrapperCol={{span: 16}}>
                <span>{decorationInfo.content}</span>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={18}>
              <Col span={24} offset={2}>
                <div className="pull-left">
                  <Button type="dash" onClick={this.handleIsEdit}>编辑</Button>
                </div>
              </Col>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

NewDecorationForm = Form.create()(NewDecorationForm);
export default NewDecorationForm;
