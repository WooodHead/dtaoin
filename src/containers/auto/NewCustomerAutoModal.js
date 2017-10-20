import React from 'react';
import { Button, Icon, Modal } from 'antd';

import BaseModal from '../../components/base/BaseModal';
import GuideViewModal from '../../components/modal/GuideViewModal/Index';

import NewCustomerAutoForm from './NewCustomerAutoForm';

const guideViewImage = require('../../images/guide/coachmark_4.png');

export default class NewCustomerAutoModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isShowGuideView: false,
    };

    this.onNoLongerRemindChange = this.onNoLongerRemindChange.bind(this);
    this.onIKnowClick = this.onIKnowClick.bind(this);
  }

  onSuccess(data) {
    this.hideModal();
    this.props.onSuccess(data);
  }

  // 不再提醒
  onNoLongerRemindChange(e) {
    if (e.target.checked) {
      sessionStorage.setItem('no_remind_new_customer', true);
    }
  }

  // 我知道了
  onIKnowClick() {
    this.setState({ isShowGuideView: false });
  }

  showModal() {
    if (Boolean(sessionStorage.getItem('no_remind_new_customer'))) {
      this.setState({ visible: true });
    } else {
      this.setState({
        visible: true,
        isShowGuideView: true,
      });
    }
  }

  render() {
    const { visible, isShowGuideView } = this.state;

    return (
      <span>
        <Button
          type="primary"
          onClick={this.showModal}
          size={this.props.size || 'small'}
          style={{ position: 'relative', left: '90px', zIndex: '10' }}
        >
          创建客户
        </Button>

        <Modal
          title={<span><Icon type="plus" /> 创建客户</span>}
          visible={visible}
          width={1000}
          className="ant-modal-full"
          onCancel={this.hideModal}
          footer={null}
        >
          <NewCustomerAutoForm
            inputValue={this.props.inputValue}
            onSuccess={this.onSuccess.bind(this)}
            cancelModal={this.hideModal}
            required={this.props.required}
          />
        </Modal>

        {/* 表单modal显示后，再确定是否显示引导页*/}
        {visible && (
          <GuideViewModal
            visible={isShowGuideView}
            image={guideViewImage}
            onCheck={this.onNoLongerRemindChange}
            onClick={this.onIKnowClick}
            modalWidth={1000}
            containerStyle="modal-guide-new-customer"
          />
        )}
      </span>
    );
  }
}
