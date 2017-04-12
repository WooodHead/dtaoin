import React from 'react';
import {Row, Col, Modal, Icon, Button} from 'antd';

import BaseModal from '../../../components/base/BaseModal';

class NewDetails extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  render() {
    let {visible} = this.state;
    let {detail} = this.props;

    let title = `${detail.type_name}详情` || '详情';
    let payer = detail.type == 0 ? '付款方:' : '收款方:';
    let project = detail.type == 0 ? '收入项目:' : '支出项目:';
    return (
      <span>
        <a
          href="javascript:;"
          onClick={this.showModal}
        >
          查看详情
        </a>
        <Modal
          title={<span><Icon type="file-text" className="mr10"/>{title}</span>}
          visible={visible}
          width={'720px'}
          onCancel={this.hideModal}
          footer={<Button type="primary" size="large" onClick={this.hideModal}>确定</Button>}
        >
          <Row className="mb10">
            <Col span={4}><span>付款项目日期：</span></Col><Col span={8}><span>{detail.ctime}</span></Col>
            <Col span={4}><span>{project}</span></Col><Col span={8}><span>{detail.sub_type_name}</span></Col>
          </Row>
          <Row className="mb10">
            <Col span={4}><span>付款金额：</span></Col><Col span={8}><span>{detail.amount}</span></Col>
            <Col span={4}><span>付款方式：</span></Col><Col span={8}><span>{detail.pay_type_name}</span></Col>
          </Row>
          <Row className="mb10">
            <Col span={4}><span>{payer}</span></Col><Col span={8}><span>{detail.payer}</span></Col>
            <Col span={4}><span>经办人</span></Col><Col span={8}><span>{detail.user_name}</span></Col>
          </Row>
          <Row className="mb10">
            <Col span={4}><span>描述：</span></Col><Col span={8}><span>{detail.remark}</span></Col>
          </Row>

        </Modal>
      </span>
    );
  }
}

export default NewDetails;
