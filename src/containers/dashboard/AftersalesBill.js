/**
 * Created by mrz on 17-1-4.
 */
import React, {Component} from 'react';
import LineChart from '../../components/chart/LineChart';
import {Card, Icon, Row, Col} from 'antd';
export default class AftersalesBill extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {unpayState} = this.props;

    let chartSubtitle = unpayState &&  unpayState.chartSubtitle || '';
    let chartUnit = unpayState && unpayState.chartUnit || '';
    let categories = unpayState && unpayState.categories || '';
    let series = unpayState && unpayState.series || '';
    let allowDecimals = unpayState && unpayState.allowDecimals || '';
    return (
      <div>
        <Row>
          <Col span={24}>
            <Card title={<span><Icon type="bar-chart"/> 工单挂账(元)</span>} className="mb15" style={{height: '380px'}}>
              <LineChart
                title=""
                subtitle={chartSubtitle}
                unit={chartUnit}
                categories={categories}
                series={series}
                allowDecimals={allowDecimals}
                lineHeight="280"
              />
            </Card>
          </Col>
        </Row>


      </div>
    );
  }

}
