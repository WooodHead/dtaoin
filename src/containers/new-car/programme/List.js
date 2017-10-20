import React from 'react';
import { Button, Tabs } from 'antd';
import api from '../../../middleware/api';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ListFinancialProgram from './ListFinancialProgram';
import ListVehicleSchemeProgram from './ListVehicleSchemeProgram';
import { get_marketList } from '../../../reducers/new-car/product/productActions';
import {
  get_marketPlanAllList,
  get_planDetail,
  get_productListAll,
  post_marketPlanEditHot,
  post_marketPlanOffline,
  post_marketPlanOnline,
  setFinancialProgramPage,
  setVehicleSchemePage,
} from '../../../reducers/new-car/programe/programeActions';

const TabPane = Tabs.TabPane;

require('./index.less');

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hqOrOperate: false,
      skip: 0,
      limit: 15,
      status: '',
      resource_id: '',
      product_id: 0,
      guide_price: '',
      product_type: 1,
    };
  }

  componentDidMount() {
    const isSuperAdministrator = api.isSuperAdministrator();
    if (isSuperAdministrator) {
      this.setState({
        hqOrOperate: isSuperAdministrator,
      });
    }
    const isRegionAdministrator = api.isRegionAdministrator();
    if (isRegionAdministrator) {
      this.setState({
        hqOrOperate: false,
      });
    }
  }

  componentWillMount() {
    this.props.actions.get_productListAll(1);
    const data = {
      skip: this.state.skip,
      limit: this.state.limit,
      product_id: this.state.product_id,
      guide_price: this.state.guide_price,
      product_type: this.state.product_type,
      status: this.state.status,
    };
    this.get_marketPlanAllList(data);
  }

  get_marketPlanAllList = data => {
    this.props.actions.get_marketPlanAllList(data);
  };
  changeRocues = e => {
    const data = {
      skip: this.state.skip,
      limit: this.state.limit,
      product_id: e,
      guide_price: this.state.guide_price,
      product_type: this.state.product_type,
      status: this.state.status,
    };
    this.setState({
      product_id: e,
    });
    this.get_marketPlanAllList(data);
  };
  changeStatus = e => {
    const data = {
      skip: this.state.skip,
      limit: this.state.limit,
      product_id: this.state.product_id,
      guide_price: this.state.guide_price,
      product_type: this.state.product_type,
      status: e,
    };
    this.setState({
      status: e,
    });
    this.get_marketPlanAllList(data);
  };
  callback = key => {
    const data = {
      skip: this.state.skip,
      limit: this.state.limit,
      product_id: this.state.product_id,
      guide_price: this.state.guide_price,
      product_type: key,
      status: this.state.status,
    };
    this.setState({
      product_type: key,
    });
    this.get_marketPlanAllList(data);
    this.props.actions.get_productListAll(key);
  };

  vehicleSchemePageChange(page) {
    const { limit } = this.state;
    const data = {
      skip: (page - 1) * limit,
      limit: this.state.limit,
      product_id: this.state.product_id,
      guide_price: this.state.guide_price,
      product_type: this.state.product_type,
      status: this.state.status,
    };
    this.setState({ skip: (page - 1) * limit });
    this.get_marketPlanAllList(data);
    this.props.actions.setVehicleSchemePage(page);
  }

  financialProgramPageChange(page) {
    const { limit } = this.state;
    const data = {
      skip: (page - 1) * limit,
      limit: this.state.limit,
      product_id: this.state.product_id,
      guide_price: this.state.guide_price,
      product_type: this.state.product_type,
      status: this.state.status,
    };
    this.setState({ skip: (page - 1) * limit });
    this.get_marketPlanAllList(data);
    this.props.actions.setFinancialProgramPage(page);
  }

  refresh() {
    const data = {
      skip: this.state.skip,
      limit: this.state.limit,
      product_id: this.state.product_id,
      guide_price: this.state.guide_price,
      product_type: this.state.product_type,
      status: this.state.status,
    };
    this.get_marketPlanAllList(data);
  }

  marketPlanOffline(product_id) {
    this.props.actions.post_marketPlanOffline(product_id, this.refresh.bind(this));
  }

  marketPlanOnline(product_id) {
    this.props.actions.post_marketPlanOnline(product_id, this.refresh.bind(this));
  }

  marketPlanEditHot(data) {
    this.props.actions.post_marketPlanEditHot(data, this.refresh.bind(this));
  }

  render() {
    const operations = <span>
  	           {this.state.product_type == 1 ? <Link
                   to={{ pathname: '/new-car/programme-car/new/addVehiclePlay' }}
                   target="_blank">
                   <Button type="primary">创建车型方案</Button></Link>
                 : <Link
                   to={{ pathname: '/new-car/programme-car/new/addFinancialPlan' }}
                   target="_blank">
                   <Button type="primary">创建金融方案</Button></Link>}
  	            </span>;
    return (
      <div className="pro_header_hei">
        <Tabs defaultActiveKey="1" onChange={this.callback} tabBarExtraContent={operations}>
          <TabPane tab="车型方案" key="1">
            <ListVehicleSchemeProgram
              changeRocues={this.changeRocues}
              changeStatus={this.changeStatus}
              product_type={this.state.product_type}
              getMarketListData={this.props.getMarketListData}
              getMarketPlanAllListData={this.props.getMarketPlanAllListData}
              hqOrOperate={this.state.hqOrOperate}
              post_marketPlanEditHot={this.marketPlanEditHot.bind(this)}
              post_marketPlanOnline={this.marketPlanOnline.bind(this)}
              post_marketPlanOffline={this.marketPlanOffline.bind(this)}
              isFetching={this.props.isFetching}
              setPage={this.vehicleSchemePageChange.bind(this)}
              page={this.props.vehicleschemePage}
              getProductListAllData={this.props.getProductListAllData}
              get_planDetail={id => {
                this.props.actions.get_planDetail(id);
              }}
              getPlanDetailData={this.props.getPlanDetailData}
            />
          </TabPane>
          <TabPane tab="金融方案" key="2">
            <ListFinancialProgram
              changeRocues={this.changeRocues}
              changeStatus={this.changeStatus}
              product_type={this.state.product_type}
              getMarketListData={this.props.getMarketListData}
              getMarketPlanAllListData={this.props.getMarketPlanAllListData}
              hqOrOperate={this.state.hqOrOperate}
              post_marketPlanOnline={this.marketPlanOnline.bind(this)}
              post_marketPlanOffline={this.marketPlanOffline.bind(this)}
              getProductListAllData={this.props.getProductListAllData}
              isFetching={this.props.isFetching}
              setPage={this.financialProgramPageChange.bind(this)}
              page={this.props.financialProgramPage}
            />
          </TabPane>
        </Tabs>
      </div>

    );
  }
}

function mapStateToProps(state) {
  const { getMarketPlanAllListData, postMarketPlanEditHotRes, vehicleschemePage, financialProgramPage, getProductListAllData, getPlanDetailData, isFetching } = state.programeData;
  const { getMarketListData } = state.productDate;

  return {
    getMarketListData,
    isFetching,
    getMarketPlanAllListData,
    postMarketPlanEditHotRes,
    vehicleschemePage,
    getProductListAllData,
    financialProgramPage,
    getPlanDetailData,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      get_marketList,
      get_marketPlanAllList,
      post_marketPlanOnline,
      post_marketPlanOffline,
      post_marketPlanEditHot,
      setVehicleSchemePage,
      setFinancialProgramPage,
      get_productListAll,
      get_planDetail,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
