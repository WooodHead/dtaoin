import React from 'react';
import {Row, Col} from 'antd';
import EditDecorationModal from '../../modals/presales/EditDecorationModal';
import NewDecorationModal from '../../modals/presales/NewDecorationModal';

export default class DecorationInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let auto = this.props.auto, auto_id = this.props.idAuto, customer_id = this.props.id;
    let content = [], action = [];

    if (auto == undefined) {
      action = <NewDecorationModal customer_id={customer_id} auto_id={auto_id} isSingle={true}/>;
      content = <Row type="flex" className="info-row"><Col span={24}>暂无信息,请完善</Col></Row>;
    } else {
      action = <EditDecorationModal customer_id={customer_id} auto_id={auto_id}/>;
      content = (
        <div className="ant-table ant-table-middle ant-table-bordered">
          <div className="ant-table-body">
            <table>
              <tbody className="ant-table-tbody">
              <tr className="ant-table-row  ant-table-row-level-0">
                <td>装潢时间：{auto.deal_date}</td>
                <td>装潢内容：{auto.content}</td>
                <td>装潢金额(元)：{auto.price}</td>
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
          <Col span={6} className="font-size-18">装饰信息</Col>
          <Col span={6} offset={12} className="text-right">
            {action}
          </Col>
        </Row>
        {content}
      </div>
    );
  }
}
