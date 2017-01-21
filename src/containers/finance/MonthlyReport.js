import React, {Component} from 'react';
import {Card, Row, Col, DatePicker, Spin} from 'antd';
import api from '../../middleware/api';
let icon_1 = require('../../images/monthly_report/yuebao_icon_1.png');
let icon_2 = require('../../images/monthly_report/yuebao_icon_2.png');
let icon_3 = require('../../images/monthly_report/yuebao_icon_3.png');
let icon_4 = require('../../images/monthly_report/yuebao_icon_4.png');
let icon_5 = require('../../images/monthly_report/yuebao_icon_5.png');
let icon_6 = require('../../images/monthly_report/yuebao_icon_6.png');
let icon_7 = require('../../images/monthly_report/yuebao_icon_7.png');
let icon_8 = require('../../images/monthly_report/yuebao_icon_8.png');


import formatter from '../../utils/DateFormatter';
const MonthPicker = DatePicker.MonthPicker;
export default class MonthlyReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      month: formatter.month(new Date(new Date().getFullYear(), new Date().getMonth())),
      detail: {},
      payType: '',
      isFetching: false,
    };
    [
      'handleDateRangeChange',
      'getList',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getList();
  }

  getList() {
    this.setState({isFetching: true});
    api.ajax({url: api.getFinancialSummary(this.state.month)}, (data) => {
      let payType = [];
      if (data.res.in.pay_types) {
        data.res.in.pay_types.map(item => {
          if (item.pay_type == 2) {
            payType[0] = item;
          } else if (item.pay_type == 3) {
            payType[1] = item;
          } else {
            payType[2] = item;
          }
        });
      }
      this.setState({detail: data.res, payType, isFetching: false});
    }, () => {
    });
  }

  handleDateRangeChange(momentMonth, stringMonth) {
    this.setState({month: stringMonth}, () => {
      this.getList();
    });
  }

  disabledDate(current) {
    // can not select days after today and today and before 2017.
    return current && (current.valueOf() >= new Date() || current.valueOf() <= new Date(new Date().getFullYear(), new Date().getMonth() - 1));
  }

  render() {
    let {detail} = this.state;
    let inventory = (detail.godown && Number(detail.godown.panying) >= 0)
      ? {img: icon_7, word: '盘盈金额'} : {img: icon_6, word: '盘亏金额'};

    let cardStyle = {textAlign: 'center', height: '103px'};
    let imgStyle = {width: '55px', height: '55px'};
    let explainWordStyle = {fontSize: '12px', color: '#999'};
    let numberStyle = {fontSize: '27px', color: '#333'};
    let smallNumberStyle = {fontSize: '18px', color: '#333', marginTop: '5px'};
    let divStyle = {display: 'inline-block', marginLeft: '40px', textAlign: 'left', verticalAlign: 'top'};

    return (
      <div style={{marginLeft: '25px', marginRight: '90px'}}>
        <Row>
          <laber>选择月份：</laber>
          <MonthPicker
            format={formatter.pattern.month}
            value={formatter.getMomentDate(this.state.month)}
            onChange={this.handleDateRangeChange}
            disabledDate={this.disabledDate}
          />
        </Row>

        <Spin tip="加载中..." spinning={this.state.isFetching}>
          <Row gutter={16} className="margin-top-20 margin-bottom-10">
            <Col span={6}>
              <Card style={cardStyle}>
                <Col span={5} offset={2}>
                  <img src={icon_1} alt="" style={imgStyle}/>
                </Col>
                <Col span={10}>
                  <div style={divStyle}>
                    <p style={explainWordStyle}>总毛利</p>
                    <p style={numberStyle}>{detail.total && Number(detail.total.maoli).toFixed(2) || '0.00'}</p>
                  </div>
                </Col>
              </Card>
            </Col>
            <Col span={6}>
              <Card style={cardStyle}>
                <Col span={5} offset={2}>
                  <img src={icon_2} alt="" style={imgStyle}/>
                </Col>
                <Col span={10}>
                  <div style={divStyle}>
                    <p style={explainWordStyle}>总毛利率</p>
                    <p
                      style={numberStyle}>{detail.total && (Number(detail.total.maolilv).toFixed(2) + '%') || '0.00%'}</p>
                  </div>
                </Col>
              </Card>
            </Col>
            <Col span={6}>
              <Card style={cardStyle}>
                <Col span={5} offset={2}>
                  <img src={icon_1} alt="" style={imgStyle}/>
                </Col>
                <Col span={10}>
                  <div style={divStyle}>
                    <p style={explainWordStyle}>总净利</p>
                    <p style={numberStyle}>{detail.total && Number(detail.total.jingli).toFixed(2) || '0.00'}</p>
                  </div>
                </Col>
              </Card>
            </Col>
            <Col span={6}>
              <Card style={cardStyle}>
                <Col span={5} offset={2}>
                  <img src={icon_2} alt="" style={imgStyle}/>
                </Col>
                <Col span={10}>
                  <div style={divStyle}>
                    <p style={explainWordStyle}>总净利率</p>
                    <p
                      style={numberStyle}>{detail.total && (Number(detail.total.jinglilv).toFixed(2) + '%') || '0.00%'}</p>
                  </div>
                </Col>
              </Card>
            </Col>
          </Row>

          <Row className="margin-bottom-10">
            <Card style={{height: '103px'}}>
              <Col span={5} style={{textAlign: 'center', marginLeft: '0.2%'}}>
                <Col span={5} offset={2}>
                  <img src={icon_3} alt="" style={imgStyle}/>
                </Col>
                <Col span={10}>
                  <div style={divStyle}>
                    <p style={explainWordStyle}>营业额汇总(元)</p>
                    <p style={numberStyle}>{detail.in && Number(detail.in.total).toFixed(2) || '0.00'}</p>
                  </div>
                </Col>
              </Col>
              <div style={{
                width: '0px',
                height: '60px',
                borderRight: '1px solid #ccc',
                position: 'absolute',
                left: '25%',
              }}></div>
              <Col span={3} offset={2}>
                <p style={explainWordStyle}>现金支付</p>
                <p style={smallNumberStyle}>{this.state.payType && this.state.payType[0].data}</p>
              </Col>
              <Col span={3}>
                <p style={explainWordStyle}>微信支付</p>
                <p style={smallNumberStyle}>{this.state.payType && this.state.payType[1].data}</p>
              </Col>
              <Col span={3}>
                <p style={explainWordStyle}>支付宝支付</p>
                <p style={smallNumberStyle}>{this.state.payType && this.state.payType[2].data}</p>
              </Col>
              {/*<Col span={3}>
               <p style={explainWordStyle}>POS机刷卡</p>
               <p style={smallNumberStyle}>{'1111111'}</p>
               </Col>
               <Col span={3}>
               <p style={explainWordStyle}>银行转账</p>
               <p style={smallNumberStyle}>{'1111111'}</p>
               </Col>*/}
            </Card>
          </Row>


          <Row className="margin-bottom-10">
            <Card style={{height: '103px'}}>
              <Col span={5} style={{textAlign: 'center', marginLeft: '0.2%'}}>
                <Col span={5} offset={2}>
                  <img src={icon_4} alt="" style={imgStyle}/>
                </Col>
                <Col span={10}>
                  <div style={divStyle}>
                    <p style={explainWordStyle}>支出汇总</p>
                    <p style={numberStyle}>{detail.out && Number(detail.out.total).toFixed(2) || '0.00'}</p>
                  </div>
                </Col>
              </Col>
              <div style={{
                width: '0px',
                height: '60px',
                borderRight: '0.5px solid #ccc',
                position: 'absolute',
                left: '25%',
              }}></div>
              <Col span={3} offset={2}>
                <p style={explainWordStyle}>耗材领用</p>
                <p style={smallNumberStyle}>{detail.out && Number(detail.out.haocai).toFixed(2) || '0.00'}</p>
              </Col>
              <Col span={3}>
                <p style={explainWordStyle}>其它支出</p>
                <p style={smallNumberStyle}>{detail.out && Number(detail.out.other).toFixed(2) || '0.00'}</p>
              </Col>
              <Col span={3}>
                <p style={explainWordStyle}>人力成本</p>
                <p style={smallNumberStyle}>{detail.out && Number(detail.out.gongzi).toFixed(2) || '0.00'}</p>
              </Col>
              <Col span={3}>
                <p style={explainWordStyle}>工单配件成本</p>
                <p style={smallNumberStyle}>{detail.out && Number(detail.out.gongdan).toFixed(2) || '0.00'}</p>
              </Col>
            </Card>
          </Row>


          <Row gutter={16} className="margin-bottom-10">
            <Col span={6} style={cardStyle}>
              <Card style={cardStyle}>
                <Col span={5} offset={2}>
                  <img src={icon_5} alt="" style={imgStyle}/>
                </Col>
                <Col span={10}>
                  <div style={divStyle}>
                    <p style={explainWordStyle}>仓库期末金额</p>
                    <p
                      style={numberStyle}>{detail.godown && Number(detail.godown.last_godown_total).toFixed(2) || '0.00'}
                    </p>
                  </div>
                </Col>
              </Card>
            </Col>
            <Col span={6}>
              <Card style={cardStyle}>
                <Col span={5} offset={2}>
                  <img src={icon_5} alt="" style={imgStyle}/>
                </Col>
                <Col span={10}>
                  <div style={divStyle}>
                    <p style={explainWordStyle}>仓库期初金额</p>
                    <p
                      style={numberStyle}>{detail.godown && Number(detail.godown.godown_total).toFixed(2) || '0.00'}
                    </p>
                  </div>
                </Col>
              </Card>
            </Col>
            <Col span={6}>
              <Card style={cardStyle}>
                <Col span={5} offset={2}>
                  <img src={inventory.img} alt="" style={imgStyle}/>
                </Col>
                <Col span={10}>
                  <div style={divStyle}>
                    <p style={explainWordStyle}>{inventory.word}</p>
                    <p style={numberStyle}>{detail.godown && Number(detail.godown.panying).toFixed(2) || '0.00'}</p>
                  </div>
                </Col>
              </Card>
            </Col>
            <Col span={6}>
              <Card style={cardStyle}>
                <Col span={5} offset={2}>
                  <img src={icon_8} alt="" style={imgStyle}/>
                </Col>
                <Col span={10}>
                  <div style={divStyle}>
                    <p style={explainWordStyle}>固定资产</p>
                    <p
                      style={numberStyle}>{detail.godown && Number(detail.godown.fixed_assets_total).toFixed(2) || '0.00'}
                    </p>
                  </div>
                </Col>
              </Card>
            </Col>
          </Row>
        </Spin>
      </div>
    );
  }


}
