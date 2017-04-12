import React from 'react';
import {Row, Col, Modal, Button} from 'antd';

import InsuranceDetailList from './InsuranceDetailList';

import BaseModal from '../../components/base/BaseModal';

import api from '../../middleware/api';

export default class InsuranceDetail extends BaseModal {

  constructor(props) {
    super(props);
    this.state = {
      showInsuranceList: false,
      insurance: null,
      visible: false,
    };

    [
      'toggleModalState',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    if (this.props.customerId && this.props.autoId && !this.state.insurance) {
      this.getInsuranceDetail(this.props.customerId, this.props.autoId);
    }
  }

  componentWillReceiveProps(props) {
    if (props.customerId && props.autoId && !this.state.insurance) {
      this.getInsuranceDetail(props.customerId, props.autoId);
    }
  }

  getInsuranceDetail(customerId = '', autoId = '') {
    let url = api.presales.getInsuranceDetail(customerId, autoId);
    api.ajax({url}, (data) => {
      let insurance = data.res.detail;
      if (insurance) {
        try {
          insurance.insurance_detail = JSON.parse(insurance.insurance_detail);
        } catch (e) {
          insurance.insurance_detail = {};
        }
      }
      this.setState({insurance: insurance});
    });
  }

  toggleModalState() {
    this.setState({
      showInsuranceList: !this.state.showInsuranceList,
    });
  }

  render() {
    const insurance = this.state.insurance || {};
    const showInsuranceList = this.state.showInsuranceList;
    let {visible} = this.state;

    let content = null;
    if (!insurance) {
      content = <Row type="flex" className="info-row"><Col span={24}>暂无保险信息</Col></Row>;
    } else {
      content = (
        <div>
          <div className="with-bottom-divider">
            <Row className="mb10">
              <Col span={24}><span className="text-gray label">品牌型号</span>{insurance.model_name}</Col>
            </Row>
            <Row>
              <Col span={12}><span className="text-gray label">车主姓名</span>{insurance.license_owner}</Col>
              <Col span={12}><span className="text-gray label">注册日期</span>{insurance.register_date}</Col>
            </Row>
          </div>
          <div className="with-bottom-divider">
            <Row className="mb10 mt20">
              <Col span={12}><span className="text-gray label">上年承保公司</span>{insurance.insurance_company}</Col>
              <Col span={12}><span className="text-gray label">交强险到期</span>{insurance.force_expire_date}</Col>
            </Row>
            <Row>
              <Col span={12}><span className="text-gray label">商业险到期</span>{insurance.business_expire_date}</Col>
              <Col span={12}><span className="text-gray label">上年投保险种</span><a href="javascript:;" onClick={this.toggleModalState}>查看</a></Col>
            </Row>
          </div>
          <div className="with-bottom-divider">
            <Row className="mb10 mt20">
              <Col span={12}><span className="text-gray label">被保人姓名</span>{insurance.insured_name}</Col>
              <Col span={12}><span className="text-gray label">被保人证件类型</span>{insurance.insured_id_type}</Col>
            </Row>
            <Row>
              <Col span={24}><span className="text-gray label">证件号码</span>{insurance.insured_id_card}</Col>
            </Row>
          </div>

          {
            showInsuranceList
              ?
              <InsuranceDetailList
                data={insurance.insurance_detail}
                onCancel={this.toggleModalState}
              />
              :
              null
          }
        </div>
      );
    }

    return (
      <div>
        <Button
          type="dash"
          onClick={this.showModal}
        >
          保险信息
        </Button>

        <Modal
          visible={visible}
          title="保险信息"
          onCancel={this.hideModal}
          footer={null}
          width="720px"
        >
          <Row>
            {content}
          </Row>
        </Modal>
      </div>
    );

  }
}
