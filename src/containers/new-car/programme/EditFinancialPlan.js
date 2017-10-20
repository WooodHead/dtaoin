import React from 'react';
import { Tabs } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import EditFinPlanChildren from './EditFinPlanChildren';
import {
  get_marketProAllList,
  get_marketMaterialListData,
} from '../../../reducers/new-car/product/productActions';
import {
  get_brands,
  get_seriesByBrand,
  get_typesBySeries,
  post_createLoanPlan,
  post_createAmountFixPlan,
  post_createAutoType,
  post_editLoanPlan,
  get_planDetail,
} from '../../../reducers/new-car/programe/programeActions';

class EditFinancialPlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVehicleOrFinancial: false,
      skip: 0,
      limit: -1,
      status: -2,
      resource_id: '',
      type: 2,
      plan_id: '',
    };
  }

  componentWillMount() {
    const data = {
      skip: this.state.skip,
      limit: this.state.limit,
      status: this.state.status,
      resource_id: this.state.resource_id,
      type: this.state.type,
    };
    this.get_marketProAllList(data);
    this.props.actions.get_brands();
    const plan_id = this.props.match.params;
    this.setState({
      plan_id: plan_id.id,
    });
    this.props.actions.get_planDetail(plan_id.id);
  }

  get_marketProAllList = data => {
    this.props.actions.get_marketProAllList(data);
  };
  componentDidMount() {
    this.setState({
      isVehicleOrFinancial: false,
    });
  }

  render() {
    return (
      <div>
        <EditFinPlanChildren
          getMarketProAllListData={this.props.getMarketProAllListData}
          getBrandsData={this.props.getBrandsData}
          get_marketProAllList={this.get_marketProAllList}
          getSeriesByBrandData={this.props.getSeriesByBrandData}
          get_seriesByBrand={value => {
            this.props.actions.get_seriesByBrand(value);
          }}
          getTypesBySeriesData={this.props.getTypesBySeriesData}
          get_typesBySeriesData={value => {
            this.props.actions.get_typesBySeries(value);
          }}
          post_createLoanPlan={data => {
            this.props.actions.post_createLoanPlan(data);
          }}
          postCreateLoanPlanDataRes={this.props.postCreateLoanPlanDataRes}
          post_createAutoType={(data,callback) => {
            this.props.actions.post_createAutoType(data,callback);
          }}
          postCreateAutoTypeDataRes={this.props.postCreateAutoTypeDataRes}
          post_editLoanPlan={data => {
            this.props.actions.post_editLoanPlan(data);
          }}
          postEditLoanPlanRes={this.props.postEditLoanPlanRes}
          plan_id={this.state.plan_id}
          getPlanDetailData={this.props.getPlanDetailData}
          get_marketMaterialListData={data => {
            this.props.actions.get_marketMaterialListData(data);
          }}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { getMarketProAllListData, getMarketMaterialListData } = state.productDate;
  const { getBrandsData, getSeriesByBrandData, getTypesBySeriesData, postCreateLoanPlanDataRes, postCreateAmountFixPlanDataRes, postCreateAutoTypeDataRes, postEditLoanPlanRes, getPlanDetailData } = state.programeData;
  return {
    getMarketProAllListData,
    getBrandsData,
    getSeriesByBrandData,
    getTypesBySeriesData,
    postCreateLoanPlanDataRes,
    postCreateAmountFixPlanDataRes,
    postCreateAutoTypeDataRes,
    getMarketMaterialListData,
    postEditLoanPlanRes,
    getPlanDetailData,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      get_marketProAllList,
      get_brands,
      get_seriesByBrand,
      get_typesBySeries,
      post_createLoanPlan,
      post_createAmountFixPlan,
      post_createAutoType,
      get_marketMaterialListData,
      post_editLoanPlan,
      get_planDetail,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditFinancialPlan);
