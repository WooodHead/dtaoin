import React from 'react';
import {Row, Col, Card, Icon} from 'antd';
import PieChart from '../../components/chart/PieChart';

export default class AftersalesIncomeOfProject extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    let countSeries = [], incomeSeries = [], profitSeries = [];
    let {typeCount, typeIncomesAmount, typeIncomesProfit, accidentSummary, couponFee} = this.props;
    let countTotal = 0;
    let incomeTotal = 0;
    let profitTotal = 0;

    let countAccident = accidentSummary.count || 0;
    let incomeAccident = accidentSummary.total_fee || 0;
    let profitAccident = accidentSummary.total_profit || 0;


    typeCount.map(item => {
      countSeries.push({
        name: item.name,
        y: parseInt(item.count),
      });
      countTotal += parseInt(item.count);
    });

    typeIncomesAmount.map(item => {
      incomeSeries.push({
        name: item.name,
        y: parseInt(item.amount),
      });
      incomeTotal += parseInt(item.amount);
    });
    incomeTotal = Number(incomeTotal).toFixed(2);

    typeIncomesProfit.map(item => {
      profitSeries.push({
        name: item.name,
        y: parseInt(item.amount),
      });
      profitTotal += parseInt(item.amount);
    });
    profitTotal = Number(profitTotal).toFixed(2);


    //总额减去整单优惠
    incomeTotal -= couponFee;
    profitTotal -= couponFee;
    return (
      <Row gutter={20} className="mb15 margin-top-20">
        <Col span={8}>
          <Card title={<span><Icon type="pie-chart"/> 项目数量</span>}>
            <Row>
              <Col span={10}>
                <span className="font-size-30 margin-right-20 margin-left-20">{countAccident || 0}</span>
                <span>事故单数</span>
              </Col>

            </Row>
            <PieChart
              name="项目占比"
              title={countTotal}
              subtitle="项目(个)"
              unit="个"
              data={countSeries}
            />
            <p style={{visibility: 'hidden'}}>占位</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title={<span><Icon type="pie-chart"/> 营业额(元)</span>}>
            <Row>
              <Col span={12}>
                <span className="font-size-30 margin-right-20 margin-left-20">{Number(incomeAccident).toFixed(2) || '0.00'}</span>
                <span>事故单</span>
              </Col>
              <Col span={12}>
                <span className="font-size-30 margin-right-20 margin-left-20">{Number(couponFee).toFixed(2) || '0.00'}</span>
                <span>整单优惠</span>
              </Col>
            </Row>
            <PieChart
              name="产值占比"
              title={incomeTotal}
              subtitle="营业额(元)"
              unit="元"
              data={incomeSeries}
              element="元"
            />
            <p>*营业额=各类型营业额-整单优惠</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title={<span><Icon type="pie-chart"/> 毛利润(元)</span>}>
            <Row>
              <Col span={12}>
                <span className="font-size-30 margin-right-20 margin-left-20">{Number(profitAccident).toFixed(2) || '0.00'}</span>
                <span>事故单</span>
              </Col>
              <Col span={12}>
                <span className="font-size-30 margin-right-20 margin-left-20">{Number(couponFee).toFixed(2) || '0.00'}</span>
                <span>整单优惠</span>
              </Col>
            </Row>
            <PieChart
              name="毛利润"
              title={profitTotal}
              subtitle="毛利润(元)"
              unit="元"
              data={profitSeries}
              element="元"
            />
            <p>*毛利润=各类型毛利润-整单优惠</p>
          </Card>
        </Col>
      </Row>
    );
  }
}
