import React from 'react';
import { Button, Tabs } from 'antd';
import api from '../../../middleware/api';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import IndexTableFinancialPro from './IndexTableFinancialPro';
import IndexTableCarPro from './IndexTableCarPro';
import {
  get_marketList,
  get_marketProAllList,
  get_productDetail,
  post_marketProductOffline,
  post_marketProductOnline,
  setCarProPage,
  setFinancialProPage,
} from '../../../reducers/new-car/product/productActions';

const TabPane = Tabs.TabPane;

require('./index.less');

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hqOrOperate: false,
      skip: 0,
      limit: 15,
      status: '',
      resource_id: '',
      typeValue: 1,
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
    this.props.actions.get_marketList(0, '');
    const data = {
      skip: this.state.skip,
      limit: this.state.limit,
      status: this.state.status,
      resource_id: this.state.resource_id,
      type: this.state.typeValue,
    };
    this.get_marketProAllList(data);
  }

  get_marketProAllList = data => {
    this.props.actions.get_marketProAllList(data);
  };
  changeRocues = e => {
    this.setState({
      resource_id: e,
    });
    const data = {
      skip: this.state.skip,
      limit: this.state.limit,
      status: this.state.status,
      resource_id: e,
      type: this.state.typeValue,
    };
    this.get_marketProAllList(data);
  };
  changeStatus = e => {
    this.setState({
      status: e,
    });
    const data = {
      skip: this.state.skip,
      limit: this.state.limit,
      status: e,
      resource_id: this.state.resource_id,
      type: this.state.typeValue,
    };
    this.get_marketProAllList(data);
  };

  carProPageChange(page) {
    const { limit } = this.state;
    const data = {
      skip: (page - 1) * limit,
      limit: this.state.limit,
      status: this.state.status,
      resource_id: this.state.resource_id,
      type: this.state.typeValue,
    };
    this.setState({ skip: (page - 1) * limit });
    this.get_marketProAllList(data);
    this.props.actions.setCarProPage(page);
  }

  financialProPageChange(page) {
    const { limit } = this.state;
    const data = {
      skip: (page - 1) * limit,
      limit: this.state.limit,
      status: this.state.status,
      resource_id: this.state.resource_id,
      type: this.state.typeValue,
    };
    this.setState({ skip: (page - 1) * limit });
    this.get_marketProAllList(data);
    this.props.actions.setFinancialProPage(page);
  }

  callback = key => {
    this.setState({
      typeValue: key,
    });
    const data = {
      skip: this.state.skip,
      limit: this.state.limit,
      status: -2,
      resource_id: this.state.resource_id,
      type: key,
    };
    this.get_marketProAllList(data);
  };

  productOffline(product_id) {
    this.props.actions.post_marketProductOffline(product_id, this.refresh.bind(this));
  }

  productOnline(product_id) {
    this.props.actions.post_marketProductOnline(product_id, this.refresh.bind(this));
  }

  refresh() {
    const data = {
      skip: this.state.skip,
      limit: this.state.limit,
      status: this.state.status,
      resource_id: this.state.resource_id,
      type: this.state.typeValue,
    };
    this.get_marketProAllList(data);
  }

  render() {
    const operations = <Link
      to={{ pathname: `/new-car/product/addProduct/${this.state.typeValue}` }}
      target="_blank">
      <Button type="primary">{this.state.typeValue == 1 ? '创建车型产品' : '创建金融产品'}</Button></Link>;
    return (
      <div className="pro_header_hei">
        <Tabs defaultActiveKey="1" onChange={this.callback} tabBarExtraContent={operations}>
          <TabPane tab="车型产品" key="1">
            <IndexTableCarPro
              changeRocues={this.changeRocues}
              changeStatus={this.changeStatus}
              typeValue={this.state.typeValue}
              getMarketListData={this.props.getMarketListData}
              getMarketProAllListData={this.props.getMarketProAllListData}
              hqOrOperate={this.state.hqOrOperate}
              post_marketProductOffline={this.productOffline.bind(this)}
              post_marketProductOnline={this.productOnline.bind(this)}
              get_productDetail={product_id => {
                this.props.actions.get_productDetail(product_id);
              }}
              getProductDetailRes={this.props.getProductDetailRes}
              setPage={this.carProPageChange.bind(this)}
              page={this.props.carProPage}
              isFetching={this.props.isFetching}
            />
          </TabPane>
          <TabPane tab="金融产品" key="2">
            <IndexTableFinancialPro
              changeRocues={this.changeRocues}
              changeStatus={this.changeStatus}
              typeValue={this.state.typeValue}
              getMarketListData={this.props.getMarketListData}
              getMarketProAllListData={this.props.getMarketProAllListData}
              hqOrOperate={this.state.hqOrOperate}
              get_productDetail={product_id => {
                this.props.actions.get_productDetail(product_id);
              }}
              getProductDetailRes={this.props.getProductDetailRes}
              setPage={this.financialProPageChange.bind(this)}
              page={this.props.financialProPage}
              post_marketProductOffline={this.productOffline.bind(this)}
              post_marketProductOnline={this.productOnline.bind(this)}
              isFetching={this.props.isFetching}
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
    getMarketProAllListData,
    isFetching,
    postMarketProductOfflineRes,
    postMarketProductOnlineRes,
    getProductDetailRes,
    isLoading,
    carProPage,
    financialProPage,
  } = state.productDate;
  return {
    getMarketListData,
    getMarketProAllListData,
    isFetching,
    postMarketProductOfflineRes,
    postMarketProductOnlineRes,
    getProductDetailRes,
    isLoading,
    carProPage,
    financialProPage,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      get_marketList,
      get_marketProAllList,
      post_marketProductOffline,
      post_marketProductOnline,
      get_productDetail,
      setCarProPage,
      setFinancialProPage,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
