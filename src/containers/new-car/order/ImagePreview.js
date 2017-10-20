import React from 'react';
import { Modal, Row } from 'antd';

import BaseModal from '../../../components/base/BaseModal';

import imgLoadingFailed from '../../../images/imgLoadingFailed.jpg';

require('./basic-info.less');

export default class ImagePreviewModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      content: [],
    };
    [
      'getImgUrl',
      'handleImgError',
      'savePic',
    ].map(method => this[method] = this[method].bind(this));
  }

  getPic(pic, title) {
    this.props.getPic(pic, this.savePic, title);
  }

  savePic(url, title) {
    this.setState({ [title]: url });
  }

  handleDownload(pics) {
    const picsArr = pics.split(',');
    picsArr.forEach(item => {
      const a = document.createElement('a');

      a.setAttribute('href', this.state[item]);
      a.setAttribute('download', '-');
      a.click();
    });
  }

  getImgUrl() {
    const { record } = this.props;

    let content = [];
    try {
      content = JSON.parse(record.content);
    } catch (e) {
      return false;
    }

    content.forEach(item => {
      try {
        const pics = item.upload_pics.split(',');
        item.index = [];
        pics.forEach(pic => {
          this.getPic(pic, pic);
          item.index.push(pic);
        });
      } catch (e) {
      }
    });

    this.setState({ content });
    this.showModal();
  }

  handleImgError(e) {
    // 获取当前是第几张图片
    const key = e.target.title;
    e.target.src = imgLoadingFailed;
    e.target.style.width = '60px';
    e.target.style.height = '40px';
    e.target.onerror = null;
  }

  render() {
    const { record, disabled } = this.props;
    const { content } = this.state;

    const self = this;
    return (
      <span>
        <a href="javascript:;" disabled={disabled} onClick={this.getImgUrl}>预览</a>

        <Modal
          title={`${record.material_name  }预览`}
          visible={this.state.visible}
          onCancel={this.hideModal}
          footer={null}
          width={720}
        >
          <div className="order-image-content">
          {
            content.map((item, index) => (
                <div key={`${item.title}${index}`} className="order-image-preview">
                  <Row>
                    <div className="title">
                      <span>{`${item.title  }:`}</span>
                      <a
                        className="ml20"
                        onClick={() => this.handleDownload(item.upload_pics)}
                      >
                        下载
                      </a>
                    </div>
                    {
                      !!item.index && item.index.map((i, index) => (
                        <span key={`${i}${index}`} className="img-content">
                          <img
                            src={self.state[i]}
                            alt={'暂未上传图片'}
                            title={index}
                            onError={this.handleImgError}
                            className="img"
                          />
                        </span>
                      ))
                    }
                  </Row>
                </div>
              ))
          }
          </div>
        </Modal>
      </span>
    );
  }
}
