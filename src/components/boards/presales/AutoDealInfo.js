import React from 'react';
import {Row, Col} from 'antd';
import text from '../../../config/text';
import NewDealModal from '../../modals/presales/NewDealModal';
import EditDealModal from '../../modals/presales/EditDealModal';

export default class AutoDealInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let auto = this.props.auto, auto_id = this.props.idAuto, customer_id = this.props.id;
    let content, action;

    if (auto == undefined) {
      action = <NewDealModal customer_id={customer_id} auto_id={auto_id} size="default" isSingle={true}/>;
      content = <Row type="flex" className="info-row"><Col span={24}>暂无信息,请完善</Col></Row>;
    } else {
      action = <EditDealModal customer_id={customer_id} size="default" auto_id={auto_id}/>;

      content = (
        <div className="ant-table ant-table-middle ant-table-bordered">
          <div className="ant-table-body">
            <table>
              <tbody className="ant-table-tbody">
              <tr className="ant-table-row  ant-table-row-level-0">
                <td>销售负责人：{auto.seller_user_name}</td>
                <td>交易类型：{text.carType[Number(auto.car_type)]}</td>
                <td>付款方式：{text.autoPayType[Number(auto.pay_type)]}</td>
              </tr>
              <tr className="ant-table-row  ant-table-row-level-0">
                <td>成交时间：{auto.order_date}</td>
                <td>交车时间：{auto.deliver_date}</td>
                <td/>
              </tr>
              <tr className="ant-table-row  ant-table-row-level-0">
                <td>车辆售价(元)：{auto.sell_price}</td>
                <td>置换旧车价(元)：{auto.trade_in_price}</td>
                <td>订金(元)：{auto.deposit}</td>
              </tr>
              <tr className="ant-table-row  ant-table-row-level-0">
                <td colSpan="3">备注：{auto.remark}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    return (
      <div className="margin-bottom-20">
        <Row>
          <Col span={6} className="font-size-18">购车信息</Col>
          <Col span={6} offset={12} className="text-right">
            {action}
          </Col>
        </Row>
        {content}
      </div>
    );
  }
}
