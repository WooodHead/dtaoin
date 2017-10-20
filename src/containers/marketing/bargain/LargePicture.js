import React from 'react';
import { Modal, Button, Icon } from 'antd';
import BaseModal from '../../../components/base/BaseModal';

const contentSamplePic = require('../../../images/content_sample_pic.png');

require('../bargain.less');

export default class EditCustomerModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = { visible: false };
  }

  render() {
    return (
      <div className="example-large">
        <p>示例</p>
        <p>建议上传服务，施工环境等优质图片，</p>
        <p>并辅之以简单的描述</p>
        <div className="pic" onClick={this.showModal}>
          <img src={contentSamplePic} className="img" />
        </div>
        <p>点击查看大图</p>
        <Modal
          visible={this.state.visible}
          width={671}
          onCancel={this.hideModal}
          footer={null}
        >
          <img src={contentSamplePic} style={{ width: '600px', height: '450px', margin: '20px' }} />
        </Modal>
      </div>
    );
  }
}
