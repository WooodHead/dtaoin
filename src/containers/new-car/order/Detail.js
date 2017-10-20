import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import React from 'react';
import { Tabs } from 'antd';

import BasicInfo from './BasicInfo';
import CarInfo from './CarInfo';
import ProfitInfo from './ProfitInfo';

import FinancingInfoFixed from './FinancingInfoFixed';
import FinancingInfoLoan from './FinancingInfoLoan';
import ApplicationInfo from './ApplicationInfo';
import InsuranceInfo from './InsuranceInfo';
import DealInfo from './DealInfo';

import {
  getOrdersDetail,
  getDealInfo,
  getInsurceCompany,
  getInsuranceConfig,
  getPic,

  setApplicationDownloadInfo,
  setDealDownloadInfo,
  setInsuranceListMap,

  submitCarInfo,
  submitFinancingInfo,
  submitInsuranceInfo,
  submitProfitInfo,

  jinJian,
  jinJianReject,
  jinJianPass,
  jinJianFail,
  qianDan,
  orderFinish,
} from '../../../reducers/new-car/order/detailActions';

const TabPane = Tabs.TabPane;

class Detail extends React.Component {
  constructor(props) {
    super(props);

    [
      'handleJinJian',
      'handleJinJianReject',
      'handleJinJianPass',
      'handleJinJianFail',
      'handleQianDan',
      'handleOrderFinish',
      'handleGetPic',
      'handleSubmitCarInfo',
      'handleSubmitFinancingInfo',
      'handleApplicationRowChange',
      'handleGetPic',
      'handleDealRowChange',
      'handleGetPic',
      'handleGetInsurceCompany',
      'handleGetInsuranceConfig',
      'handleSetInsuranceListMap',
      'handleSubmitInsuranceInfo',
      'handleSubmitProfitInfo',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentWillMount() {
    const { id } = this.props.match.params;
    this.props.actions.getOrdersDetail(id);
  }

  // todo 基本信息
  handleJinJian() {
    const { id } = this.props.match.params;
    this.props.actions.jinJian(id);
  }

  handleJinJianReject(reason) {
    const { id } = this.props.match.params;
    this.props.actions.jinJianReject(id, reason);
  }

  handleJinJianPass() {
    const { id } = this.props.match.params;
    this.props.actions.jinJianPass(id);
  }

  handleJinJianFail(reason) {
    const { id } = this.props.match.params;
    this.props.actions.jinJianFail(id, reason);
  }

  handleQianDan() {
    const { id } = this.props.match.params;
    this.props.actions.qianDan(id);
  }

  handleOrderFinish() {
    const { id } = this.props.match.params;
    this.props.actions.orderFinish(id);
  }

  handleGetPic(pic, callback, title) {
    this.props.actions.getPic(pic, callback, title);
  }

  // todo 车辆信息
  handleSubmitCarInfo(data) {
    this.props.actions.submitCarInfo(data);
  }

  // todo 融资信息
  handleSubmitFinancingInfo(data) {
    this.props.actions.submitFinancingInfo(data);
  }

  // todo 申请材料
  handleApplicationRowChange(selectedRows) {
    this.props.actions.setApplicationDownloadInfo(selectedRows);
  }

  // todo 交车材料

  handleDealRowChange(selectedRows) {
    this.props.actions.setDealDownloadInfo(selectedRows);
  }

  // todo 保险信息
  handleGetInsuranceConfig() {
    this.props.actions.getInsuranceConfig();
  }

  handleGetInsurceCompany() {
    this.props.actions.getInsurceCompany();
  }

  handleSetInsuranceListMap(detailMap) {
    this.props.actions.setInsuranceListMap(detailMap);
  }

  handleSubmitInsuranceInfo(data) {
    this.props.actions.submitInsuranceInfo(data);
  }

  // todo 收益信息
  handleSubmitProfitInfo(data) {
    this.props.actions.submitProfitInfo(data);
  }

  render() {
    const {
      detail,
      outColor,
      applicationMaterialList,
      pickupMaterialList,
      applicationDownloadInfo,
      dealDownloadInfo,
      profitTotal,
      insuranceCompanys,
      insuranceListMap,
      insuranceConfigMap,
      insuranceDetail,
      profitDetail,
    } = this.props;

    return (
      <div>
        <BasicInfo
          detail={detail}
          jinJian={this.handleJinJian}
          jinJianReject={this.handleJinJianReject}
          jinJianPass={this.handleJinJianPass}
          jinJianFail={this.handleJinJianFail}
          qianDan={this.handleQianDan}
          orderFinish={this.handleOrderFinish}
          getPic={this.handleGetPic}
        />
        <Tabs defaultActiveKey="1">
          <TabPane tab="车辆信息" key="1">
            <CarInfo
              outColor={outColor}
              detail={detail}
              submitCarInfo={this.handleSubmitCarInfo}
            />
          </TabPane>

          <TabPane tab="融资信息" key="2">
            {
              String(detail.product_type) === '1'
                ? <FinancingInfoFixed detail={detail} />
                : <FinancingInfoLoan
                  detail={detail}
                  submitFinancingInfo={this.handleSubmitFinancingInfo}
                />
            }
          </TabPane>

          <TabPane tab="申请材料" key="3">
            <ApplicationInfo
              rowSelectChange={this.handleApplicationRowChange}
              downloadInfo={applicationDownloadInfo}
              applicationMaterialList={applicationMaterialList}
              getPic={this.handleGetPic}
            />
          </TabPane>

          <TabPane tab="交车材料" key="4">
            <DealInfo
              pickupMaterialList={pickupMaterialList}
              rowSelectChange={this.handleDealRowChange}
              downloadInfo={dealDownloadInfo}
              getPic={this.handleGetPic}
            />
          </TabPane>

          <TabPane tab="保险信息" key="5" disabled={!detail.plate_num}>
            <InsuranceInfo
              detail={detail}
              listMap={insuranceListMap}
              insuranceConfigMap={insuranceConfigMap}
              insuranceDetail={insuranceDetail}
              insuranceCompanys={insuranceCompanys}

              getInsurceCompany={this.handleGetInsurceCompany}
              getInsuranceConfig={this.handleGetInsuranceConfig}
              setInsuranceListMap={this.handleSetInsuranceListMap}
              submitInsuranceInfo={this.handleSubmitInsuranceInfo}
            />
          </TabPane>

          <TabPane tab="收益信息" key="6">
            <ProfitInfo
              detail={detail}
              profitDetail={profitDetail}
              profitTotal={profitTotal}
              submitProfitInfo={this.handleSubmitProfitInfo}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { detail, outColor, applicationMaterialList, pickupMaterialList, applicationDownloadInfo, dealDownloadInfo, profitTotal, insuranceCompanys, insuranceListMap, insuranceConfigMap, insuranceDetail, profitDetail } = state.orderDetail;
  return {
    detail,
    outColor,
    applicationDownloadInfo,
    applicationMaterialList,
    pickupMaterialList,
    dealDownloadInfo,
    profitTotal,
    insuranceCompanys,
    insuranceListMap,
    insuranceConfigMap,
    insuranceDetail,
    profitDetail,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      getOrdersDetail,
      getDealInfo,
      getInsurceCompany,
      getInsuranceConfig,
      getPic,

      setApplicationDownloadInfo,
      setDealDownloadInfo,
      setInsuranceListMap,

      submitCarInfo,
      submitFinancingInfo,
      submitInsuranceInfo,
      submitProfitInfo,

      jinJian,
      jinJianReject,
      jinJianPass,
      jinJianFail,
      qianDan,
      orderFinish,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
