import React from 'react'
import {Button, Modal, Icon} from 'antd'
import BaseModal from '../../../components/base/BaseModal'
import EditPartBasicForm from '../../../components/forms/aftersales/EditPartBasicForm'

export default class EditPartsBasicModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    }
  }

  render() {
    const {visible}=this.state;
    const formProps = {
      partId: this.props.partId,
      cancelModal: this.hideModal,
    };

    return (
      <span>
        <Button
          type="primary"
          onClick={this.showModal}
          className="margin-right-10"
        >
          编辑
        </Button>
        <Modal
          title={<span><Icon type="plus" class="margin-right-10"/>编辑配件信息</span>}
          visible={visible}
          width="50%"
          onCancel={this.hideModal}
          footer={null}
        >
          <div className="mt15">
            <EditPartBasicForm {...formProps}/>
          </div>
        </Modal>
      </span>
    )
  }
}
