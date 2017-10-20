import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import { login } from '../../../reducers/auth/authActions';
import HQBasicInformation from './HQBasicInformation';
import HQRiskControlRequirement from './HQRiskControlRequirement';
import HQFinancingInformation from './HQFinancingInformation';
import HQMaterialSetting from './HQMaterialSetting';

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
} from '../../../reducers/new-car/product/productActions';

class AddProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBinkingOrModule: '1',
      product_id: '',
      activeKey: '1',
    };
  }

  componentDidMount() {
    this.get_marketList();
  }

  get_marketList = () => {
    this.props.actions.get_marketList(0, '-1');
  };
  post_markertProductCreate = values => {
    this.props.actions.post_markertProductCreate(values, this.handleTableClick.bind(this));
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
  get_marketMaterialListData = value => {
    this.props.actions.get_marketMaterialListData(0, -1, value);
  };
  post_market_edit_material = data => {
    this.props.actions.post_market_edit_material(data);
  };

  handleTableClick(value) {
    this.setState({ activeKey: value });
  }

  render() {
    const { activeKey } = this.state;

    return (
      <div className="newCar_product">
        <Tabs
          activeKey={activeKey}
          onTabClick={this.handleTableClick.bind(this)}
          type="card"
        >
          <TabPane tab="基本信息" key="1">
            <HQBasicInformation
              getMarketListData={this.props.getMarketListData}
              postProductCreateRes={this.props.postProductCreateRes}
              post_markertProductCreate={this.post_markertProductCreate}
              postMarkertResourceCreateRes={this.props.postMarkertResourceCreateRes}
              post_markertResourceCreate={data => {
                this.props.actions.post_markertResourceCreate(data);
              }}
              get_marketList={this.get_marketList}
              get_marketMaterialListData={this.get_marketMaterialListData}
              getProductDetailRes={this.props.getProductDetailRes}
              typeValue={this.props.match.params.id}
            />
          </TabPane>
          <TabPane tab="风控要求" key="2"
                   disabled={!!(this.props.postProductCreateRes == '' || null)}
          >
            <HQRiskControlRequirement
              post_markertPeditRisk={this.post_markertPeditRisk}
              postProductCreateRes={this.props.postProductCreateRes}
              typeValue={this.props.match.params.id}
            />
          </TabPane>
          <TabPane tab="融资信息" key="3"
                   disabled={!!(this.props.postProductCreateRes == '' || null)}
          >
            <HQFinancingInformation
              postProductCreateRes={this.props.postProductCreateRes}
              post_markertDitAmountFixFinance={this.post_markertDitAmountFixFinance}
              postMarkertDitAmountFixFinanceRes={this.props.postMarkertDitAmountFixFinanceRes}
              post_markertEditLoanFinance={this.post_markertEditLoanFinance}
              postMarkertPeditRiskRes={this.props.postMarkertPeditRiskRes}
              typeValue={this.props.match.params.id}
            />
          </TabPane>
          <TabPane tab="材料设置" key="4"
                   disabled={!!(this.props.postProductCreateRes == '' || null)}
          >
            <HQMaterialSetting
              getMarketMaterialListData={this.props.getMarketMaterialListData}
              post_market_edit_material={this.post_market_edit_material}
              postProductCreateRes={this.props.postProductCreateRes}
              product_id={this.state.product_id}
              postMarketEditMaterialRes={this.props.postMarketEditMaterialRes}
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
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddProduct);
