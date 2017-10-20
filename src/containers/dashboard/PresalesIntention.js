import React from 'react';
import { Card, Row, Col, Icon } from 'antd';
import PieChart from '../../components/chart/PieChart';

export default class IntentionStatisticsCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      levelList,
      budgetList,
      mortgageList,
    } = this.props;

    const levelData = [];
    const budgetData = [];
    const mortgageData = [];

    let levelDataTotal = 0;
    let budgetDataTotal = 0;
    let mortgageRate = 0;

    levelList.map(item => {
      const pieObj = {
        name: item.level,
        y: parseInt(item.count),
      };
      levelDataTotal += pieObj.y;
      levelData.push(pieObj);
    });

    budgetList.map(item => {
      const pieObj = {
        name: item.level_name,
        y: parseInt(item.count),
      };
      budgetDataTotal += pieObj.y;
      budgetData.push(pieObj);
    });

    mortgageList.map(item => {
      const pieObj = {
        name: Number(item.is_mortgage) === 0 ? '全款' : '按揭',
        y: parseInt(item.count),
      };
      if (Number(item.is_mortgage) === 0) {
        mortgageData[1] = pieObj;
      } else {
        mortgageData[0] = pieObj;
      }
    });

    if (mortgageData.length > 0) {
      if (!mortgageData[1]) {
        mortgageRate = '100%';
      } else if (!mortgageData[0]) {
        mortgageRate = '0%';
        mortgageData.shift();
      } else {
        mortgageRate = `${(mortgageData[0].y / (mortgageData[0].y + mortgageData[1].y) * 100).toFixed(2)  }%`;
      }
    }

    return (
      <div>
        <Row gutter={20} className="mb15 mt20">
          <Col span={8}>
            <Card title={<span><Icon type="pie-chart"/> 意向级别</span>}>
              <PieChart
                unit="个"
                title={levelDataTotal}
                subtitle="意向(个)"
                data={levelData}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title={<span><Icon type="pie-chart"/> 意向档次</span>}>
              <PieChart
                unit="个"
                title={budgetDataTotal}
                subtitle="意向(个)"
                data={budgetData}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title={<span><Icon type="pie-chart"/> 按揭情况</span>}>
              <PieChart
                unit="个"
                title={mortgageRate}
                subtitle="按揭率"
                data={mortgageData}
                angle={140}
              />
            </Card>
          </Col>
        </Row>
        {/* <Row gutter={16} className="mb15">

         <Col span={12}>
         <Card title={<span><Icon type="pie-chart"/> 客户来源</span>}>
         <PieChart unit="个" data={sourceData}/>
         </Card>
         </Col>
         </Row>*/}
      </div>
    );
  }
}
