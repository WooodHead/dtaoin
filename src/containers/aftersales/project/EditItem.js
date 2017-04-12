import React from 'react';
import {Modal, Icon} from 'antd';
import BaseModal from '../../../components/base/BaseModal';
import ItemForm from './FormItem';

export default class EditItem extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {visible: false};
  }

  onSuccess(data) {
    this.props.onSuccess(data);
    this.hideModal();
  }

  render() {
    return (
      <span>
        <a href="javascript:;" onClick={this.showModal}>编辑</a>

        <Modal
          title={<span><Icon type="edit"/> 编辑项目</span>}
          visible={this.state.visible}
          width={720}
          className="ant-modal-full"
          onCancel={this.hideModal}
          footer={null}
        >
          <ItemForm
            cancelModal={this.hideModal}
            onSuccess={this.onSuccess.bind(this)}
            maintain_item={this.props.maintain_item}
            customer_id={this.props.customer_id}
            memberDetailList={this.props.memberDetailList}
            projectDisabled={true}
          />
        </Modal>
      </span>
    );
  }
}
