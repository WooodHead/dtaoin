import React from 'react';
// import CustomerSourceFilter from '../../../components/filters/CustomerSource';
import CreateTimeFilter from '../../../components/filters/CreateTime';

const AutoCustomerFilters = React.createClass({
  render(){
    return (
      <div>
      {/*
        <CustomerSourceFilter filterAction={this.props.filterAction.bind(this,'','source')} customerType="1"/>
        */}
        <CreateTimeFilter filterAction={this.props.filterAction.bind(this,'','create_day')}/>
      </div>
    );
  },
});

AutoCustomerFilters.defaultProps = {};

export default AutoCustomerFilters;
