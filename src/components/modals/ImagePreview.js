import React from 'react';
import {Modal, Button} from 'antd';
import BaseModal from '../base/BaseModal';
import api from '../../middleware/api';

import imgLoadingFailed from '../../images/imgLoadingFailed.jpg';

export default class ImagePreviewModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
      url0: '',
      loadImgDisabled: false,
    };
    [
      'getImgUrl',
      'handleImgError',
    ].map((method) => this[method] = this[method].bind(this));
  }

  getImgUrl() {
    let {images} = this.props;
    images.map((img, index) => {
      api.ajax({url: img.url}, (data) => {
        this.setState({
          [`url${index}`]: data.res.url,
        });
      });

      this.showModal();
    });
  }

  handleImgError(e) {
    //获取当前是第几张图片
    let key = e.target.title;
    e.target.src = imgLoadingFailed;
    e.target.style.width = '60px';
    e.target.style.height = '40px';
    e.target.onerror = null;
    this.setState({
      [`loadImgDisabled${key}`]: true,
    });
  }

  render() {
    let {title, disabled, images} = this.props;

    return (
      <span className="margin-left-20">
        <Button
          type="dashed"
          onClick={this.getImgUrl}
          size="small"
          disabled={disabled}
        >
          预览
        </Button>
        <Modal
          title={title}
          visible={this.state.visible}
          onCancel={this.hideModal}
          footer={null}>
          {images.map((img, index) => {
            let imgUrl = this.state[`url${index}`];
            let loadImgDisabled = this.state[`loadImgDisabled${index}`] || false;
            return (
              <div key={index}>
                <figure>
                  <figcaption>{img.title}</figcaption>
                  {imgUrl ? <img key={index} src={imgUrl} alt={'暂未上传图片'} title={index} onError={this.handleImgError}/> : '暂未上传图片'}
                </figure>
                <a href={imgUrl} disabled={loadImgDisabled} download={`${img.title}.jpg`}>下载</a>
              </div>
            );
          })}
        </Modal>
      </span>
    );
  }
}
