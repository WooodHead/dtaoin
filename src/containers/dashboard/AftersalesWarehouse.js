/**
 * Created by mrz on 17-1-4.
 */
import React, {Component} from 'react';
import {Card, Icon, Row, Col} from 'antd';
import formatter from '../../utils/DateFormatter';

export default class AftersalesWarehouse extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {godownEntrySummary, startTime} = this.props;
    let lastDate = formatter.day(new Date(new Date().setDate(new Date().getDate() - 1)));

    let totalInPrice = 0;
    let totalUnpayPrice = 0;
    if (!!godownEntrySummary) {
      totalInPrice = Number(godownEntrySummary.total_in_price) || 0;
      totalUnpayPrice = Number(godownEntrySummary.total_unpay_price) || 0;
    }
    return (
      <div>
        <Row>
          <Col span={24}>
            <Card title={<span><Icon type="bar-chart"/> 仓库情况(元)</span>} className="mb15">
              <Row>
                <Col span={startTime === lastDate ? 12 : 24} style={{textAlign: 'center'}}>
                  <p className="font-size-30">{totalInPrice}</p>
                  <p>采购金额</p>
                </Col>
                <Col span={12} style={{textAlign: 'center'}} className={startTime === lastDate ? '' : 'hide'}>
                  <p className="font-size-30">{totalUnpayPrice}</p>
                  <p>挂账金额</p>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>


      </div>
    );
  }

}
