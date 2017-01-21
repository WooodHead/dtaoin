/**
 * Created by mrz on 17-1-4.
 */
import React, {Component} from 'react';
import PieChart from '../../components/chart/PieChart';
import {Card, Icon} from 'antd';
export default class AftersalesPaymentMethod extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {payTypes} = this.props;
    let payment = [];
    let paymentTotal = 0;
    payTypes.map(item => {
      payment.push({
        name: item.pay_type_name.substring(0, item.pay_type_name.length - 2),
        y:Number(item.amount),
        z: Number(item.count),
      });
      paymentTotal += Number(item.amount);
    });
    paymentTotal = Number(paymentTotal).toFixed(2);
    return (
      <Card title={<span><Icon type="bar-chart"/> 支付方式</span>} className="mb15" style={{height: '380px'}}>
        <PieChart
          name="项目占比"
          title={paymentTotal}
          subtitle="实收(元)"
          unit="个"
          data={payment}
          element="元"
        />
        <p>*实收金额=营业额+会员销售-挂账金额</p>
      </Card>
    );
  }

}
