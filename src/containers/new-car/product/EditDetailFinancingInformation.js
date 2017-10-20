import React from 'react';
import EditDetailFinModulePro from './EditDetailFinModulePro';
import EditDetailFinBankingPro from './EditDetailFinBankingPro';

export default class EditDetailFinancingInformation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCarOrMoney: true,
    };
  }

  render() {
    const getProductDetailRes = this.props.getProductDetailRes;
    return (
      <div>
        {getProductDetailRes.type == 2 ? <EditDetailFinBankingPro
            post_markertEditLoanFinance={this.props.post_markertEditLoanFinance}
            postMarkertEditLoanFinanceRes={this.props.postMarkertEditLoanFinanceRes}
            getProductDetailRes={this.props.getProductDetailRes}
            hqOrOperate={this.props.hqOrOperate}
            product_id={this.props.product_id}

          />
          : <EditDetailFinModulePro
            post_markertDitAmountFixFinance={this.props.post_markertDitAmountFixFinance}
            postMarkertDitAmountFixFinanceRes={this.props.postMarkertDitAmountFixFinanceRes}
            getProductDetailRes={this.props.getProductDetailRes}
            hqOrOperate={this.props.hqOrOperate}
            product_id={this.props.product_id}
          />}

      </div>

    );
  }
}
