import React from 'react';
import { Button, Icon, Modal } from 'antd';

import BaseModal from '../../components/base/BaseModal';
import GuideViewModal from '../../components/modal/GuideViewModal/Index';

import EditAutoForm from './EditAutoForm';

const guideViewImage = require('../../images/guide/coachmark_2.png');

export default class EditAutoModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isShowGuideView: false,

      auto_id: props.auto_id,
      customer_id: props.customer_id,
      isDisabled: !!props.isDisable,
    };

    this.onNoLongerRemindChange = this.onNoLongerRemindChange.bind(this);
    this.onIKnowClick = this.onIKnowClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isDisabled: nextProps.isDisable,
      auto_id: nextProps.auto_id,
      customer_id: nextProps.customer_id,
    });
  }

  showModal() {
    if (localStorage.getItem('no_remind_edit_auto') === 'true') {
      this.setState({ visible: true });
    } else {
      this.setState({
        visible: true,
        isShowGuideView: true,
      });
    }
  }

  onNoLongerRemindChange(e) {
    localStorage.setItem('no_remind_edit_auto', e.target.checked);
  }

  onIKnowClick() {
    this.setState({ isShowGuideView: false });
  }

  render() {
    const {
      visible,
      isShowGuideView,
      auto_id,
      customer_id,
      isDisabled,
    } = this.state;

    return (
      <span>
        <Button onClick={this.showModal} disabled={isDisabled}>编辑</Button>

        <Modal
          title={<span><Icon type="edit" /> 编辑车辆信息</span>}
          visible={visible}
          width={720}
          className="ant-modal-full"
          onCancel={this.hideModal}
          footer={null}
        >
          <EditAutoForm
            cancelModal={this.hideModal}
            auto_id={auto_id}
            customer_id={customer_id}
            onSuccess={this.props.onSuccess}
          />
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
