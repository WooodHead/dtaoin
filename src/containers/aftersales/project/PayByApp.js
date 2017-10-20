import React from 'react';
import { message, Form, Button, Row, Col, Modal } from 'antd';

import Layout from '../../../utils/FormLayout';
import api from '../../../middleware/api';
import BaseModal from '../../../components/base/BaseModal';

const FormItem = Form.Item;

export default class PayByPos extends BaseModal {
  constructor(props) {
    super(props);
    this.state = { visible: false, btnLoading: false };
    [
      'handleSettlement',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleSettlement() {
    const { project } = this.props;

    if (Number(project.status) === 1) {
      this.setState({ visible: true });
    } else {
      api.ajax({
        url: api.aftersales.project.finish(),
        type: 'POST',
        data: { _id: project._id },
      }, () => {
        this.showModal();
      }, err => {
        message.error(err);
      }
      );
    }
  }

  onPay(e) {
    e.preventDefault();
    const { project } = this.props;
    this.setState({
      btnLoading: true,
    });

    const formData = {
      _id: project._id,
      customer_id: project.customer_id,
    };

    api.ajax({
      url: api.aftersales.payProjectByApp(),
      type: 'POST',
      data: formData,
    }, () => {
      window.time = setInterval(() => {
        api.ajax({ url: api.aftersales.maintProjectByProjectId(project._id) }, data => {
          if (Number(data.res.intention_info.unpay_amount) === 0) {
            window.clearInterval(window.time);
            this.setState({
              btnLoading: false,
            });
            message.success('结算成功!');
            this.hideModal();
            location.reload();
          }
        });
      }, 2000);
    }, err => {
      message.error(err);
    }
    );
  }

  render() {
    const { formItem8_15 } = Layout;
    const { visible } = this.state;
    const { project } = this.props;
    const footer = [
      <div>
        <Button type="primary" size="large" onClick={this.onPay.bind(this)}
                loading={this.state.btnLoading}>结算</Button>
      </div>,
    ];
    return (
      <div>
        <p onClick={this.handleSettlement}>POS机结算</p>
        <Modal
          title="POS机结算"
          visible={visible}
          className="ant-modal-full"
          width="720px"
          onCancel={this.hideModal}
          footer={footer}
        >
          <Row>
            <Col span={12}>
              <FormItem label="工单编号" {...formItem8_15}>
                <p className="ant-form-text">{project._id}</p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="结算金额" {...formItem8_15}>
                <p className="ant-form-text">
                  ¥<strong>{(Number(project.time_fee) + Number(project.material_fee_in)).toFixed(2)}</strong>元</p>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <FormItem label="优惠金额" {...formItem8_15}>
                <p className="ant-form-text">{Number(project.discount).toFixed(2)}</p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="应付金额" {...formItem8_15}>
                <p className="ant-form-text">¥<strong>{Number(project.total_fee).toFixed(2)}</strong>元</p>
              </FormItem>
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}

