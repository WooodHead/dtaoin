import React from 'react';
import {Link} from 'react-router';
import {Tabs, Row, Col, Button} from 'antd';

import api from '../../middleware/api';
import path from '../../config/path';

import NewAutoModal from '../auto/NewAutoModal';
import InsuranceDetail from './InsuranceDetail';
import MaintenanceOfAuto from './MaintenanceOfAuto';
import EditAutoModal from '../auto/EditAutoModal';
import AutoInfo from './AutoInfo';
import AutoTaskReminder from './AutoTaskReminder';

export default class CustomerAutoTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      insurancePermission: false,
      dealPermission: false,
      maintenancePermission: false,
    };
  }

  componentDidMount() {
    this.getIsAuthorization();
  }

  async getIsAuthorization() {
    let hasInsurancePermission = await api.checkPermission(path.customer.information);
    let hasDealPermission = await api.checkPermission(path.customer.auto);
    let hasMaintenancePermission = await api.checkPermission(path.customer.intention);
    this.setState({
      insurancePermission: hasInsurancePermission,
      dealPermission: hasDealPermission,
      maintenancePermission: hasMaintenancePermission,
    });
  }

  render() {
    const TabPane = Tabs.TabPane;
    let {customerId} = this.props;
    let {autos} = this.props;
    let {
      insurancePermission,
      dealPermission,
      maintenancePermission,
    } = this.state;
    let tabPanes = [];

    autos.map(function (auto, index) {
      let tabInfo = `${auto.plate_num}`;

      tabPanes.push(
        <TabPane tab={tabInfo} key={index + 1 + ''}>

          <AutoInfo
            auto={auto}
            auto_id={auto._id}
            customer_id={customerId}
          />
          <div className={insurancePermission ? 'pull-left mt20' : 'hide'}>
            <InsuranceDetail customerId={customerId} autoId={auto._id}/>
          </div>

          <div
            className={dealPermission && Number(auto.is_purchase) !== 0 ? 'pull-left ml10 mt20' : 'hide'}>
            <Link
              to={{
                pathname: '/presales/deal/new',
                query: {customerId: customerId, autoId: auto._id, intentionId: auto.intention_id},
              }}
              target="_blank"
            >
              <Button type="dash">成交记录</Button>
            </Link>
          </div>

          <div className={maintenancePermission ? 'pull-left ml10 mt20' : 'hide'}>
            <MaintenanceOfAuto auto_id={auto._id} customer_id={customerId}/>
          </div>

          <div className="pull-left ml10 mt20">
            <AutoTaskReminder auto={auto}/>
          </div>

          <div className="pull-left ml10 mt20">
            <EditAutoModal customer_id={customerId} auto_id={auto._id}/>
          </div>
        </TabPane>
      );
    }.bind(this));

    return (
      <div className="">
        <Row>
          <Col span={6}>
            <h3 className="mb20">车辆信息</h3>
          </Col>
          <Col span={18}>
            <NewAutoModal customer_id={customerId}/>
          </Col>
        </Row>
        <Tabs
          type="card"
          defaultActiveKey="1"
        >
          {tabPanes}
        </Tabs>
      </div>
    );
  }
}
