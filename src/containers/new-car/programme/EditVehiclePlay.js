import React from 'react';
import { Tabs } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import EditVehiPlayChildren from './EditVehiPlayChildren';
import {
  get_marketProAllList,
  get_marketMaterialListData,
} from '../../../reducers/new-car/product/productActions';
import {
  get_brands,
  get_seriesByBrand,
  get_typesBySeries,
  post_createLoanPlan,
  post_createAutoType,
  get_planDetail,
  post_editAmountFixPlan,
} from '../../../reducers/new-car/programe/programeActions';

class EditVehiclePlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVehicleOrFinancial: false,
      skip: 0,
      limit: 20,
      status: -2,
      resource_id: '',
      type: 1,
      plan_id:'',
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
  }
  get_marketProAllList(data) {
    this.props.actions.get_marketProAllList(data);
  }
  componentDidMount() {
    this.setState({
      isVehicleOrFinancial: false,
    });
  }
  render() {
    return (
      <div>
        <EditVehiPlayChildren
          planId = {this.props.match.params.id}
          postCreateAmountFixPlanDataRes={this.props.postCreateAmountFixPlanDataRes}
          get_marketMaterialListData={(...rest) => {
            this.props.actions.get_marketMaterialListData(...rest);
          }}
          getMarketProAllListData={this.props.getMarketProAllListData}
          getBrandsData={this.props.getBrandsData}
          getSeriesByBrandData={this.props.getSeriesByBrandData}
          getTypesBySeriesData={this.props.getTypesBySeriesData}
          getMarketMaterialListData={this.props.getMarketMaterialListData}
          postCreateAmountFixPlanDataRes={this.props.postCreateAmountFixPlanDataRes}
          get_seriesByBrand={value => {
            this.props.actions.get_seriesByBrand(value);
          }}
          get_typesBySeriesData={value => {
            this.props.actions.get_typesBySeries(value);
          }}
          getPlanDetailData={this.props.getPlanDetailData}
          post_editAmountFixPlan={data => {
            this.props.actions.post_editAmountFixPlan(data);
          }}
          post_createAutoType={(data,callback) => {
            this.props.actions.post_createAutoType(data,callback);
          }}
          postEditAmountFixPlanRes={this.props.postEditAmountFixPlanRes}
          plan_id={this.state.plan_id}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { getMarketProAllListData, getMarketMaterialListData } = state.productDate;
  const { getBrandsData, getSeriesByBrandData, getTypesBySeriesData, postCreateLoanPlanDataRes, postCreateAmountFixPlanDataRes, postEditAmountFixPlanRes, getPlanDetailData } = state.programeData;
  return {
    getMarketProAllListData,
    getBrandsData,
    getSeriesByBrandData,
    getTypesBySeriesData,
    postCreateLoanPlanDataRes,
    postCreateAmountFixPlanDataRes,
    getMarketMaterialListData,
    getPlanDetailData,
    postEditAmountFixPlanRes,
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
      post_createAutoType,
      get_marketMaterialListData,
      get_planDetail,
      post_editAmountFixPlan,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditVehiclePlay);
