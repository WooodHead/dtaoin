import React from 'react';
import {Tabs, Row, Col, Collapse} from 'antd';
import BaseCustomerInfo from '../BaseCustomerInfo';
import CustomerAutoSubtabs from './CustomerAutoSubtabs';
import NewAutoModal from '../../modals/aftersales/NewAutoModal';
import InsuranceDetail from '../finance/InsuranceDetail';
import ProjectsInfoOfAuto from '../../boards/aftersales/ProjectsInfoOfAuto';

const Panel = Collapse.Panel;

export default class CustomerAutoTabs extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const TabPane = Tabs.TabPane;
    let {customerId} = this.props;
    let {autos} = this.props;
    let dealInfos = [];
    let tabPanes = [];

    autos.map(function (auto, index) {
      let tabInfo = `车辆${index + 1}信息`;

      if (Number(auto.intention_id) === 0) {
        dealInfos =
          <div className="info-board">
            <Row type="flex" className="info-row">
              <Col span={24} className="c-grey-c">该车辆非本店售卖，无相关意向和交易信息</Col>
            </Row>
          </div>;
      } else {
        dealInfos = <CustomerAutoSubtabs idAuto={auto._id} id={customerId}/>;
      }

      tabPanes.push(
        <TabPane tab={tabInfo} key={index + 1 + ''}>

          <Collapse defaultActiveKey={['1', '4']}>
            <Panel header="基本信息" key="1">
              <BaseCustomerInfo
                auto={auto}
                auto_id={auto._id}
                customer_id={customerId}
              />
            </Panel>

            <Panel header="保险信息" key="2">
              <InsuranceDetail customerId={customerId} autoId={auto._id}/>
            </Panel>

            <Panel header="成交信息" key="3">
              {dealInfos}
            </Panel>

            <Panel header="维保信息" key="4">
              <ProjectsInfoOfAuto auto_id={auto._id} customer_id={customerId}/>
            </Panel>
          </Collapse>

        </TabPane>
      );
    }.bind(this));

    return (
      <div className="margin-top-40">
        <Tabs
          type="card"
          defaultActiveKey="1"
          tabBarExtraContent={
            <NewAutoModal customer_id={customerId}/>
          }
        >
          {tabPanes}
        </Tabs>
      </div>
    );
  }
}
