import React from 'react';
import { Row, Col, Tabs } from 'antd';

import api from '../../../middleware/api';

import InfoDeal from './InfoDeal';
import InfoAuto from './InfoAuto';
import InfoDecoration from './InfoDecoration';
import InfoInsurance from './InfoInsurance';
import InfoLoan from './InfoLoan';
import InfoIntention from './InfoIntention';
import CustomerInfo from './InfoCustomer';
import AuthPopover from './AuthPopover';

export default class New extends React.Component {
  constructor(props) {
    super(props);
    const { customerId, autoId, intentionId, autoDealId } = props.match.params;
    this.state = {
      customerId: customerId || '',
      autoId: autoId || '',
      intentionId: intentionId || '',
      autoDealId: autoDealId || '',
      dealInfo: {},
    };
    [
      'handleAutoIdChange',
      'handleAutoDealIdChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    const { customerId, autoId } = this.state;
    if (customerId && autoId) {
      this.getAutoDealId(customerId, autoId);
    }
  }

  handleAutoDealIdChange(info, active) {
    if (active == 'autoDealId') {
      this.setState({ autoDealId: info });
    } else if (active == 'dealInfo') {
      this.setState({ dealInfo: info });
    }
  }

  handleAutoIdChange(autoId) {
    this.setState({ autoId });
  }

  getAutoDealId(customerId, autoId) {
    if (!!autoId) {
      api.ajax({ url: api.presales.deal.getAutoDealDetailByAutoId(customerId, autoId) }, data => {
        const dealInfo = data.res.detail;
        this.setState({
          dealInfo: dealInfo || {},
          autoDealId: dealInfo._id,
          intentionId: dealInfo.intention_id || 0,
        });
      });
    }
  }

  render() {
    const { customerId, autoId, intentionId, autoDealId, dealInfo } = this.state;
    const TabPane = Tabs.TabPane;

    const formProps = {
      customerId,
      autoId,
      intentionId,
      autoDealId,
    };

    const tabPanes = [
      <TabPane tab={'交易信息'} key={'1'}>
        <InfoDeal {...formProps} dealInfo={dealInfo} onSuccess={this.handleAutoDealIdChange}/>
      </TabPane>,

      <TabPane disabled={!autoDealId} tab={'车辆信息'} key={'2'}>
        <InfoAuto {...formProps} onSuccess={this.handleAutoIdChange}/>
      </TabPane>,

      <TabPane disabled={!autoDealId || !Number(autoId)} tab={'保险信息'} key={'3'}>
        <InfoInsurance {...formProps}/>
      </TabPane>,

      <TabPane disabled={!autoDealId || !Number(autoId) || Number(dealInfo.pay_type) === 0} tab={'按揭信息'} key={'4'}>
        <InfoLoan {...formProps}/>
      </TabPane>,

      <TabPane disabled={!autoDealId || !Number(autoId)} tab={'加装信息'} key={'5'}>
        <InfoDecoration {...formProps}/>
      </TabPane>,
    ];

    /* let tabPanes = [
      <TabPane tab={'交易信息'} key={'1'}>
        <InfoDeal {...formProps} dealInfo={dealInfo} onSuccess={this.handleAutoDealIdChange} />
      </TabPane>,

      <TabPane tab={'车辆信息'} key={'2'}>
        <InfoAuto {...formProps} onSuccess={this.handleAutoIdChange} />
      </TabPane>,

      <TabPane tab={'保险信息'} key={'3'}>
        <InfoInsurance {...formProps} />
      </TabPane>,

      <TabPane tab={'按揭信息'} key={'4'}>
        <InfoLoan {...formProps} />
      </TabPane>,

      <TabPane tab={'加装信息'} key={'5'}>
        <InfoDecoration {...formProps} />
      </TabPane>,
    ];*/

    return (
      <div className="render-content">
        <div>
          <Row className="head-action-bar-line">
            <Col span={12}>
              <h2>车辆成交单</h2>
            </Col>

            <Col span={12}>
              <span className={autoDealId ? 'pull-right' : 'hide'}>
                <AuthPopover detail={this.state.dealInfo || {}} />
              </span>
            </Col>
          </Row>

          <CustomerInfo customerId={customerId} />

          <InfoIntention customerId={customerId} intentionId={intentionId} autoId={autoId} />
        </div>
        <Tabs type="card" defaultActiveKey="1">{tabPanes}</Tabs>
      </div>
    );
  }
}
