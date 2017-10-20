import React from 'react';
import { Button, Icon, Modal } from 'antd';

import BaseModal from '../../components/base/BaseModal';
import GuideViewModal from '../../components/modal/GuideViewModal/Index';

import NewAutoForm from './NewAutoForm';

const guideViewImage = require('../../images/guide/coachmark_2.png');

export default class NewAutoModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isShowGuideView: false,
      isDisable: !!this.props.isDisable,
    };

    this.onNoLongerRemindChange = this.onNoLongerRemindChange.bind(this);
    this.onIKnowClick = this.onIKnowClick.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  showModal() {
    if (localStorage.getItem('no_remind_new_auto') === 'true') {
      this.setState({ visible: true });
    } else {
      this.setState({
        visible: true,
        isShowGuideView: true,
      });
    }
  }

  // 不再提醒
  onNoLongerRemindChange(e) {
    localStorage.setItem('no_remind_new_auto', e.target.checked);
  }

  // 我知道了
  onIKnowClick() {
    this.setState({ isShowGuideView: false });
  }

  updateState(obj) {
    this.setState(obj);
  }

  render() {
    const formProps = {
      customer_id: this.props.customer_id,
      auto_id: this.state.auto_id,
      onSuccess: this.updateState,
      cancelModal: this.hideModal,
    };

    const { visible, isDisable, isShowGuideView } = this.state;

    return (
      <span>
        <Button disabled={isDisable} onClick={this.showModal}>添加</Button>

        <Modal
          title={<span><Icon type="plus" /> 添加车辆</span>}
          visible={visible}
          width={720}
          className="ant-modal-full"
          onCancel={this.hideModal}
          footer={null}
        >
          <NewAutoForm newAuto="true" {...formProps} onSuccessAdd={this.props.onSuccess} />
        </Modal>

        {visible && (
          <GuideViewModal
            visible={isShowGuideView}
            image={guideViewImage}
            onCheck={this.onNoLongerRemindChange}
            onClick={this.onIKnowClick}
            modalWidth={720}
            containerStyle="modal-guide-auto"
          />
        )}
      </span>
    );
  }
}
