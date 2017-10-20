import React, { Component } from 'react';
import { Tabs } from 'antd';

import PartBasicInfo from './BasicInfo';
import OutStorageRecord from './OutStorageRecord';
import MaintenanceRecord from './MaintenanceRecord';

import api from '../../../middleware/api';
const TabPane = Tabs.TabPane;

export default class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id || '',
      detail: {},
    };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    const { id } = this.state;
    this.getPartDetail(id);
  }

  handleStatusChange() {
    this.getPartDetail(this.state.id);
  }

  getPartDetail(id) {
    api.ajax({ url: api.warehouse.part.detail(id) }, data => {
      this.setState({ detail: data.res.detail });
    });
  }

  render() {
    const { detail, id } = this.state;

    return (
      <div>
        <PartBasicInfo detail={detail} onStatusChange={this.handleStatusChange}/>

        <Tabs defaultActiveKey="1">
          <TabPane tab="维修使用记录" key="1">
            <MaintenanceRecord id={id}/>
          </TabPane>

          <TabPane tab="出入库记录" key="2">
            <OutStorageRecord id={id}/>
          </TabPane>
        </Tabs>


      </div>
    );
  }
}
