import React from 'react';
import { Modal } from 'antd';

import api from '../../middleware/api';

import BaseModal from '../../components/base/BaseModal';

export default class BigImagePreview extends BaseModal {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      thumbnailUrl: '',
      originalUrl: '',
    };
  }

  componentDidMount() {
    const { fileType } = this.props;
    if (fileType) {
      this.getImageThumbnailUrl(fileType);
    }
  }

  showModal() {
    this.setState({ visible: true });
    const { fileType } = this.props;
    if (fileType) {
      this.getImageOriginalUrl(fileType);
    }
  }

  getImageThumbnailUrl(fileType) {
    api.ajax({ url: api.system.getQaPublicFileUrl(fileType, '2') }, data => {
      this.setState({ thumbnailUrl: data.res.url });
    });
  }

  getImageOriginalUrl(fileType) {
    api.ajax({ url: api.system.getQaPublicFileUrl(fileType, '0') }, data => {
      this.setState({ originalUrl: data.res.url });
    });
  }

  render() {
    return (
      <div>
        <img
          src={this.state.thumbnailUrl}
          width={120}
          height={100}
          alt="聊天内容"
          onClick={this.showModal}
          style={{ cursor: 'pointer' }}
        />

        <Modal
          title="图片预览"
          visible={this.state.visible}
          width={960}
          className="ant-modal-full"
          onCancel={this.hideModal}
          footer={null}
        >
          <img className="image-preview" src={this.state.originalUrl} alt="图片预览"/>
        </Modal>
      </div>
    );
  }
}
