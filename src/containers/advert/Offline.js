import React from 'react';
import {Modal, Icon, Button} from 'antd';
import api from '../../middleware/api';
import BaseModal from '../../components/base/BaseModal';

export default class OfflineAdvert extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
    [
      'offline',
      'handleSubmit',
    ].map(method => this[method] = this[method].bind(this));
  }

  offline() {
    this.showModal();
  }

  handleSubmit() {
    api.ajax({
        url: api.advert.offline(),
        type: 'POST',
        data: {advert_id: this.props.id},
      },
      () => {
        // (data) => {
        this.hideModal();
        location.reload();
      });
  }

  render() {
    return (
      <span>
        <Button
          size="small"
          disabled={this.props.disabled}
          onClick={this.offline}>
          下线
        </Button>
        <Modal
          title={<span><Icon type="info-circle" className="margin-right-10"/>下线广告</span>}
          visible={this.state.visible}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}>
          <h3>确定要下线吗?</h3>
        </Modal>
      </span>
    );
  }
}
