import React from 'react';
import QRCode from 'qrcode.react';
import { message, Modal, Row, Col, Form, Button, Icon, Input } from 'antd';

import api from '../../../middleware/api';
import path from '../../../config/path';
import FormValidator from '../../../utils/FormValidator';
import validator from '../../../utils/validator';
import FormLayout from '../../../utils/FormLayout';

import BaseModal from '../../../components/base/BaseModal';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

class Destroy extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      hasPermission: false,
      detail: props.detail,
    };

    this.showDestroyModal = this.showDestroyModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  showDestroyModal() {
    this.checkPermission(path.aftersales.project.destroy);
    this.showModal();
  }

  async checkPermission(path) {
    const { detail } = this.props;
    const hasPermission = await api.checkPermission(path);

    if (!hasPermission) {
      this.interval = setInterval(this.getProjectDetail.bind(this, detail._id), 2000);
    }
    this.setState({ hasPermission });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error(validator.text.hasError);
        return;
      }

      values._id = this.props.detail._id;

      api.ajax({
        type: 'post',
        url: api.aftersales.project.destroy(),
        data: values,
      }, data => {
        const detail = data.res.intention_info;
        if (String(detail.status) === '-1') {
          message.success('作废成功');
          location.reload();
        }
      }, error => {
        message.error(`作废失败[${error}]`);
      });
    });
  }

  getProjectDetail(id) {
    api.ajax({ url: api.aftersales.project.detail(id) }, data => {
      const detail = data.res.intention_info;
      this.setState({ detail });

      if (String(detail.status) === '-1') {
        clearInterval(this.interval);
        this.hideModal();
        location.reload();
      }
    });
  }

  render() {
    const { formItem8_15 } = FormLayout;
    const { detail, form } = this.props;
    const { visible, hasPermission } = this.state;
    const { getFieldDecorator, getFieldValue } = form;

    const status = String(detail.status);
    const payStatus = String(detail.pay_status);

    return (
      <span>
        <p
          onClick={this.showDestroyModal}
          disabled={status !== '0' || payStatus !== '0'}
          className="project-destroy"
        >
          作废
         </p>
        <Modal
          title={<span><Icon type="exclamation-circle-o" className="text-red"/> 作废工单</span>}
          visible={visible}
          width={720}
          onCancel={this.hideModal}
          footer={hasPermission ?
            <div>
              <Button size="large" className="mr5" onClick={this.hideModal}>取消</Button>
              <Button size="large" type="danger" onClick={this.handleSubmit}>作废</Button>
            </div> :
            null
          }
        >
          <Row>
            <Col span={12}>
              <Form>
                <FormItem label="工单号" {...formItem8_15}>
                  <p className="ant-form-text">{detail._id}</p>
                </FormItem>

                <FormItem label="原因" {...formItem8_15}>
                  {getFieldDecorator('cancel_reason', {
                    rules: FormValidator.getRuleNotNull(),
                    validatorTrigger: 'onBlur',
                  })(
                    <TextArea placeholder="填写作废原因"/>
                  )}
                </FormItem>
              </Form>
            </Col>

            <Col span={12} className={hasPermission ? 'hide' : null}>
              <div className={getFieldValue('cancel_reason') ? 'center' : 'hide'}>
                <QRCode
                  value={JSON.stringify({
                    authType: 'cancel_maintain_order',
                    requestParams: {
                      type: 'post',
                      url: api.aftersales.project.destroy(),
                      data: {
                        _id: detail._id,
                        cancel_reason: encodeURI(getFieldValue('cancel_reason')),
                      },
                    },
                  })}
                  size={128}
                  ref="qrCode"
                />
                <p>请扫码确认该工单作废</p>
                <p>已领料配件会被恢复</p>
                <p><Icon type="check-circle" className={status === '-1' ? 'confirm-check' : 'hide'}/></p>
              </div>
            </Col>
          </Row>
        </Modal>
      </span>
    );
  }
}

Destroy = Form.create()(Destroy);
export default Destroy;
