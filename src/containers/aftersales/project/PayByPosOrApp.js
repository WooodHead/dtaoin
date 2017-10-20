import React from 'react';
import { message, Form, Button, Row, Col, Modal, Popconfirm } from 'antd';

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
        this.props.onFinish(project._id);
      }, err => {
        message.error(err);
      },
      );
    }
  }

  onPay(e) {
    e.preventDefault();
    const { project, type } = this.props;
    this.setState({
      btnLoading: true,
    });

    const formData = {
      _id: project._id,
      customer_id: project.customer_id,
    };

    const url = type === 'pos' ? api.aftersales.payProjectByPOS() : api.aftersales.payProjectByApp();
    api.ajax({
      url,
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
      this.setState({ btnLoading: false });
    },
    );
  }

  render() {
    const { formItem8_15 } = Layout;
    const { visible } = this.state;
    const { project, type } = this.props;
    const footer = [
      <div key="footer2">
        <Button
          key="btn1"
          type="primary"
          size="large"
          onClick={this.onPay.bind(this)}
          loading={this.state.btnLoading}
        >
          结算
        </Button>
      </div>,
    ];
    return (
      <div>
        {
          String(project.status) === '1' ? <p
            style={{ width: '81px', textAlign: 'center' }}
            onClick={this.handleSettlement}
          >
            {type === 'pos' ? 'POS机结算' : '客户端结算'}
          </p> : <Popconfirm
            placement="topRight"
            title="请确认施工完毕，配件出库"
            onConfirm={this.handleSettlement}
          >
            <p style={{ width: '81px', textAlign: 'center' }}>
              {type === 'pos' ? 'POS机结算' : '客户端结算'}
            </p>
          </Popconfirm>
        }
        <Modal
          title={type === 'pos' ? 'POS机结算' : '客户端结算'}
          visible={visible}
          className="ant-modal-full"
          width="720px"
          onCancel={this.hideModal}
          footer={footer}
        >
          <Row className="mt15">
            <Col span={12}>
              <FormItem label="工单编号" {...formItem8_15}>
                <p className="ant-form-text">{project._id}</p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="结算金额" {...formItem8_15}>
                <p className="ant-form-text">
                  ¥<strong>{(Number(project.time_fee) +
                Number(project.material_fee_in)).toFixed(2)}</strong>元</p>
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
                <p className="ant-form-text">¥<strong>{Number(project.total_fee).
                  toFixed(2)}</strong>元</p>
              </FormItem>
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}

