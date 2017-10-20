import React from 'react';
import { Modal, Button, message } from 'antd';

import api from '../../../middleware/api';
import BaseModal from '../../../components/base/BaseModal';
import text from '../../../config/text';

export default class PutCarRemind extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };

    [
      'handleSubmit',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleSubmit() {
    api.ajax({
      url: api.aftersales.maintainIntentionSendSms(),
      type: 'POST',
      data: { _id: this.props.id },
    }, () => {
      message.success('发送消息成功');
      this.hideModal();
    });
  }

  render() {
    const { visible } = this.state;
    const { customerName, plateNum, gender } = this.props;

    const footer = [
      <div key="footer1">
        <Button key="btn1" type="primary" onClick={this.handleSubmit}>发送</Button>
        <Button key="btn2" type="ghost" onClick={this.hideModal}>取消</Button>
      </div>,
    ];

    return (
      <div className="center">
        <span onClick={this.showModal} style={{ padding: '10px' }}>提车提醒</span>
        <Modal
          visible={visible}
          title="提车提醒"
          onCancel={this.hideModal}
          footer={footer}
          width="720px"
        >
          <div className="font-size-14 text-gray ml20">
            <p>请确认该工单已经完工，并向客户发送短信通知</p>
            <p className="mt20">
              {`短信内容：${customerName}${text.gender[String(gender)]}，您车牌号为 ${plateNum} 的车辆已经完工，欢迎您随时前来提车，水稻汽车承诺所有项目质保3个月或20000公里，质保期内免费返修。`}
            </p>
            <p
              className="mt15"
              style={{ textIndent: '5em' }}
            >
              {`——水稻汽车 ${api.getLoginUser().companyName}  ${api.getLoginUser().name}`}
            </p>
          </div>
        </Modal>
      </div>
    );
  }
}
