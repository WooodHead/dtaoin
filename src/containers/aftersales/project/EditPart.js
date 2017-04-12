import React from 'react';
import {Modal, Icon} from 'antd';

import BaseModal from '../../../components/base/BaseModal';

import FormPart from './FormPart';

export default class EditPart extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {visible: false};
  }

  onSuccess(data) {
    this.props.onSuccess(data);
    this.hideModal();
  }

  render() {
    let {customer_id, maintain_part, memberDetailList} = this.props;

    return (
      <span>
        <a href="javascript:;" onClick={this.showModal}>编辑</a>

        <Modal
          title={<span><Icon type="edit"/> 编辑配件</span>}
          visible={this.state.visible}
          width={720}
          className="ant-modal-full"
          onCancel={this.hideModal}
          footer={null}
        >
          <FormPart
            cancelModal={this.hideModal}
            onSuccess={this.onSuccess.bind(this)}
            maintain_part={maintain_part}
            customer_id={customer_id}
            memberDetailList={memberDetailList}
            projectDisabled={true}
          />
        </Modal>
      </span>
    );
  }
}
