import React from 'react';
import {Row, Col, Modal, Icon, Button} from 'antd';

import BaseModal from '../../../components/base/BaseModal';

import api from '../../../middleware/api';

class EditStatus extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      visible: false,
      detail: {},
    };
  }

  showModal() {
    this.setState({visible: true});
    api.ajax({url: api.finance.fixedAssets.listById(this.state.id)}, function (data) {
      this.setState({detail: data.res.detail});
    }.bind(this));
  }

  render() {
    let {visible} = this.state;
    let {detail} = this.state;

    return (
      <span>
        <a href="javascript:;" onClick={this.showModal}>查看详情</a>

        <Modal
          title={<span><Icon type="file-text" className="mr10"/>资产详情</span>}
          visible={visible}
          width={'640px'}
          onCancel={this.hideModal}
          footer={<Button type="primary" size="large" onClick={this.hideModal}>确定</Button>}
        >
          <Row className="mb10">
            <Col span={4}><span>名称：</span></Col><Col span={8}><span>{detail.name}</span></Col>
            <Col span={4}><span>品牌型号：</span></Col><Col span={8}><span>{detail.brand}</span></Col>
          </Row>
          <Row className="mb10">
            <Col span={4}><span>购入单价：</span></Col><Col span={8}><span>{detail.unit_price}</span></Col>
            <Col span={4}><span>原值：</span></Col><Col span={8}><span>{detail.total_price}</span></Col>
          </Row>
          <Row className="mb10">
            <Col span={4}><span>正常：</span></Col><Col span={8}><span>{detail.zhengchang_count}</span></Col>
            <Col span={4}><span>维修</span></Col><Col span={8}><span>{detail.weixiu_count}</span></Col>
          </Row>
          <Row className="mb10">
            <Col span={4}><span>丢失：</span></Col><Col span={8}><span>{detail.diushi_count}</span></Col>
            <Col span={4}><span>报废：</span></Col><Col span={8}><span>{detail.baofei_count}</span></Col>
          </Row>
          <Row className="mb10">
            <Col span={4}><span>存放地点：</span></Col><Col span={8}><span>{detail.location}</span></Col>
            <Col span={4}><span>负责人：</span></Col><Col span={8}><span>{detail.incharge_user_name}</span></Col>
          </Row>
          <Row className="mb10">
            <Col span={4}><span>联系人：</span></Col><Col span={8}><span>{detail.supplier_name}</span></Col>
            <Col span={4}><span>联系电话：</span></Col><Col span={8}><span>{detail.supplier_phone}</span></Col>
          </Row>
          <Row className="mb10">
            <Col span={4}><span>供应商：</span></Col><Col span={8}><span>{detail.supplier_company}</span></Col>
            <Col span={4}><span>购入日期：</span></Col><Col span={8}><span>{detail.buy_date}</span></Col>
          </Row>
        </Modal>
      </span>
    );
  }
}

export default EditStatus;
