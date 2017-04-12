import React from 'react';
import {Link} from 'react-router';
import {Tabs, Row, Col, Button} from 'antd';

import IntentionTable from '../presales/potential/IntentionTable';
import EditIntentionModal from '../presales/potential/Edit';
import LostCustomerModal from '../presales/potential/Lost';
import New from '../presales/potential/New';

export default class AutoTabs extends React.Component {
  constructor(props) {
    super(props);
  }

  addIntetionSuccess() {
    location.reload();
  }

  render() {
    const TabPane = Tabs.TabPane;
    let {intentions, customerId} = this.props;
    let tabPanes = [];
    let self = this;

    intentions.map(function (item, index) {
      let tabInfo = `意向${index + 1}`;
      let disabled = false;
      if (Number(item.status) === -1 || Number(item.status) === 3) {
        disabled = true;
      }

      tabPanes.push(
        <TabPane tab={tabInfo} key={index + 1 + ''}>
          <div>
            <IntentionTable intention={item}/>

            <Row type="flex" className="mt20">
              <div>
                <LostCustomerModal
                  customerId={item.customer_id}
                  intentionId={item._id}
                  size="default"
                  disabled={disabled}
                />
              </div>

              <div className="ml10">
                <Link
                  to={{
                    pathname: '/presales/deal/new',
                    query: {customerId: item.customer_id, intentionId: item._id},
                  }}
                  target="_blank"
                >
                  <Button type="dash" disabled={disabled}>成交</Button>
                </Link>
              </div>

              <div className="ml10">
                <EditIntentionModal
                  customerId={item.customer_id}
                  intentionId={item._id}
                  disabled={disabled}
                  isSingleMode={true}
                  type="primary"
                  size="default"
                  onSuccess={self.props.onSuccess}
                />
              </div>
            </Row>
          </div>
        </TabPane>
      );
    });

    return (
      <div>
        <Row>
          <Col span={12}>
            <h3 className="mb20">意向信息</h3>
          </Col>

          <Col span={12}>
            <div className="pull-right">
              <New
                isSingle={true}
                customerId={customerId}
                onSuccess={this.addIntetionSuccess}
              />
            </div>
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
