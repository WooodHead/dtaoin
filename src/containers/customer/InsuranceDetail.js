import React from 'react';
import { Button, Col, Modal, Row } from 'antd';

import BaseModal from '../../components/base/BaseModal';

import api from '../../middleware/api';

import InsuranceItemDetail from './InsuranceItemDetail';

export default class InsuranceDetail extends BaseModal {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      showInsuranceList: false,
      insurance: null,
    };

    [
      'toggleModalState',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentWillReceiveProps(props) {
    if (props.customerId && props.autoId && !this.state.insurance) {
      this.getInsuranceDetail(props.customerId, props.autoId);
    }
  }

  showModal() {
    const { customerId, autoId } = this.props;
    if (customerId && autoId && !this.state.insurance) {
      this.getInsuranceDetail(customerId, autoId);
    }

    this.setState({ visible: true });
  }

  getInsuranceDetail(customerId = '', autoId = '') {
    api.ajax({ url: api.presales.getInsuranceDetail(customerId, autoId) }, data => {
      const insurance = data.res.detail;
      if (insurance) {
        try {
          insurance.insurance_detail = JSON.parse(insurance.insurance_detail);
        } catch (e) {
          insurance.insurance_detail = {};
        }
      }
      this.setState({ insurance });
    });
  }

  toggleModalState() {
    this.setState({
      showInsuranceList: !this.state.showInsuranceList,
    });
  }

  showModal() {
    this.setState({ visible: true });
    const { customerId, autoId } = this.props;
    if (customerId && autoId && !this.state.insurance) {
      this.getInsuranceDetail(customerId, autoId);
    }
  }

  render() {
    const insurance = this.state.insurance || {};
    const showInsuranceList = this.state.showInsuranceList;
    const { visible } = this.state;

    let content = null;
    if (!insurance || Object.keys(insurance).length === 0) {
      content = <Row type="flex" className="info-row"><Col span={24}>暂无保险信息</Col></Row>;
    } else {
      content = (
        <div>
          <div className="with-bottom-divider">
            <Row className="mb10">
              <Col span={24}>
                <span className="text-gray label">品牌型号</span>{insurance.model_name}
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <span className="text-gray label">车主姓名</span>{insurance.license_owner}
              </Col>
              <Col span={12}>
                <span className="text-gray label">注册日期</span>{insurance.register_date}
              </Col>
            </Row>
          </div>
          <div className="with-bottom-divider">
            <Row className="mb10 mt20">
              <Col span={12}>
                <span className="text-gray label">交强险承保公司</span>
                {insurance.force_company}
              </Col>
              <Col span={12}>
                <span className="text-gray label">交强险到期</span>{insurance.force_expire_date}
              </Col>
            </Row>
            <Row className="mb10 mt20">
              <Col span={12}>
                <span className="text-gray label">商业险承保公司</span>
                {insurance.business_company}
              </Col>
              <Col span={12}>
                <span className="text-gray label">商业险到期</span>{insurance.business_expire_date}
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <span className="text-gray label">商业险总额</span>
                <a href="javascript:;" onClick={this.toggleModalState}>查看投保险种</a>
              </Col>
            </Row>
          </div>
          <div className="with-bottom-divider">
            <Row className="mb10 mt20">
              <Col span={12}>
                <span className="text-gray label">被保人姓名</span>{insurance.insured_name}
              </Col>
              <Col span={12}><span
                className="text-gray label">被保人证件类型</span>{insurance.insured_id_type}
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <span className="text-gray label">证件号码</span>{insurance.insured_id_card}
              </Col>
            </Row>
          </div>

          {showInsuranceList
            ? (
              <InsuranceItemDetail
                data={insurance.insurance_detail}
                onCancel={this.toggleModalState}
              />
            )
            : null
          }
        </div>
      );
    }

    return (
      <span>
        {this.props.type === 'text'
          ? <a href="javascript:;" onClick={this.showModal}>保险信息</a>
          : <Button type="dash" onClick={this.showModal}>保险信息</Button>
        }

        <Modal
          visible={visible}
          title="保险信息"
          onCancel={this.hideModal}
          footer={null}
          width="720px"
        >
          <Row className="font-size-14">
            {content}
          </Row>
        </Modal>
      </span>
    );
  }
}
