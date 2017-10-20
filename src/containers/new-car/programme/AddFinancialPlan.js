import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AddFinPlanChildren from './AddFinPlanChildren';
import {
  get_marketMaterialListData,
  get_marketProAllList,
  get_productDetail,
} from '../../../reducers/new-car/product/productActions';
import {
  get_brands,
  get_seriesByBrand,
  get_typesBySeries,
  post_createAmountFixPlan,
  post_createAutoType,
  post_createLoanPlan,
} from '../../../reducers/new-car/programe/programeActions';

class AddFinancialPlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVehicleOrFinancial: false,
      skip: 0,
      limit: '-1',
      status: '',
      resource_id: '',
      type: 2,
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
        <AddFinPlanChildren
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
          post_createAutoType={(data, callback) => {
            this.props.actions.post_createAutoType(data, callback);
          }}
          postCreateAutoTypeDataRes={this.props.postCreateAutoTypeDataRes}
          get_marketMaterialListData={data => {
            this.props.actions.get_marketMaterialListData(data);
          }}
          product_id={this.state.product_id}
          getProductDetailRes={this.props.getProductDetailRes}
          getPlanDetailData={this.propsgetPlanDetailData}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { getMarketProAllListData, getMarketMaterialListData, getProductDetailRes } = state.productDate;
  const { getBrandsData, getSeriesByBrandData, getTypesBySeriesData, postCreateLoanPlanDataRes, postCreateAmountFixPlanDataRes, postCreateAutoTypeDataRes, getPlanDetailData } = state.programeData;
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
      get_productDetail,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddFinancialPlan);
