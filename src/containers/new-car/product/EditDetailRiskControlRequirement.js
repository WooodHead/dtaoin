import React from 'react';
import {
  Table,
  Icon,
  Tabs,
  Row,
  Col,
  Input,
  Select,
  Checkbox,
  Alert,
  Button,
  Switch,
  Tooltip,
} from 'antd';

const CheckboxGroup = Checkbox.Group;
const InputGroup = Input.Group;
require('./index.less');

export default class EditDetailRiskControlRequirement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGetDetail: false,
      userName: '',
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
      arryCreditRecordName: [],
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

  componentDidMount() {
    if (this.props.getProductDetailRes.max_auto_price == '10000000') {
      this.setState({
        isUpLimitValue: true,
      });
    }
    const getProductDetailRes = this.props.getProductDetailRes;
    if (getProductDetailRes) {
      const arryCreditRecord = getProductDetailRes.risk_credit_record.split(',');

      const arryCreditRecordName = [];
      for (let i = 0; i < arryCreditRecord.length; i++) {
        if (arryCreditRecord[i] == '105') {
          arryCreditRecordName.push('征信白户');
        }
        if (arryCreditRecord[i] == '104') {
          arryCreditRecordName.push('信用很差');
        }
        if (arryCreditRecord[i] == '103') {
          arryCreditRecordName.push('信用较差');
        }
        if (arryCreditRecord[i] == '102') {
          arryCreditRecordName.push('信用良好');
        }
      }
      this.setState({
        arryCreditRecordName,
        min_auto_price: getProductDetailRes.min_auto_price,
        max_auto_price: getProductDetailRes.max_auto_price,
        risk_loan: getProductDetailRes.risk_loan,
        risk_house: getProductDetailRes.risk_house,
        risk_bank_record: getProductDetailRes.risk_bank_record,
        risk_credit_record: getProductDetailRes.risk_credit_record,
        risk_resident_permit: getProductDetailRes.risk_resident_permit,
      });
      if (getProductDetailRes.is_specific_auto_type &&
        (getProductDetailRes.is_specific_auto_type == 1)) {
        this.setState({
          is_specific_auto_type: true,
        });
      }
      
      if (getProductDetailRes.is_specific_auto_type &&
        (getProductDetailRes.is_specific_auto_type == 0)) {
        this.setState({
          is_specific_auto_type: false,
        });
      }
      
      if (getProductDetailRes.risk_bank_record == '1') {
        this.setState({
          risk_bank_record_txt: '无法提供银行流水,',
        });
      }
      
      if (getProductDetailRes.risk_loan == '1') {
        this.setState({
          risk_loan_txt: '无法提供 信用卡／房贷／车贷／银行贷款，',
        });
      }
      
      if (getProductDetailRes.risk_house == '1') {
        this.setState({
          risk_house_txt: '无法提供 房产证，',
        });
      }
      
      if (getProductDetailRes.risk_resident_permit == '1') {
        this.setState({
          risk_resident_permit_txt: '无法提供 居住证，',
        });
      }
      
      // 征信记录转换
      if (getProductDetailRes.risk_credit_record) {
        const arry_risk_credit_record = getProductDetailRes.risk_credit_record.split(',');
        const creditRecordChange = [];
        for (let i = 0; i < arry_risk_credit_record.length; i++) {
          if (arry_risk_credit_record[i] == '105') {
            creditRecordChange.push('征信白户');
          }
          
          if (arry_risk_credit_record[i] == '104') {
            creditRecordChange.push('信用很差');
          }
          
          if (arry_risk_credit_record[i] == '103') {
            creditRecordChange.push('信用较差');
          }
          if (arry_risk_credit_record[i] == '102') {
            creditRecordChange.push('信用良好');
          }
        }
        this.setState({
          creditRecordChange: `征信记录为：${  creditRecordChange.join(',')  },`,
        });
      }
    }
  }

  isUpLimit = e => {
    console.log(e.target.checked);
    this.setState({
      isUpLimitValue: e.target.checked,
      max_auto_price: 10000000,
    });
  };
  creditRecord = e => {
    const risk_credit_record_str = [];
    for (let i = 0; i < e.length; i++) {
      console.log(e[i]);
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
      arryCreditRecordName: e,
      creditRecordChange: `征信记录为${  e  },`,
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
          risk_resident_permit: 0,
          risk_resident_permit_txt: '',
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
    let is_specific_auto_type = 0;
    if (this.state.is_specific_auto_type) {
      is_specific_auto_type = 1;
    } else {
      is_specific_auto_type = 0;
    }
    if (this.props.getProductDetailRes.type == 1) {
      const data = {
        product_id: this.props.product_id,
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
    if (this.props.getProductDetailRes.type == 2) {
      const data = {
        product_id: this.props.product_id,
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
    const getProductDetailRes = this.props.getProductDetailRes;
    const { risk_loan, risk_house, risk_bank_record, risk_resident_permit, arryCreditRecordName } = this.state;
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
        {record.key == '3'
          ? <span>
              <CheckboxGroup
                disabled={this.props.hqOrOperate}
                value={arryCreditRecordName ? arryCreditRecordName : []}
                options={plainOptions}
                onChange={this.creditRecord}
              />
            </span>
          : <span>
               <Checkbox
                 disabled={this.props.hqOrOperate}
                 onChange={this.creditRecordNo}
                 checked={String(record.value_id) === '1'}
                 className="checkboxCopy"
                 id={record.name}
               >
                 无法提供
               </Checkbox>
            </span>
        }
          </span>

        ),
      }];
    const data = [
      {
        key: '1',
        name: '银行流水',
        value_id: risk_bank_record,
      }, {
        key: '2',
        value_id: risk_loan,
        name: '信用卡／房贷／车贷／银行贷款',
      }, {
        key: '3',
        name: '征信记录',
      }, {
        key: '4',
        name: '房产证',
        value_id: risk_house,
      }, {
        key: '5',
        name: '居住证',
        value_id: risk_resident_permit,
      }];
    return (
      <div className="hqRisk">
        <Row className="head-action-bar-line mb20">
          <h4>车辆风控</h4>
        </Row>
        <Row className="mb20">
            <Col>
              <InputGroup>
                  <label style={{ width:80,float:'left',lineHeight:'26px' }}>车价范围：</label>
                  <Input
                    addonAfter={'元'}
                    disabled={this.props.hqOrOperate}
                    defaultValue={getProductDetailRes.min_auto_price}
                    type="number" ref="carPricMin" placeholder="请输入"
                    onBlur={this.carPricMin}
                    style={{ width:200,float:'left' }}
                  />
                <Input
                  style={{
                    width: 30,
                    borderLeft: 0,
                    border: 'none',
                    pointerEvents: 'none',
                    backgroundColor: '#fff',
                    float:'left',
                    textAlign:'center',
                  }}
                  placeholder="-"
                  disabled
                />
                  <Input disabled={this.props.hqOrOperate ? true : this.state.isUpLimitValue}
                         defaultValue={getProductDetailRes.min_auto_price == '10000000'
                           ? '' : getProductDetailRes.max_auto_price} onBlur={this.carPricMax}
                         type="number"
                         ref="carPricMax"
                         addonAfter={'元'}
                         placeholder="请输入"
                         style={{ width:200,float:'left' }}
                  />
                <Checkbox disabled={this.props.hqOrOperate} onChange={this.isUpLimit}
                          defaultChecked={getProductDetailRes.max_auto_price == '10000000'}
                          style={{ float:'left',lineHeight:'26px',marginLeft:10 }}
                >上限不限</Checkbox>
              </InputGroup>

            </Col>
        </Row>
        {this.props.getProductDetailRes.type == 2 ?
          <Row className="mb40">
            <Col>
                <Tooltip title="该产品仅对部分固定的车型，则需要指定车型">
                  <Icon type="question-circle-o" />
                </Tooltip>
                <label>指定车型：</label>
                <Switch checkedChildren="有" unCheckedChildren="无"
                        defaultChecked={this.props.getProductDetailRes.is_specific_auto_type != '0'}
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
            {this.state.risk_house_txt}
            {this.state.risk_resident_permit_txt}
            {this.state.creditRecordChange}
            &nbsp;则无法进行该方案
          </Col>
        </Row>

        <Table columns={columns} pagination={false} dataSource={data} />

        <Row type="flex" justify="center" style={{ marginTop: 20 }}>
          <Col span={4}>
            <Button
              disabled={this.props.hqOrOperate}
              type="primary"
              onClick={this.sureRiskControl}
            >
              保存
            </Button>
          </Col>
        </Row>
      </div>

    );
  }
}
