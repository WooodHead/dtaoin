import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Icon } from 'antd';
import PieChart from '../../components/chart/PieChart';
import BarChart from '../../components/chart/BarChart';

const percentage = require('../../images/dashboard/chart_icon_percentage_small.png');

export default class AftersalesIncomeOfProject extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let incomeSeries = [], payment = [];
    const { typeIncomesSummary, couponFee, payTypes, startTime, endTime } = this.props;
    let incomeTotal = 0;
    let profitTotal = 0;
    let paymentTotal = 0;

    payTypes.map(item => {
      payment.push({
        name: item.pay_type_name.substring(0, item.pay_type_name.length - 2),
        y: Number(item.amount),
        z: Number(item.count),
      });
      paymentTotal += Number(item.amount);
    });
    paymentTotal = Number(paymentTotal).toFixed(2);

    const profitRateTitle = [];
    const profitRateCount = [];

    typeIncomesSummary.map(item => {
      incomeSeries.push({
        name: item.type,
        y: Number(Number(item.amount).toFixed(2)),
      });
      incomeTotal += Number(item.amount);

      profitRateTitle.push(item.type);
      profitRateCount.push(Number(Number(item.profit_rate) * 100));
      profitTotal += Number(item.profit);
    });

    const profitRateSeries = [
      {
        name: '占比',
        data: profitRateCount,
      }];

    incomeTotal = Number(incomeTotal).toFixed(2);
    profitTotal = Number(profitTotal).toFixed(2);

    // 总额减去整单优惠
    incomeTotal = (Number(incomeTotal) - Number(couponFee)).toFixed(2);
    profitTotal = (Number(profitTotal) - Number(couponFee)).toFixed(2);
    // 成本
    const cost = (Number(incomeTotal) - Number(profitTotal)).toFixed(2);
    // 毛利率平均值
    let averageProfit = '0.00';
    if (Number(incomeTotal) !== 0) {
      averageProfit = ((Number(profitTotal) / Number(incomeTotal)) * 100).toFixed(2);
    }
    return (
      <Row gutter={20} className="mb15 mt20">
        <Col span={8}>
          <Card
            title={<span><Icon type="pay-circle-o" /> 营业额(元)</span>}
            extra={
              <Link
                to={{ pathname: `/dashboard/aftersales/turnover/${startTime}/${endTime}` }}
                target="_blank"
                className="font-size-14"
              >
                查看明细
              </Link>
            }
          >
            <PieChart
              name="产值占比"
              title={incomeTotal}
              subtitle="营业额(元)"
              unit="元"
              data={incomeSeries}
              element="元"
            />
            <p className="font-size-12" style={{ color: '#2A2A2A' }}>
              {`*整单优惠：￥${Number(couponFee).toFixed(2) || '0.00'}`}
            </p>
            <p className="font-size-12 text-gray" style={{ color: '#666' }}>
              *营业额=各类型营业额-整单优惠
            </p>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title={<span><img src={percentage} /> 毛利率</span>}
            extra={<p className="font-size-24" style={{
              position: 'absolute',
              right: '10px',
              top: '0px',
            }}>{`${averageProfit}%`}</p>}
          >
            <BarChart
              unit="毛利率"
              categories={profitRateTitle}
              series={profitRateSeries}
              title=""
              dataFormat="{point.y}%"
              pointFormat="占比 <b>{point.y:.2f}%</b>"
              yFormatter={{
                formatter() {
                  return `${this.value  }%`;
                },
              }}
              chartHeight="260"
            />
            <p className="font-size-12"
               style={{ color: '#2A2A2A' }}>{`*营业额：￥${incomeTotal}  配件成本：￥${cost}`}</p>
            <p className="font-size-12" style={{ color: '#666' }}>
              *毛利率=毛利/营业额
            </p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title={<span><Icon type="pay-circle-o" /> 支付方式</span>} className="mb15">
            <PieChart
              name="项目占比"
              title={paymentTotal}
              subtitle="实收(元)"
              unit="个"
              data={payment}
              element="元"
            />
            <p className="font-size-12 visible-hidden">占据位置</p>
            <p className="font-size-12" style={{ color: '#666666' }}>*实收金额=营业额-挂账金额</p>
          </Card>
        </Col>
      </Row>
    );
  }
}
