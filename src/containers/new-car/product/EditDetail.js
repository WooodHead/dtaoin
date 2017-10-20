import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import { login } from '../../../reducers/auth/authActions';
import EditDetailBasicInformation from './EditDetailBasicInformation';
import EditDetailRiskControlRequirement from './EditDetailRiskControlRequirement';
import EditDetailFinancingInformation from './EditDetailFinancingInformation';
import EditDetailMaterialSetting from './EditDetailMaterialSetting';
import api from '../../../middleware/api';

const TabPane = Tabs.TabPane;
require('./index.less');
import {
  get_marketList,
  post_markertProductCreate,
  post_markertPeditRisk,
  post_markertDitAmountFixFinance,
  post_markertEditLoanFinance,
  get_marketMaterialListData,
  post_market_edit_material,
  post_markertResourceCreate,
  get_productDetail,
  post_markertProductEdit,
} from '../../../reducers/new-car/product/productActions';

class IndexHQ extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBinkingOrModule: 1,
      product_id: '',
      hqOrOperate: false,
    };
  }

  componentWillMount() {
    const product_id = this.props.match.params;
    this.setState({
      product_id: product_id.id,
    });
    this.props.actions.get_productDetail(product_id.id);
    const isRegionAdministrator = api.isRegionAdministrator();
    if (isRegionAdministrator) {
      this.setState({
        hqOrOperate: true,
      });
    }
  }

  componentDidMount() {
    this.get_marketList();
  }

  get_marketList = () => {
    this.props.actions.get_marketList(0, -1);
  };
  callback = tab => {
    console.log(tab);
  };
  post_markertProductCreate = values => {
    this.props.actions.post_markertProductCreate(values);
  };
  post_markertPeditRisk = data => {
    this.props.actions.post_markertPeditRisk(data);
  };
  post_markertDitAmountFixFinance = data => {
    this.props.actions.post_markertDitAmountFixFinance(data);
  };
  post_markertEditLoanFinance = data => {
    this.props.actions.post_markertEditLoanFinance(data);
  };
  get_marketMaterialListData = (...value) => {
    this.props.actions.get_marketMaterialListData(...value);
  };
  get_marketMaterialListData_resoursed = value => {
    this.props.actions.get_marketMaterialListData(0, -1, value);
  };
  post_market_edit_material = data => {
    this.props.actions.post_market_edit_material(data);
  };
  isBinkingOrModule = e => {
    this.setState({
      isBinkingOrModule: e,
    });
  };

  render() {
    return (
      <div className="newCar_product">
        <Tabs onChange={this.callback} defaultActiveKey="1" type="card" size="default">
          <TabPane tab="基本信息" key="1">
            <EditDetailBasicInformation
              getMarketListData={this.props.getMarketListData}
              postProductCreateRes={this.props.postProductCreateRes}
              post_markertProductCreate={this.post_markertProductCreate}
              postMarkertResourceCreateRes={this.props.postMarkertResourceCreateRes}
              post_markertResourceCreate={data => {
                this.props.actions.post_markertResourceCreate(data);
              }}
              get_marketList={this.get_marketList}
              isBinkingOrModule={this.isBinkingOrModule}
              getProductDetailRes={this.props.getProductDetailRes}
              hqOrOperate={this.state.hqOrOperate}
              post_markertProductEdit={this.props.actions.post_markertProductEdit}
              product_id={this.state.product_id}
              get_marketMaterialListData={this.get_marketMaterialListData}
              get_marketMaterialListData_resoursed={this.get_marketMaterialListData_resoursed}
            />
          </TabPane>
          <TabPane tab="风控要求" key="2">
            <EditDetailRiskControlRequirement
              post_markertPeditRisk={this.post_markertPeditRisk}
              postProductCreateRes={this.props.postProductCreateRes}
              isBinkingOrModule={this.isBinkingOrModule}
              getProductDetailRes={this.props.getProductDetailRes}
              hqOrOperate={this.state.hqOrOperate}
              product_id={this.state.product_id}
            />
          </TabPane>
          <TabPane tab="融资信息" key="3">
            <EditDetailFinancingInformation
              postProductCreateRes={this.props.postProductCreateRes}
              post_markertDitAmountFixFinance={this.post_markertDitAmountFixFinance}
              postMarkertDitAmountFixFinanceRes={this.props.postMarkertDitAmountFixFinanceRes}
              post_markertEditLoanFinance={this.post_markertEditLoanFinance}
              postMarkertPeditRiskRes={this.props.postMarkertPeditRiskRes}
              isBinkingOrModule={this.state.isBinkingOrModule}
              isBinkingOrModule={this.isBinkingOrModule}
              getProductDetailRes={this.props.getProductDetailRes}
              hqOrOperate={this.state.hqOrOperate}
              product_id={this.state.product_id}
            />
          </TabPane>
          <TabPane tab="材料设置" key="4">
            <EditDetailMaterialSetting
              get_marketMaterialListData={this.get_marketMaterialListData}
              getMarketMaterialListData={this.props.getMarketMaterialListData}
              post_market_edit_material={this.post_market_edit_material}
              postMarketEditMaterialRes={this.props.postMarketEditMaterialRes}
              getProductDetailRes={this.props.getProductDetailRes}
              productInfo={this.props.productInfo}
              hqOrOperate={this.state.hqOrOperate}
              product_id={this.state.product_id}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {
    getMarketListData,
    postProductCreateRes,
    postMarkertPeditRiskRes,
    postMarkertDitAmountFixFinanceRes,
    postMarkertEditLoanFinanceRes,
    getMarketMaterialListData,
    postMarketEditMaterialRes,
    postMarkertResourceCreateRes,
    postFinancingInformationRes,
    getProductDetailRes,
    productInfo,
  } = state.productDate;
  return {
    getMarketListData,
    postProductCreateRes,
    postMarkertPeditRiskRes,
    postMarkertDitAmountFixFinanceRes,
    postMarkertEditLoanFinanceRes,
    getMarketMaterialListData,
    postMarketEditMaterialRes,
    postMarkertResourceCreateRes,
    postFinancingInformationRes,
    getProductDetailRes,
    productInfo,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      get_marketList,
      post_markertProductCreate,
      post_markertPeditRisk,
      post_markertDitAmountFixFinance,
      post_markertEditLoanFinance,
      get_marketMaterialListData,
      post_market_edit_material,
      post_markertResourceCreate,
      get_productDetail,
      post_markertProductEdit,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IndexHQ);
