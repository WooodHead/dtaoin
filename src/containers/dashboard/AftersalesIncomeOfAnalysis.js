/**
 * Created by mrz on 17-1-4.
 */
import React, {Component} from 'react';
import PieChart from '../../components/chart/PieChart';
import {Card, Icon} from 'antd';
export default class AftersalesIncomeOfAnalysis extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {maintainSummary} = this.props;
    let source = [];
    if (maintainSummary.maintain_incomes) {
      if (Number(maintainSummary.maintain_incomes.time_fee) > 0) {
        source.push({
          name: '工时费',
          y: Number(maintainSummary.maintain_incomes.time_fee),
        });
      }
      if (Number(maintainSummary.maintain_incomes.material_fee_in) > 0) {
        source.push({
          name: '材料费',
          y: Number(maintainSummary.maintain_incomes.material_fee_in),
        });
      }
      if (Number(maintainSummary.maintain_incomes.coupon_fee) > 0) {
        source.push({
          name: '整单优惠',
          y: Number(maintainSummary.maintain_incomes.coupon_fee),
        });
      }
      if (Number(maintainSummary.maintain_incomes.part_sell_fee) > 0) {
        source.push({
          name: '配件销售',
          y: Number(maintainSummary.maintain_incomes.part_sell_fee),
        });
      }
    }

    return (
      <Card title={<span><Icon type="bar-chart"/> 收入分析</span>} className="mb15" style={{height: '380px'}}>
        <PieChart
          name="项目占比"
          title=""
          unit="元"
          data={source}
          innerSize="0"
          element="元"
        />
      </Card>
    );
  }

}
