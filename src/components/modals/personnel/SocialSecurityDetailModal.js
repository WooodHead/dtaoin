import React from 'react'
import {Modal, Row, Col} from 'antd'
import BaseModal from '../../base/BaseModal'

export default class SocialSecurityDetailModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }

  render() {
    let {linkText, detail} = this.props,
      person = detail ? detail.person_detail : {},
      company = detail ? detail.company_detail : {};
    if (!detail) {
      return null;
    }

    return (
      <span>
        <a
          href="javascript:;"
          onClick={this.showModal}>
          {linkText}
        </a>
        <Modal
          title="五险一金缴纳明细"
          visible={this.state.visible}
          onCancel={this.hideModal}
          footer={null}>
          <Row className="mb15 border-bottom-ccc">
            <Col span="3" offset="3">养老保险</Col>
            <Col span="3">医疗保险</Col>
            <Col span="3">工伤保险</Col>
            <Col span="3">生育保险</Col>
            <Col span="3">失业保险</Col>
            <Col span="3">公积金</Col>
            <Col span="3">小计</Col>
          </Row>
          <Row className="mb5">
            <Col span="3">公司应缴</Col>
            <Col span="3">{company.pension}</Col>
            <Col span="3">{company.medical}</Col>
            <Col span="3">{company.injury}</Col>
            <Col span="3">{company.fertility}</Col>
            <Col span="3">{company.unemployment}</Col>
            <Col span="3">{detail.company_provident_fund_total}</Col>
            <Col span="3">{detail.company_security_total}</Col>
          </Row>
          <Row className="mb15 with-bottom-border">
            <Col span="3">个人应缴</Col>
            <Col span="3">{person.pension}</Col>
            <Col span="3">{person.medical}</Col>
            <Col span="3">{person.injury}</Col>
            <Col span="3">{person.fertility}</Col>
            <Col span="3">{person.unemployment}</Col>
            <Col span="3">{detail.person_provident_fund_total}</Col>
            <Col span="3">{detail.person_security_total}</Col>
          </Row>
        </Modal>
      </span>
    )
  }
}
