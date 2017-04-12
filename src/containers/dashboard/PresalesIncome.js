import React from 'react';
import {Card, Icon, Row, Col} from 'antd';
import BarChart from '../../components/chart/BarChart';

export default class PresalesIncomeStatistics extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {source} = this.props;
    let title = '';
    if(source.length <= 0) {
      title = '暂无数据';
    }
    let categories = ['裸车', '保险', '按揭', '上牌', '加装'];
    let series = [{
      name: '收入',
      data: [Number(source.bare_auto), Number(source.insurance), Number(source.loan), Number(source.license_tax), Number(source.decoration)],
    }];

    return (
      <Card title={<span><Icon type="bar-chart"/> 收入统计</span>} className="mb15">
        {/*为了保持和流失原因一样的样式加了下面Row和Col 在此无意义*/}
        <Row className="mb20">
          <Col span={4}>
            <span className="font-size-30 mr10 ml20">{}</span>
          </Col>
        </Row>
        <BarChart
          unit="收入(元)"
          categories={categories}
          series={series}
          title={title}
        />
      </Card>
    );
  }
}
