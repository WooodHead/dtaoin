import React from 'react';
import api from '../../../middleware/api';
import AutoDealInfo from '../presales/AutoDealInfo';
import MortgageInfo from '../presales/MortgageInfo';
import InsuranceInfo from '../presales/InsuranceInfo';
import DecorationInfo from '../presales/DecorationInfo';
import IntentionInfo from '../presales/IntentionInfo';


let CustomerInfo = React.createClass({
  getInitialState(){
    return ({
      deal_info: {},
      mortgage_info: {},
      insurance_info: {},
      decoration_info: {},
      intention_info: {},
    });
  },

  componentDidMount(){
    let autoId = this.props.idAuto;
    let customerId = this.props.id;
    let newState = {};

    api.ajax({url: api.autoDealInfo(customerId, autoId)}, (data) => {
      newState['deal_info'] = data.res.detail;
      this.setState(newState);
    });
    api.ajax({url: api.presales.deal.getLoanDetail(customerId, autoId)}, (data) => {
      newState['mortgage_info'] = data.res.detail;
      this.setState(newState);
    });
    api.ajax({url: api.presales.deal.getInsuranceLogDetail(customerId, autoId)}, (data) => {
      newState['insurance_info'] = data.res.detail;
      this.setState(newState);
    });
    api.ajax({url: api.autoDecorationInfo(customerId, autoId)}, (data) => {
      newState['decoration_info'] = data.res.detail;
      this.setState(newState);
    });
    api.ajax({url: api.autoIntentionInfo(customerId, autoId)}, (data) => {
      newState['intention_info'] = data.res.intention_info;
      this.setState(newState);
    });
  },

  render(){
    let auto_id = this.props.idAuto;
    let customer_id = this.props.id;
    let {
      deal_info,
      mortgage_info,
      insurance_info,
      decoration_info,
      intention_info,
    } = this.state;

    return (
      <div>
        <AutoDealInfo auto={deal_info} idAuto={auto_id} id={customer_id}/>
        {
          deal_info && deal_info.pay_type === '0' ? '' :
            <MortgageInfo auto={mortgage_info} idAuto={auto_id} id={customer_id}/>
        }
        <InsuranceInfo auto={insurance_info} idAuto={auto_id} id={customer_id}/>
        <DecorationInfo auto={decoration_info} idAuto={auto_id} id={customer_id}/>
        <IntentionInfo intention={intention_info}/>
      </div>
    );
  },
});

CustomerInfo.defaultProps = {};

export default CustomerInfo;
