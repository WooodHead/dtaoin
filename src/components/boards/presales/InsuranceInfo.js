import React from 'react';
import {Row, Col} from 'antd';
import NewInsuranceModal from '../../modals/presales/NewInsuranceModal';
import EditInsuranceModal from '../../modals/presales/EditInsuranceModal';

export default class InsuranceInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let auto = this.props.auto, auto_id = this.props.idAuto, customer_id = this.props.id;
    let content = [], action = [];
    if (auto == undefined) {
      action = <NewInsuranceModal customer_id={customer_id} auto_id={auto_id} isSingle={true}/>;
      content = <Row type="flex" className="info-row"><Col span={24}>暂无信息,请完善</Col></Row>;
    } else {
      action = <EditInsuranceModal customer_id={customer_id} auto_id={auto_id}/>;
      content = (
        <div className="ant-table ant-table-middle ant-table-bordered">
          <div className="ant-table-body">
            <table>
              <tbody className="ant-table-tbody">
              <tr className="ant-table-row  ant-table-row-level-0">
                <td>被保人：{auto.insured_person}</td>
                <td>保险单号：{auto.insurance_num}</td>
                <td>保险公司：{auto.insurance_company}</td>
              </tr>
              <tr className="ant-table-row  ant-table-row-level-0">
                <td/>
                <td>车船税(元)：{auto.usage_tax}</td>
                <td>交强险(元)：{auto.traffic_insurance}</td>
              </tr>
              <tr className="ant-table-row  ant-table-row-level-0">
                <td/>
                <td>商业险单号：{auto.ci_insurance_num}</td>
                <td>商业险保险公司: {auto.ci_insurance_company}</td>
              </tr>
              <tr className="ant-table-row  ant-table-row-level-0">
                <td>商业险总额: {auto.ci_total}元</td>
                <td colSpan="2">商业险内容：{auto.ci_content}</td>
              </tr>
              <tr className="ant-table-row  ant-table-row-level-0">
                <td>保险总额: {auto.total}元</td>
                <td colSpan="2">保险期限：{auto.start_date} 至 {auto.end_date}</td>
              </tr>
              <tr className="ant-table-row  ant-table-row-level-0">
                <td colSpan="3">备注：{auto.remark}</td>
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
          <Col span={6} className="font-size-18">保险信息</Col>
          <Col span={6} offset={12} className="text-right">
            {action}
          </Col>
        </Row>
        {content}
      </div>
    );
  }
}
