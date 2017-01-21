import React from 'react';
import {Row, Col} from 'antd';
import EditLoanModal from '../../modals/presales/EditLoanModal';
import NewLoanModal from '../../modals/presales/NewLoanModal';

export default class MortgageInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let auto = this.props.auto, auto_id = this.props.idAuto, customer_id = this.props.id;
    let content = [], action = [];
    if (auto == undefined) {
      action = <NewLoanModal customer_id={customer_id} auto_id={auto_id} isSingle={true}/>;
      content = <Row type="flex" className="info-row"><Col span={24}>暂无信息,请完善</Col></Row>;
    } else {
      action = <EditLoanModal customer_id={customer_id} auto_id={auto_id}/>;
      content = (
        <div className="ant-table ant-table-bordered">
          <div className="ant-table-body">
            <table>
              <tbody className="ant-table-tbody">
              <tr className="ant-table-row  ant-table-row-level-0">
                <td>按揭年限：{auto.loan_years}</td>
                <td>按揭银行：{auto.bank}</td>
                <td>担保公司：{auto.guarantee_company}</td>
                <td>签单日期：{auto.sign_date}</td>
              </tr>
              <tr className="ant-table-row  ant-table-row-level-0">
                <td>首付款(元)：{auto.pre_payment}</td>
                <td>贷款金额(元)：{auto.bank_loan}</td>
                <td>每月还款(元)：{auto.month_pay}</td>
                <td>资料费(元)：{auto.material_fee}</td>
              </tr>
              <tr className="ant-table-row  ant-table-row-level-0">
                <td colSpan="4">备注：{auto.remark}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return (
      <div className="margin-bottom-20">
        <Row>
          <Col span={6} className="font-size-18">按揭信息</Col>
          <Col span={6} offset={12} className="text-right">
            {action}
          </Col>
        </Row>
        {content}
      </div>
    );
  }
}
