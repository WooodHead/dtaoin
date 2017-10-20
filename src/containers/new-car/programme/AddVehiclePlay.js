import React from 'react';
import { Tabs } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AddVehiPlayChildren from './AddVehiPlayChildren';
import {
  get_marketProAllList,
  get_marketMaterialListData,
  get_productDetail,
} from '../../../reducers/new-car/product/productActions';
import {
  get_brands,
  get_seriesByBrand,
  get_typesBySeries,
  post_createLoanPlan,
  post_createAmountFixPlan,
  post_createAutoType,
  get_marketPlanAllList,
} from '../../../reducers/new-car/programe/programeActions';

class AddVehiclePlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVehicleOrFinancial: false,
      skip: 0,
      limit: '',
      status: '',
      resource_id: '',
      type: 1,
      product_id: '',
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
    const product_id = this.props.match.params;
    if (product_id.id !== undefined) {
      this.setState({
        product_id: product_id.id,
      });
      this.props.actions.get_productDetail(product_id.id);
    }
  }

  componentDidMount() {
    this.setState({
      isVehicleOrFinancial: false,
    });
  }

  post_createAmountFixPlan = data => {
    this.props.actions.post_createAmountFixPlan(data);
  };

  get_marketProAllList(data) {
    this.props.actions.get_marketProAllList(data);
  }
  render() {
    return (
      <div>
        <AddVehiPlayChildren
          post_createAmountFixPlan={this.post_createAmountFixPlan}
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
          getProductDetailRes={this.props.getProductDetailRes}
          get_seriesByBrand={value => {
            this.props.actions.get_seriesByBrand(value);
          }}
          get_typesBySeriesData={value => {
            this.props.actions.get_typesBySeries(value);
          }}
          post_createAutoType={(data,callback) => {
            this.props.actions.post_createAutoType(data,callback);
          }}
          product_id={this.state.product_id}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { getMarketProAllListData, getMarketMaterialListData, getProductDetailRes } = state.productDate;
  const { getBrandsData, getSeriesByBrandData, getTypesBySeriesData, postCreateLoanPlanDataRes, postCreateAmountFixPlanDataRes, postCreateAutoTypeDataRes } = state.programeData;
  return {
    getMarketProAllListData,
    getBrandsData,
    getSeriesByBrandData,
    getTypesBySeriesData,
    postCreateLoanPlanDataRes,
    postCreateAmountFixPlanDataRes,
    postCreateAutoTypeDataRes,
    getMarketMaterialListData,
    getProductDetailRes,
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
      get_productDetail,
      get_marketPlanAllList,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddVehiclePlay);
