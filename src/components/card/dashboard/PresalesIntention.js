import React from 'react'
import {Card, Row, Col, Icon} from 'antd'
import PieChart from '../../chart/PieChart'

export default class IntentionStatisticsCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      levelList,
      budgetList,
      mortgageList,
      customerSource
    } = this.props;

    let levelData = [],
      budgetData = [],
      mortgageData = [],
      sourceData = [];

    levelList.map(item => {
      let pieObj = {
        name: item.level,
        y: parseInt(item.count)
      };
      levelData.push(pieObj);
    });

    budgetList.map(item => {
      let pieObj = {
        name: item.desc,
        y: parseInt(item.count)
      };
      budgetData.push(pieObj);
    });

    mortgageList.map(item => {
      let pieObj = {
        name: item.is_mortgage === "0" ? '全款' : '按揭',
        y: parseInt(item.count)
      };
      mortgageData.push(pieObj);
    });

    customerSource.map(item => {
      let pieObj = {
        name: item.name,
        y: parseInt(item.count)
      };
      sourceData.push(pieObj);
    });

    return (
      <div>
        <Row gutter={16} className="mb15">
          <Col span="12">
            <Card title={<span><Icon type="pie-chart"/> 客户意向</span>}>
              <PieChart unit="个" data={levelData}/>
            </Card>
          </Col>
          <Col span="12">
            <Card title={<span><Icon type="pie-chart"/> 意向档次</span>}>
              <PieChart unit="个" data={budgetData}/>
            </Card>
          </Col>
        </Row>
        <Row gutter={16} className="mb15">
          <Col span="12">
            <Card title={<span><Icon type="pie-chart"/> 按揭情况</span>}>
              <PieChart unit="个" data={mortgageData}/>
            </Card>
          </Col>
          <Col span="12">
            <Card title={<span><Icon type="pie-chart"/> 客户来源</span>}>
              <PieChart unit="个" data={sourceData}/>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}