import React from 'react';
import FinModulePro from './FinModulePro';
import FinBankingPro from './FinBankingPro';

export default class HQFinancingInformation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCarOrMoney: true,
    };
  }

  render() {
    return (
      <div>
        {this.props.typeValue == 2
          ? (
            <FinBankingPro
              post_markertEditLoanFinance={this.props.post_markertEditLoanFinance}
              postMarkertEditLoanFinanceRes={this.props.postMarkertEditLoanFinanceRes}
              postProductCreateRes={this.props.postProductCreateRes}
            />)
          : (
            <FinModulePro
              post_markertDitAmountFixFinance={this.props.post_markertDitAmountFixFinance}
              postMarkertDitAmountFixFinanceRes={this.props.postMarkertDitAmountFixFinanceRes}
              postProductCreateRes={this.props.postProductCreateRes}
            />
          )}
      </div>
    );
  }
}
