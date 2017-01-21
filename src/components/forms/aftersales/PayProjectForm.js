import React from 'react';
import {message, Form, Button} from 'antd';
import Layout from '../../../utils/FormLayout';
import api from '../../../middleware/api';

const FormItem = Form.Item;

class PayProjectForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {project: {}};
  }

  componentDidMount() {
    let {customerId, projectId} = this.props;
    this.getProjectDetail(customerId, projectId);
  }

  onAccount(e) {
    e.preventDefault();
    let {customerId, projectId} = this.props;
    api.ajax({
      url: api.payProjectOnAccount(),
      type: 'POST',
      data: {
        _id: projectId,
        customer_id: customerId,
      },
    }, function () {
      message.success('挂账成功!');
      this.props.cancelModal();
      location.reload();
    }.bind(this));
  }

  onPay(e) {
    e.preventDefault();
    let {customerId, projectId} = this.props;

    api.ajax({
      url: api.payProjectByPOS(),
      type: 'POST',
      data: {
        _id: projectId,
        customer_id: customerId,
      },
    }, function () {
      message.success('结算成功!');
      this.props.cancelModal();
      location.reload();
    }.bind(this));
  }

  handleCancel() {
    this.props.cancelModal();
  }

  getProjectDetail(customerId, projectId) {
    api.ajax({url: api.maintProjectByProjectId(customerId, projectId)}, function (data) {
      this.setState({project: data.res.intention_info});
    }.bind(this));
  }

  render() {
    const {formItemLayout, buttonLayout} = Layout;
    const {project} = this.state;

    return (
      <Form horizontal >
        <FormItem label="工单号" {...formItemLayout}>
          <p className="ant-form-text">{project._id}</p>
        </FormItem>
        <FormItem label="结算金额" {...formItemLayout}>
          <p className="ant-form-text">¥<strong>{project.total_fee}</strong>元</p>
        </FormItem>

        <FormItem {...buttonLayout} className="mt15">
          <Button className="mr15" onClick={this.onAccount.bind(this)}>挂账</Button>
          <Button type="primary" onClick={this.onPay.bind(this)}>付款</Button>
        </FormItem>
      </Form>
    );
  }
}

PayProjectForm = Form.create()(PayProjectForm);
export default PayProjectForm;
