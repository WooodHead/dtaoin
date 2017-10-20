import React, { Component } from 'react';
import { message, Form, Checkbox, Input, Button } from 'antd';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';

class LostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      failTypes: [],
      checkedTypes: new Set(),
    };
  }

  componentDidMount() {
    this.getFailTypes();
  }

  handleSubmit(e) {
    e.preventDefault();
    const formData = this.props.form.getFieldsValue();
    formData.fail_types = Array.from(this.state.checkedTypes).toString();

    this.setState({ isFetching: true });
    api.ajax({
      url: api.presales.intention.lost(),
      type: 'POST',
      data: formData,
    }, () => {
      message.success('提交成功');
      this.setState({ isFetching: false });
      location.reload();
      this.props.cancelModal();
    }, err => {
      message.error(`提交失败[${err}]`);
      this.setState({ isFetching: false });
    });
  }

  handleChange(e) {
    const checkedTypeSet = this.state.checkedTypes;
    if (e.target.checked) {
      checkedTypeSet.add(e.target.value);
    } else {
      checkedTypeSet.delete(e.target.value);
    }
    this.setState({ checkedTypes: checkedTypeSet });
  }

  getFailTypes() {
    api.ajax({ url: api.presales.intention.getFailTypes() }, data => {
      this.setState({ failTypes: data.res.types });
    });
  }

  render() {
    const FormItem = Form.Item;
    const { formItemLayout } = Layout;
    const { getFieldDecorator } = this.props.form;

    const { intentionId, customerId, cancelModal } = this.props;
    const { isFetching } = this.state;

    return (
      <Form>
        {getFieldDecorator('_id', { initialValue: intentionId })(<Input type="hidden"/>)}
        {getFieldDecorator('customer_id', { initialValue: customerId })(<Input type="hidden"/>)}

        {this.state.failTypes.map((failType, index) =>
          <FormItem label={`${failType.name}`} {...formItemLayout} key={index}>
            {failType.sub_types.map(type =>
              <label className="ant-checkbox-inline" key={type.id}>
                <Checkbox value={type.id} onChange={this.handleChange.bind(this)}/> {type.name}
              </label>
            )}
          </FormItem>
        )}

        <FormItem label="流失原因" {...formItemLayout}>
          {getFieldDecorator('fail_reason')(
            <Input type="textarea" placeholder="流失原因"/>
          )}
        </FormItem>

        <div className="form-action-container">
          <Button size="large" className="mr10" onClick={cancelModal}>取消</Button>

          <Button
            type="primary"
            size="large"
            onClick={this.handleSubmit.bind(this)}
            loading={isFetching}
            disabled={isFetching}
          >
            确定
          </Button>
        </div>
      </Form>
    );
  }
}

LostForm = Form.create()(LostForm);
export default LostForm;
