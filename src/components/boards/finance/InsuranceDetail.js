import React from 'react';
import {Link} from 'react-router';
import {Row, Col} from 'antd';
import api from '../../../middleware/api';
import InsuranceDetailList from '../../modals/finance/InsuranceDetailList';

export default class InsuranceDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    showInsuranceList: false,
      insurance: null,
    };

    ['toggleModalState'].map(method => this[method] = this[method].bind(this));
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
    let url = api.getInsuranceDetail(customerId, autoId);
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

    let content = null;
    if (!insurance) {
      content = <Row type="flex" className="info-row"><Col span={24}>暂无保险信息</Col></Row>;
    } else {
      content = (
        <div className="ant-table ant-table-middle ant-table-bordered">
          <div className="ant-table-body">
            <table>
              <tbody className="ant-table-tbody">
              <tr className="ant-table-row  ant-table-row-level-0">
                <td>品牌型号：{insurance.model_name}</td>
                <td>车主姓名：{insurance.license_owner}</td>
                <td>注册日期：{insurance.register_date}</td>
                <td/>
              </tr>
              <tr className="ant-table-row  ant-table-row-level-0">
                <td>上年承保公司：{insurance.insurance_company}</td>
                <td>交强险到期：{insurance.force_expire_date}</td>
                <td>商业险到期：{insurance.business_expire_date}</td>
                <td>上年投保险种：<Link onClick={this.toggleModalState}>查看</Link></td>
              </tr>
              <tr className="ant-table-row  ant-table-row-level-0">
                <td>被保人姓名：{insurance.insured_name}</td>
                <td>被保人证件类型：{insurance.insured_id_type}</td>
                <td>证件号码：{insurance.insured_id_card}</td>
                <td/>
              </tr>
              </tbody>
            </table>
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

    return content;
  }
}
