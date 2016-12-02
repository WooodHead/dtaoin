import React from 'react'
import {Button, Row, Col, message} from 'antd'
import api from '../../../middleware/api'
import AutoDealInfo from './AutoDealInfo'
import MortgageInfo from './MortgageInfo'
import InsuranceInfo from './InsuranceInfo'
import DecorationInfo from './DecorationInfo'
import IntentionInfo from './IntentionInfo'
import EditIntentionModal from '../../modals/presales/EditIntentionModal'

let CustomerInfo = React.createClass({
  getInitialState(){
    return ({
      deal_info: {},
      mortgage_info: {},
      insurance_info: {},
      decoration_info: {},
      intention_info: {}
    })
  },

  componentDidMount(){
    let id_auto = this.props.idAuto, customer_id = this.props.id, newState = {}, that = this;

    api.ajax({url: api.autoDealInfo(customer_id, id_auto)}, (data)=> {
      if (data.code == 0) {
        newState['deal_info'] = data.res.detail;
        that.setState(newState);
      } else {
        message.warning(data.msg);
      }
    });
    api.ajax({url: api.getPurchaseLoanDetail(customer_id, id_auto)}, (data)=> {
      if (data.code == 0) {
        newState['mortgage_info'] = data.res.detail;
        that.setState(newState);
      } else {
        message.warning(data.msg);
      }
    });
    api.ajax({url: api.getPurchaseInsuranceDetail(customer_id, id_auto)}, (data)=> {
      if (data.code == 0) {
        newState['insurance_info'] = data.res.detail;
        that.setState(newState);
      } else {
        message.warning(data.msg);
      }
    });
    api.ajax({url: api.autoDecorationInfo(customer_id, id_auto)}, (data)=> {
      if (data.code == 0) {
        newState['decoration_info'] = data.res.detail;
        that.setState(newState);
      } else {
        message.warning(data.msg);
      }
    });
    api.ajax({url: api.autoIntentionInfo(customer_id, id_auto)}, (data)=> {
      if (data.code == 0) {
        newState['intention_info'] = data.res.intention_info;
        that.setState(newState);
      } else {
        message.info('hello error!')
      }
    });
  },

  render(){
    let state = this.state, auto_id = this.props.idAuto, customer_id = this.props.id;
    let {
      deal_info,
      mortgage_info,
      insurance_info,
      decoration_info,
      intention_info
    } = this.state;

    return (
      <div>
        <AutoDealInfo auto={deal_info} idAuto={auto_id} id={customer_id}/>
        {deal_info.pay_type === '0' ? '' : <MortgageInfo auto={mortgage_info} idAuto={auto_id} id={customer_id}/>}
        <InsuranceInfo auto={insurance_info} idAuto={auto_id} id={customer_id}/>
        <DecorationInfo auto={decoration_info} idAuto={auto_id} id={customer_id}/>

        <div className="info-board">
          <Row type="flex" className="info-row">
            <Col span="6" className="font-size-18">意向信息</Col>
            <Col span="6" offset="12">
              <EditIntentionModal
                customer_id={intention_info.customer_id}
                intention_id={intention_info._id}
                type="primary"
                size="default"
              />
            </Col>
          </Row>

          <IntentionInfo intention={intention_info}/>
        </div>
      </div>
    );
  }
});

CustomerInfo.defaultProps = {};

export default CustomerInfo
