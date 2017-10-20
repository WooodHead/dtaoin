import React from 'react';
import { Col, Modal, Row } from 'antd';
import BaseModal from '../../components/base/BaseModal';

require('./style.less');

const InsuranceGroups = [
  { key: ['CheSun', 'BuJiMianCheSun'], name: '车辆损失险' },
  { key: ['SanZhe', 'BuJiMianSanZhe'], name: '第三方责任险' },
  { key: ['DaoQiang', 'BuJiMianDaoQiang'], name: '全车盗抢险' },
  { key: ['SiJi', 'BuJiMianSiJi'], name: '车上人员责任险(司机)' },
  { key: ['ChengKe', 'BuJiMianChengKe'], name: '车上人员责任险(乘客)' },
  { key: ['HuaHen', 'BuJiMianHuaHen'], name: '车身划痕损失险' },
  { key: ['SheShui', 'BuJiMianSheShui'], name: '涉水行驶损失险' },
  { key: ['ZiRan', 'BuJiMianZiRan'], name: '自燃损失险' },
  { key: ['HcJingShenSunShi', 'BuJiMianJingShenSunShi'], name: '精神损失险' },
  { key: ['BoLi'], name: '玻璃单独破碎险' },
  { key: ['HcSanFangTeYue'], name: '机动车无法找到第三方特约险' },
];

const assembleData = function(rawData) {
  // 不显示未投保险种
  const InsuranceData = [];
  InsuranceGroups.map(group => {
    const key0 = group.key[0];
    const key1 = group.key[1];
    const amount = Number(key0 && rawData[key0] ? rawData[key0] : 0);
    if (amount) {
      InsuranceData.push({
        name: group.name,
        amount: amount.toFixed(2),
        excluding: key1 && rawData[key1] ? '投保' : '未投保',
      });
    }
  });
  return InsuranceData;

  // 显示未投保险种
  // return InsuranceGroups.map((group) => {
  //   let key0 = group.key[0];
  //   let key1 = group.key[1];
  //   return {
  //     name: group.name,
  //     amount: Number(key0 && rawData[key0] ? rawData[key0] : 0).toFixed(2),
  //     excluding: key1 && rawData[key1] ? '投保' : '未投保',
  //   };
  // });
};

export default class InsuranceItemDetail extends BaseModal {

  constructor(props) {
    super(props);
    this.state = {
      data: assembleData(props.data || {}),
    };
  }

  render() {
    const { data } = this.state;

    return (
      <Modal
        visible
        title={'投保险种'}
        onCancel={this.props.onCancel}
        footer={null}
      >
        <div className="list-container">
          <div className="list-header">
            <Row>
              <Col span={12}>
                <div>险种</div>
              </Col>
              <Col span={6}>
                <div className="text-right">保额</div>
              </Col>
              <Col span={6}>
                <div className="text-right">不计免赔</div>
              </Col>
            </Row>
          </div>

          {data.length > 0 ? data.map(item => (
              <div className="list-line" key={item.name}>
                <Row>
                  <Col span={12}>
                    <div>{item.name}</div>
                  </Col>
                  <Col span={6}>
                    <div className="text-right">{item.amount}</div>
                  </Col>
                  <Col span={6}>
                    <div className="text-right">{item.excluding}</div>
                  </Col>
                </Row>
              </div>
            ))
            : <div className="center text-gray-999">暂无数据</div>
          }
        </div>
      </Modal>
    );
  }
}
