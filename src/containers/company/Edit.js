import React from 'react';
import { Modal, Icon } from 'antd';

import BaseModal from '../../components/base/BaseModal';

import EditForm from './EditForm';

export default class Edit extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  render() {
    return (
      <span>
        <a href="javascript:" onClick={this.showModal}>编辑</a>

        <Modal
          title={<span><Icon type="edit" /> 编辑门店</span>}
          visible={this.state.visible}
          width="960px"
          onCancel={this.hideModal}
          footer={null}
        >
          <EditForm
            company={this.props.company}
            cancelModal={this.hideModal}
            onSuccess={this.props.onSuccess}
          />
        </Modal>
      </span>
    );
  }
}
