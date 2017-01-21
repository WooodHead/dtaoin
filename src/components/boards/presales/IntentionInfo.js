import React from 'react';
import {Row, Col} from 'antd';
import EditIntentionModal from '../../../containers/presales/potential/Edit';
import IntentionTable from '../../tables/presales/IntentionTable';

export default class IntentionInfo extends React.Component {
  render() {
    let {intention} = this.props;
    let content, action;

    if (intention == undefined) {
      action = null;
      content = <Row type="flex" className="info-row"><Col span={24}>无意向信息</Col></Row>;
    } else {
      action = (
        <EditIntentionModal
          customer_id={intention.customer_id}
          intention_id={intention._id}
          type="primary"
          size="default"
        />
      );
      content = <IntentionTable intention={intention}/>;
    }

    return (
      <div className="margin-bottom-20">
        <Row>
          <Col span={6} className="font-size-18">意向信息</Col>
          <Col span={6} offset={12} className="text-right">
            {action}
          </Col>
        </Row>
        {content}
      </div>
    );
  }
}
