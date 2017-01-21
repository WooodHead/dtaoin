import React from 'react';
import {Modal, Icon, Button} from 'antd';
import BaseModal from '../../components/base/BaseModal';
import NewCompanyForm from './NewForm';

export default class New extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {visible: false};
  }

  render() {
    return (
      <span>
        <Button
          type="primary"
          onClick={this.showModal}
          className="pull-right"
        >
          创建门店
        </Button>

        <Modal
          title={<span><Icon type="plus"/> 创建门店</span>}
          visible={this.state.visible}
          width="960px"
          onCancel={this.hideModal}
          footer={null}>
          <NewCompanyForm cancelModal={this.hideModal}/>
        </Modal>
      </span>
    );
  }
}