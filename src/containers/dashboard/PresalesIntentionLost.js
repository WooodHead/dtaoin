import React from 'react';
import {Card, Icon, Row, Col} from 'antd';
import BarChart from '../../components/chart/BarChart';

export default class PresalesIntentionLost extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let intentionLostTitle = [];
    let intentionLostCount = [];

    let carSourceCount = 0;
    let priceCount = 0;
    let mortgageCount = 0;
    let otherCount = 0;
    let title = '';


    this.props.intentionLostInfo.map(item => {
      if (Number(item.fail_type) === 1) {
        carSourceCount = parseInt(item.count);
      } else if (Number(item.fail_type === 2)) {
        priceCount = parseInt(item.count);
      } else if (Number(item.fail_type === 3)) {
        mortgageCount = parseInt(item.count);
      } else if (Number(item.fail_type === 4)) {
        otherCount = parseInt(item.count);
      }
    });

    if(this.props.intentionLostSubInfo.length <= 0) {
      title = '暂无数据';
    }

    this.props.intentionLostSubInfo.map(item => {
      intentionLostTitle.push(item.fail_sub_type_name);
      intentionLostCount.push(parseInt(item.count));
    });

    let series = [{
      name: '次数',
      data: intentionLostCount,
    }];

    return (
      <Card title={<span><Icon type="bar-chart"/> 流失原因</span>}>
        <Row className="mb20">
          <Col span={4}>
            <span className="font-size-30 mr10 ml20">{carSourceCount}</span> <span className="font-size-14">车源问题</span>
          </Col>

          <Col span={4}>
            <span className="font-size-30 mr10">{priceCount}</span> <span className="font-size-14">价格问题</span>
          </Col>

          <Col span={4}>
            <span className="font-size-30 mr10">{mortgageCount}</span> <span className="font-size-14">按揭问题</span>
          </Col>

          <Col span={4}>
            <span className="font-size-30 mr10">{otherCount}</span> <span className="font-size-14">其它</span>
          </Col>
        </Row>
        <BarChart
          unit="流失(次)"
          categories={intentionLostTitle}
          series={series}
          title={title}
        />
      </Card>
    );
  }
}
