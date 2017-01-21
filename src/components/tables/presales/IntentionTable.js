import React from 'react';
import text from '../../../config/text';

export default class IntentionTable extends React.Component {
  render() {
    let {intention} = this.props;
    let reason = '';
    if (Number(intention.status) === -1) {
      reason = `流失原因：${intention.fail_type_names} ${intention.fail_reason}`;
    }

    return (
      <div className="ant-table ant-table-middle ant-table-bordered">
        <div className="ant-table-body">
          <table>
            <tbody className="ant-table-tbody">
            <tr className="ant-table-row  ant-table-row-level-0">
              <td>意向级别：{intention.level}</td>
              <td>意向状态：{intention.status_desc}</td>
              <td colSpan="2">{reason}</td>
            </tr>
            <tr className="ant-table-row  ant-table-row-level-0">
              <td>意向车型：{intention.auto_type_name}</td>
              <td>外观内饰：{intention.out_color_name}/{text.inColorName[Number(intention.in_color)]}</td>
              <td>购买预算：{text.budgetLevel[Number(intention.budget_level)]}</td>
              <td>按揭意愿：{text.isMortgage[Number(intention.is_mortgage)]}</td>
            </tr>
            <tr className="ant-table-row  ant-table-row-level-0">
              <td>4S给客户报价单：{intention.other_quotation}</td>
              <td>买车关注点：{intention.focus}</td>
              <td colSpan="2">加装需求：{intention.decoration}</td>
            </tr>
            <tr className="ant-table-row  ant-table-row-level-0">
              <td>销售负责人：{intention.seller_user_name}</td>
              <td>创建时间：{intention.ctime}</td>
              <td>更新时间：{intention.mtime}</td>
              <td/>
            </tr>
            <tr className="ant-table-row  ant-table-row-level-0">
              <td colSpan="3">备注：{intention.remark}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
