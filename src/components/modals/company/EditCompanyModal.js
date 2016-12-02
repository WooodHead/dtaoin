import React from 'react'
import {Modal, Icon, Button} from 'antd'
import BaseModal from '../../base/BaseModal'
import EditCompanyForm from '../../forms/company/EditCompanyForm'

export default class EditCompanyModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {visible: false};
  }

  render() {
    return (
      <span>
        <Button
          type="ghost"
          onClick={this.showModal}
          size="small"
          className="mr15">
          编辑门店
        </Button>

        <Modal
          title={<span><Icon type="edit"/> 编辑门店</span>}
          visible={this.state.visible}
          width="960px"
          onCancel={this.hideModal}
          footer={null}>
          <EditCompanyForm
            cancelModal={this.hideModal}
            company={this.props.company}
          />
        </Modal>
      </span>
    )
  }
}
