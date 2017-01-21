import React from 'react';
import {Modal, Icon, Button, Form} from 'antd';
import api from '../../../middleware/api';
import BaseModal from '../../base/BaseModal';

class TransferDetailModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      pay_pic: this.props.pay_pic,
    };
  }

  componentDidMount() {
    this.getPrivatePicUrl(this.props.pay_pic);
  }

  getPrivatePicUrl(pay_pic) {
    api.ajax({
      url: api.system.getPrivatePicUrl(pay_pic),
    }, function (data) {
      this.setState({pay_pic_url: data.res.url});
    }.bind(this));
  }

  render() {
    const {visible} = this.state;

    return (
      <span>
        <Button
          type="primary"
          className="margin-left-20"
          onClick={this.showModal}
        >
          查看回单
        </Button>

        <Modal
          title={<span><Icon type="picture"/> 结算回单</span>}
          visible={visible}
          width="680px"
          onOk={this.hideModal}
          onCancel={this.hideModal}
        >
          <img src={this.state.pay_pic_url} className="response-img"/>
        </Modal>
      </span>
    );
  }
}

TransferDetailModal = Form.create()(TransferDetailModal);
export default TransferDetailModal;
