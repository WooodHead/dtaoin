import React from 'react';
import IntentionLevelFilter from '../../../components/filters/IntentionLevel';
import CreateTimeFilter from '../../../components/filters/CreateTime';
import BrandIntentionFilter from '../../../components/filters/BrandIntention';
import BudgetFilter from '../../../components/filters/Budget';
import MortageTypeFilter from '../../../components/filters/MortageType';

const PotentialAutoCustomer = React.createClass({
  render(){
    return (
      <div>
        {/*
        <CustomerSourceFilter filterAction={this.props.filterAction.bind(this,'','source')} customerType="1"/>
        */}
        <IntentionLevelFilter filterAction={this.props.filterAction.bind(this,'','intention_level')}/>
        <CreateTimeFilter filterAction={this.props.filterAction.bind(this,'','create_day')}/>
        <div className="mb15">
          <span className="margin-right-20">购车意向:</span>
          <BrandIntentionFilter filterAction={this.props.filterAction.bind(this,'value','intention_brand')}/>
          <BudgetFilter filterAction={this.props.filterAction.bind(this,'value','budget_level')} budgetLevel={this.props.budgetLevel}/>
          <MortageTypeFilter filterAction={this.props.filterAction.bind(this,'','is_mortgage')}/>
        </div>
      </div>
    );
  },
});

PotentialAutoCustomer.defaultProps = {};

export default PotentialAutoCustomer;
