import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Row, Tabs } from 'antd';

import api from '../../middleware/api';
import path from '../../config/path';

import NewAutoModal from '../auto/NewAutoModal';
import InsuranceDetail from './InsuranceDetail';
import MaintenanceOfAuto from './MaintenanceOfAuto';
import EditAutoModal from '../auto/EditAutoModal';
import AutoInfo from './AutoInfo';

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
    this.checkPermission();
  }

  async checkPermission() {
    const hasInsurancePermission = await api.checkPermission(path.customer.insurance).catch(() => {
    });
    const hasDealPermission = await api.checkPermission(path.customer.deal).catch(() => {
    });
    const hasMaintenancePermission = await api.checkPermission(path.customer.maintenance)
      .catch(() => {
      });

    this.setState({
      insurancePermission: hasInsurancePermission,
      dealPermission: hasDealPermission,
      maintenancePermission: hasMaintenancePermission,
    });
  }

  render() {
    const TabPane = Tabs.TabPane;
    const { customerId } = this.props;
    const { autos } = this.props;
    const {
      insurancePermission,
      dealPermission,
      maintenancePermission,
    } = this.state;

    const tabPanes = [];

    autos.map((auto, index) => {
      const tabInfo = `${auto.plate_num}`;

      tabPanes.push(
        <TabPane tab={tabInfo} key={`${index + 1  }`}>
          <AutoInfo
            auto={auto}
            auto_id={auto._id}
            customer_id={customerId}
          />

          <div className={insurancePermission ? 'pull-left mt20' : 'hide'}>
            <InsuranceDetail customerId={customerId} autoId={auto._id} />
          </div>

          <div
            className={dealPermission && Number(auto.is_purchase) !== 0
              ? 'pull-left ml10 mt20'
              : 'hide'}
          >
            <Link
              to={{ pathname: `/presales/deal/new/${customerId}/${auto._id}/${auto.intention_id}` }}
              target="_blank"
            >
              <Button type="dash">成交记录</Button>
            </Link>
          </div>

          <div className={maintenancePermission ? 'pull-left ml10 mt20' : 'hide'}>
            <MaintenanceOfAuto auto_id={auto._id} customer_id={customerId} />
          </div>

          {/* <div className="pull-left ml10 mt20">
            <AutoTaskReminder auto={auto} />
          </div>*/}

          <div className="pull-left ml10 mt20">
            <EditAutoModal
              customer_id={customerId}
              auto_id={auto._id}
              onSuccess={this.props.editSuccess}
            />
          </div>
        </TabPane>,
      );
    });

    return (
      <div className="">
        <Row>
          <Col span={6}>
            <h3 className="mb20">车辆信息</h3>
          </Col>
          <Col span={18}>
            <span className="pull-right">
              <NewAutoModal customer_id={customerId} onSuccess={this.props.editSuccess} />
            </span>
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
