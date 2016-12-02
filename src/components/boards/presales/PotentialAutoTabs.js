import React from 'react'
import {Tabs, Button, Row, Col} from 'antd'
import IntentionInfo from './IntentionInfo'
import NewDealModal from '../../modals/presales/NewDealModal'
import NewIntentionModal from '../../modals/presales/NewIntentionModal'
import EditIntentionModal from '../../modals/presales/EditIntentionModal'
import LostCustomerModal from '../../modals/presales/LostCustomerModal'

export default class AutoTabs extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const TabPane = Tabs.TabPane;
    let {intentions} = this.props;
    let operations = '';
    let tabPanes = [];

    intentions.map(function (item, index) {
      let tabInfo = `意向${index + 1}信息`;
      let disabled = false;
      if (Number(item.status) == -1) {
        disabled = true;
      }
      operations = <NewIntentionModal customer_id={item.customer_id} size="default" isSingle={true}/>;

      tabPanes.push(
        <TabPane tab={tabInfo} key={index+1}>
          <div className="info-board">
            <Row type="flex" className="info-row">
              <Col span="6" className="font-size-18">意向信息</Col>
              <Col span="6" offset="12">
                <EditIntentionModal
                  customer_id={item.customer_id}
                  intention_id={item._id}
                  disabled={disabled}
                  isSingleMode={true}
                  type="primary"
                  size="default"
                />

                <NewDealModal
                  customer_id={item.customer_id}
                  disabled={disabled}
                  intention_id={item._id}
                  size="default"
                  isSingle={true}
                />

                <LostCustomerModal
                  customer_id={item.customer_id}
                  intention_id={item._id}
                  size="default"
                  disabled={disabled}
                />
              </Col>
            </Row>

            <IntentionInfo intention={item}/>
          </div>
        </TabPane>
      )
    });

    return (
      <div className="margin-top-40">
        <Tabs type="card" tabBarExtraContent={operations}>
          {tabPanes}
        </Tabs>
      </div>
    );
  }
}
