import React from 'react';
import { Alert, Button, Checkbox, Col, Icon, Input, Row, Switch, Table, Tooltip } from 'antd';

const CheckboxGroup = Checkbox.Group;
const InputGroup = Input.Group;
require('./index.less');

export default class HQRiskControlRequirement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      columns: null,
      isUpLimitValue: false,
      creditRecordChange: '',
      checkedTic: '',
      carPricMinValue: '请输入',
      risk_loan: 0,
      risk_house: 0,
      risk_bank_record: 0,
      risk_credit_record: '',
      risk_resident_permit: 0,
      min_auto_price: 0,
      max_auto_price: 0,
      risk_loan_txt: '',
      risk_house_txt: '',
      risk_bank_record_txt: '',
      risk_resident_permit_txt: '',
      is_specific_auto_type: false,
    };
  }

  emitEmpty = () => {
    this.userNameInput.focus();
    this.setState({ userName: '' });
  };
  onChangeUserName = e => {
    this.setState({ userName: e.target.value });
  };

  componentWillMount() {
    const plainOptions = ['征信白户', '信用很差', '信用较差', '信用良好'];
    const columns = [
      {
        title: '要求名称',
        dataIndex: 'name',
        key: 'name',
        render: text => <a href="#">{text}</a>,
      }, {
        title: '风控条件',
        key: 'action',
        render: (text, record) => (
          <span>
        {record.key == '3' ? <span>
              <CheckboxGroup options={plainOptions} onChange={this.creditRecord} />
            </span>
          : <span>
             <Checkbox onChange={this.creditRecordNo} className="checkboxCopy"
                       id={record.name}>无法提供</Checkbox>
            </span>
        }
          </span>

        ),
      }];
    this.setState({
      columns,
    });
  }

  isUpLimit = e => {
    this.setState({
      isUpLimitValue: e.target.checked,
      max_auto_price: 10000000,
    });
  };
  creditRecord = e => {
    const risk_credit_record_str = [];
    for (let i = 0; i < e.length; i++) {
      if (e[i] == '征信白户') {
        risk_credit_record_str.push('105');
      }
      if (e[i] == '信用很差') {
        risk_credit_record_str.push('104');
      }
      if (e[i] == '信用较差') {
        risk_credit_record_str.push('103');
      }
      if (e[i] == '信用良好') {
        risk_credit_record_str.push('102');
      }
    }
    const risk_credit_record = risk_credit_record_str.join(',');
    this.setState({
      creditRecordChange: `征信记录为${  e  }，`,
      risk_credit_record,
    });
  };
  creditRecordNo = e => {
    if (e.target.checked) {
      switch (e.target.id) {
      case '银行流水':
        this.setState({
          risk_bank_record: 1,
          risk_bank_record_txt: '无法提供银行流水，',
        });
        break;
      case '信用卡／房贷／车贷／银行贷款':
        this.setState({
          risk_loan: 1,
          risk_loan_txt: '无法提供 信用卡／房贷／车贷／银行贷款，',
        });
        break;
      case '房产证':
        this.setState({
          risk_house: 1,
          risk_house_txt: '无法提供 房产证，',
        });
        break;
      case '居住证':
        this.setState({
          risk_resident_permit: 1,
          risk_resident_permit_txt: '无法提供 居住证，',
        });
        break;
      default:
      }
    }
    if (!e.target.checked) {
      switch (e.target.id) {
      case '银行流水':
        this.setState({
          risk_bank_record: 0,
          risk_bank_record_txt: '',
        });
        break;
      case '信用卡／房贷／车贷／银行贷款':
        this.setState({
          risk_loan: 0,
          risk_loan_txt: '',
        });
        break;
      case '房产证':
        this.setState({
          risk_house_txt: '',
          risk_house: 0,
        });
        break;
      case '居住证':
        this.setState({
          risk_resident_permit_txt: '',
          risk_resident_permit: 0,
        });
        break;
      default:
      }
    }
  };
  carPricMin = e => {
    this.setState({
      min_auto_price: this.refs.carPricMin.refs.input.value,
    });
  };
  carPricMax = e => {
    this.setState({
      max_auto_price: this.refs.carPricMax.refs.input.value,
    });
  };
  sureRiskControl = () => {
    const product_id = this.props.postProductCreateRes.detail._id;
    let is_specific_auto_type = 0;
    if (this.state.is_specific_auto_type) {
      is_specific_auto_type = 1;
    } else {
      is_specific_auto_type = 0;
    }
    if (this.props.typeValue == '1') {
      const data = {
        product_id,
        min_auto_price: this.state.min_auto_price,
        max_auto_price: this.state.max_auto_price,
        risk_loan: this.state.risk_loan,
        risk_house: this.state.risk_house,
        risk_bank_record: this.state.risk_bank_record,
        risk_credit_record: this.state.risk_credit_record,
        risk_resident_permit: this.state.risk_resident_permit,
      };
      this.props.post_markertPeditRisk(data);
    }
    if (this.props.typeValue == '2') {
      const data = {
        product_id,
        min_auto_price: this.state.min_auto_price,
        max_auto_price: this.state.max_auto_price,
        risk_loan: this.state.risk_loan,
        risk_house: this.state.risk_house,
        risk_bank_record: this.state.risk_bank_record,
        risk_credit_record: this.state.risk_credit_record,
        risk_resident_permit: this.state.risk_resident_permit,
        is_specific_auto_type,
      };
      this.props.post_markertPeditRisk(data);
    }
  };
  is_specific_auto_type_fun = e => {
    this.setState({
      is_specific_auto_type: e,
    });
  };

  render() {
    const data = [
      {
        key: '1',
        name: '银行流水',

      }, {
        key: '2',
        name: '信用卡／房贷／车贷／银行贷款',
      }, {
        key: '3',
        name: '征信记录',
      }, {
        key: '4',
        name: '房产证',
      }, {
        key: '5',
        name: '居住证',
      }];
    return (
      <div className="hqRisk">
        <Row className="head-action-bar-line mb20">
          <h4>车辆风控</h4>
        </Row>

        <Row className="mb20">
          <Col>
            <InputGroup>
              <label style={{ width: 80, float: 'left', lineHeight: '26px' }}>车价范围：</label>
              <Input
                addonAfter={'元'}
                type="number"
                ref="carPricMin"
                placeholder="请输入"
                onBlur={this.carPricMin}
                style={{ width: 200, float: 'left' }}
              />
              <Input
                style={{
                  width: 30,
                  borderLeft: 0,
                  border: 'none',
                  pointerEvents: 'none',
                  backgroundColor: '#fff',
                  textAlign: 'center',
                }}
                placeholder="-" disabled
              />
              <Input
                disabled={this.state.isUpLimitValue}
                onBlur={this.carPricMax}
                type="number"
                ref="carPricMax"
                addonAfter={'元'}
                placeholder="请输入"
                style={{ width: 200, float: 'left' }}
              />
              <Checkbox
                onChange={this.isUpLimit}
                style={{ float: 'left', lineHeight: '26px', marginLeft: 10 }}
              >上限不限</Checkbox>
            </InputGroup>

          </Col>
        </Row>

        {this.props.typeValue == '2' ? <Row className="mb40">
            <Col>
              <Tooltip title="该产品仅对部分固定的车型，则需要指定车型">
                <Icon type="question-circle-o" />
              </Tooltip>
              <label>指定车型：</label>
              <Switch checkedChildren="有" unCheckedChildren="无"
                      defaultChecked={this.state.is_specific_auto_type}
                      onChange={this.is_specific_auto_type_fun} />
            </Col>
          </Row>
          : ''}
        <Row className="head-action-bar-line mb20">
          <h4>资质风控</h4>
        </Row>
        <Alert message="资质风控部分请设置该产品不允许的风控条件。" type="info" showIcon />
        <Row style={{ marginBottom: 30, marginTop: 20 }}>
          <Col span={24}>
            <label>说明：</label>
            若客户&nbsp;
            {this.state.checkedTic}
            {this.state.risk_bank_record_txt}
            {this.state.risk_loan_txt}
            {this.state.creditRecordChange}
            {this.state.risk_house_txt}
            {this.state.risk_resident_permit_txt}
            &nbsp;则无法进行该方案
          </Col>
        </Row>

        <Table
          columns={this.state.columns}
          pagination={false}
          dataSource={data}
        />

        <Row type="flex" justify="center" style={{ marginTop: 20 }}>
          <Col span={4}>
            <Button type="primary" onClick={this.sureRiskControl}>保存</Button>
          </Col>
        </Row>
      </div>
    );
  }
}
