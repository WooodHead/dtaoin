import React from 'react';
import {Tabs, Row, Col} from 'antd';
import BasicInfo from '../BaseAutoInfo';
import OtherTabs from './CustomerAutoSubtabs';

export default class CustomerAutoTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customerId: props.id,
    };
  }

  render() {
    const TabPane = Tabs.TabPane;
    let {customerId} = this.state;
    let {autos} = this.props,
      dealInfos = [],
      tabPanes = [];

    autos.map(function (item, index) {
      let tabInfo = `车辆${index + 1}信息`;

      if (Number(item.intention_id) === 0) {
        dealInfos =
          <div className="info-board">
            <Row type="flex" className="info-row">
              <Col span={24} className="c-grey-c">该车辆非本店售卖，无相关意向和交易信息</Col>
            </Row>
          </div>;
      } else {
        dealInfos = <OtherTabs idAuto={item._id} id={customerId}/>;
      }

      tabPanes.push(
        <TabPane tab={tabInfo} key={index + 1 + ''}>
          <BasicInfo
            auto={item}
            auto_id={item._id}
            customer_id={customerId}
          />
          {dealInfos}
        </TabPane>
      );
    }.bind(this));

    return (
      <div className="margin-top-40">
        <Tabs defaultActiveKey="1" type="card">
          {tabPanes}
        </Tabs>
      </div>
    );
  }
}
