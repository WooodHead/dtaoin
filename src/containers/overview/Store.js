import React from 'react';
import {Row, Col, Form, Input, Select, Cascader} from 'antd';

import className from 'classnames';
import api from '../../middleware/api';

import BaseList from '../../components/base/BaseList';

import Table from './TableStore';
import CreateStore from './CreateStore';

const Search = Input.Search;
const Option = Select.Option;


class Store extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      page: 1,
      key: '',
      province: '',
      city: '',
      country: '',
      companyType: '',
      cooperationType: '',
      expireDay: '',
      advancedFilterVisible: false,
      companyList: [],
      reload: false,
    };

    [
      'handleSearchCompanyChange',
      'handleCompanyTypeChange',
      'handleCooperationTypeChange',
      'handleRegionChange',
      'handleHideFilter',
      'getRegin',
      'handleCreateStoreSuccess',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getProvinces();
  }

  handleSearchCompanyChange(e) {
    this.setState({key: e.target.value});
  }

  handleCooperationTypeChange(value) {
    this.setState({cooperationType: value});
  }

  handleCompanyTypeChange(value) {
    this.setState({companyType: value});
  }

  handleRegionChange(value) {
    this.setState({
      province: value[0] || '',
      city: value[1] || '',
      country: value[2] || '',
    });
  }

  handleHideFilter() {
    this.setState({advancedFilterVisible: !this.state.advancedFilterVisible});
  }

  handleCreateStoreSuccess() {
    this.setState({reload: true});
  }

  getProvinces() {
    api.ajax({url: api.system.getProvinces()}, data => {
      let provinces = data.res.province_list.map(item => {
        item.value = item.name;
        item.label = item.name;
        item.isLeaf = false;
        return item;
      });
      this.setState({options: provinces});
    });
  }

  getRegin(selectedOptions) {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    if (selectedOptions.length == 2) {
      //获取县
      api.ajax({url: api.system.getCountries(selectedOptions[0].name, selectedOptions[1].name)}, data => {
        targetOption.loading = false;
        targetOption.children = [];
        data.res.country_list.map(item => {
          item.value = item.name;
          item.label = item.name;
          targetOption.children.push(item);
        });

        this.setState({
          options: [...this.state.options],
        });
      });
    } else {
      //获取市
      api.ajax({url: api.system.getCities(targetOption.name)}, data => {
        targetOption.loading = false;
        targetOption.children = [];
        data.res.city_list.map(item => {
          item.value = item.name;
          item.label = item.name;
          item.isLeaf = false;
          targetOption.children.push(item);

        });
        this.setState({
          options: [...this.state.options],
        });
      });
    }
  }

  render() {
    let {options, page, advancedFilterVisible, reload} = this.state;

    const advancedFilter = className({
      'mb20': advancedFilterVisible,
      'hide': !advancedFilterVisible,
    });

    const triangle = className({
      'triangle': advancedFilterVisible,
      'triangle-handstand': !advancedFilterVisible,
    });

    return (
      <Form>
        <Row className="mb20">
          <Col span={10}>
            <span className="label">搜索</span>
            <Search
              onChange={this.handleSearchCompanyChange}
              size="large"
              style={{width: 220}}
              placeholder="请输入门店名称"
            />
            <span className={api.isSuperAdministrator() ? 'ml20' : 'hide'} onClick={this.handleHideFilter}>
              <a href="javascript:;">{advancedFilterVisible ? '隐藏' : '显示'}高级筛选</a>
              <div className={triangle}></div>
            </span>
          </Col>

          <Col span={14}>
              <span className={api.isSuperAdministrator() ? 'pull-right' : 'hide'}>
                <CreateStore onSuccess={this.handleCreateStoreSuccess}/>
              </span>
          </Col>
        </Row>
        <span className={api.isSuperAdministrator() ? '' : 'hide'}>
          <Row className={advancedFilter}>
            <Col span={20}>
              <span className="label">区域</span>
              <Cascader
                options={options}
                loadData={this.getRegin}
                onChange={this.handleRegionChange}
                changeOnSelect
                style={{width: 220}}
                placeholder="请选择地区"
              />

              <span className="label ml10">门店类型</span>
              <Select defaultValue="0" style={{width: 150}} onChange={this.handleCompanyTypeChange}>
                <Option value="0">全部类型</Option>
                <Option value="1">社区店</Option>
                <Option value="2">综合售后店</Option>
                <Option value="3">销售服务店</Option>
                <Option value="4">综合服务店</Option>
              </Select>

              <span className="label ml10">合作类型</span>
              <Select defaultValue="0" style={{width: 150}} onChange={this.handleCooperationTypeChange}>
                <Option value="0">全部类型</Option>
                <Option value="1">FC友情合作店</Option>
                <Option value="2">MC重要合作店</Option>
                <Option value="3">AP高级合伙店</Option>
                <Option value="4">TP顶级合伙店</Option>
              </Select>

            </Col>
          </Row>
        </span>
        <Table
          page={page}
          source={api.overview.companyList(this.state)}
          updateState={this.updateState}
          reload={reload}
        />
      </Form>
    );
  }
}

Store = Form.create()(Store);
export default Store;
