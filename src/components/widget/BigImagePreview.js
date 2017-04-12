import React from 'react';
import {Modal} from 'antd';

import BaseModal from '../../components/base/BaseModal';

export default class BigImagePreview extends BaseModal {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };
  }

  render() {
    let {url} = this.props;

    return (
      <div>
        <img
          src={url}
          width={120}
          height={100}
          alt="聊天内容"
          onClick={this.showModal}
          style={{cursor: 'pointer'}}
        />

        <Modal
          title="图片预览"
          visible={this.state.visible}
          width={960}
          className="ant-modal-full"
          onCancel={this.hideModal}
          footer={null}
        >
          <img className="image-preview" src={url} alt="图片预览"/>
        </Modal>
      </div>
    );
  }
}
