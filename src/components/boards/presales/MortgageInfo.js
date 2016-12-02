import React from 'react'
import {Row, Col} from 'antd'
import EditLoanModal from '../../modals/presales/EditLoanModal'
import NewLoanModal from '../../modals/presales/NewLoanModal'

export default class MortgageInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let auto = this.props.auto, auto_id = this.props.idAuto, customer_id = this.props.id;
    let content = [], action = [];
    if (auto == undefined) {
      action = <NewLoanModal customer_id={customer_id} user_auto_id={auto_id} isSingle={true}/>
      content = <Row type="flex" className="info-row"><Col span="24">暂无信息,请完善</Col></Row>
    } else {
      action = <EditLoanModal customer_id={customer_id} user_auto_id={auto_id}/>
      content = (
        <div>
          <Row type="flex" className="info-row">
            <Col span="6">按揭年限：{auto.loan_years}</Col>
            <Col span="6">按揭银行：{auto.bank}</Col>
            <Col span="6">担保公司：{auto.guarantee_company}</Col>
            <Col span="6">签单日期：{auto.sign_date}</Col>
          </Row>
          <Row type="flex" className="info-row">
            <Col span="6">首付款(元)：{auto.pre_payment}</Col>
            <Col span="6">贷款金额(元)：{auto.bank_loan}</Col>
            <Col span="6">每月还款(元)：{auto.month_pay}</Col>
            <Col span="6">资料费(元)：{auto.material_fee}</Col>
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
          <Col span="6" className="font-size-18">按揭信息</Col>
          <Col span="6" offset="12">
            {action}
          </Col>
        </Row>
        {content}
      </div>
    );
  }
}
