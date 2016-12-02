import React from 'react'
import {Row, Col} from 'antd'
import NewInsuranceModal from '../../modals/presales/NewInsuranceModal'
import EditInsuranceModal from '../../modals/presales/EditInsuranceModal'

export default class InsuranceInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let auto = this.props.auto, auto_id = this.props.idAuto, customer_id = this.props.id;
    let content = [], action = [];
    if (auto == undefined) {
      action = <NewInsuranceModal customer_id={customer_id} user_auto_id={auto_id} isSingle={true}/>
      content = <Row type="flex" className="info-row"><Col span="24">暂无信息,请完善</Col></Row>
    } else {
      action = <EditInsuranceModal customer_id={customer_id} user_auto_id={auto_id}/>
      content = (
        <div>
          <Row type="flex" className="info-row">
            <Col span="6">被保人：{auto.insured_person}</Col>
            <Col span="6">保险单号：{auto.insurance_num}</Col>
            <Col span="6">保险公司：{auto.insurance_company}</Col>
          </Row>
          <Row type="flex" className="info-row">
            <Col span="6" offset="6">车船税(元)：{auto.usage_tax}</Col>
            <Col span="6">交强险(元)：{auto.traffic_insurance}</Col>
          </Row>

          <Row type="flex" className="info-row">
            <Col span="6" offset="6">商业险单号：{auto.ci_insurance_num}</Col>
            <Col span="6">商业险保险公司: {auto.ci_insurance_company}</Col>
          </Row>

          <Row type="flex" className="info-row">
            <Col span="6">商业险总额: {auto.ci_total}元</Col>
            <Col span="18">商业险内容：{auto.ci_content}</Col>
          </Row>

          <Row type="flex" className="info-row">
            <Col span="6">保险总额: {auto.total}元</Col>
            <Col span="6">保险期限：{auto.start_date} 至 {auto.end_date}</Col>
          </Row>

          <Row type="flex" className="padding-l-20 padding-r-20">
            <Col span="12">备注：{auto.remark}</Col>
          </Row>
        </div>
      )
    }

    return (
      <div className="info-board">
        <Row type="flex" className="info-row">
          <Col span="6" className="font-size-18">保险信息</Col>
          <Col span="6" offset="12">
            {action}
          </Col>
        </Row>
        {content}
      </div>
    );
  }
}
