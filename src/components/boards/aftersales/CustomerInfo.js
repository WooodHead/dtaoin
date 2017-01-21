import React from 'react';
import {Button} from 'antd';
import api from '../../../middleware/api';
import text from '../../../config/text';
import ImagePreview from '../../modals/ImagePreview';
import EditCustomerModal from '../../../containers/customer/Edit';
import MemberDetailModal from '../../../containers/customer/MemberDetail';
import CreateRemind from '../../modals/aftersales/CreateRemind';

export default class CustomerInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      memberDetail: [],
    };
  }


  componentWillReceiveProps(props) {
    let memberDetail = this.state.memberDetail;
    if (props.detail._id && (!memberDetail || memberDetail.length === 0)) {
      this.getMemberDatail(props.detail._id);
    }
  }

  getMemberDatail(customerId) {
    api.ajax({url: api.statistics.getMemberDetail(customerId, 1, 0)}, (data) => {
      this.setState({memberDetail: data.res.list});
    });
  }

  render() {
    let {detail} = this.props;
    let idCardImages = [];
    let driverLicenceImage = [];

    if (detail.id_card_pic_front) {
      idCardImages.push({
        title: '身份证正面',
        url: api.customer.getFileUrl(detail._id, 'id_card_pic_front'),
      });
    }
    if (detail.id_card_pic_back) {
      idCardImages.push({
        title: '身份证背面',
        url: api.customer.getFileUrl(detail._id, 'id_card_pic_back'),
      });
    }
    if (detail.driver_license_front) {
      driverLicenceImage.push({
        title: `${detail.name}-驾驶证正面`,
        url: api.customer.getFileUrl(detail._id, 'driver_license_front'),
      });
    }
    if (detail.driver_license_back) {
      driverLicenceImage.push({
        title: `${detail.name}-驾驶证背面`,
        url: api.customer.getFileUrl(detail._id, 'driver_license_back'),
      });
    }
    return (
      <div className="ant-table ant-table-middle ant-table-bordered ">
        <div className="ant-table-body">
          <p className="margin-left-20 margin-bottom-10"
             style={{fontSize: '16px'}}
          >
            客户信息
            <span style={{float: 'right'}}><EditCustomerModal customer_id={detail._id}/></span>
            <span className="margin-right-20" style={{float: 'right'}}><CreateRemind customer_id={detail._id}/></span>
          </p>
          <table>
            <tbody className="ant-table-tbody">
            <tr className="ant-table-row  ant-table-row-level-0">
              <td>姓名：{detail.name}</td>
              <td>性别：{text.gender[Number(detail.gender)]}</td>
              <td>手机号：{detail.phone}</td>
              <td>{''}</td>
            </tr>
            <tr className="ant-table-row  ant-table-row-level-0">
              <td>
                会员卡：
                {detail.member_card_name || '无'}
                <MemberDetailModal memberDetail={this.state.memberDetail}/>
                <a href={detail.wx_consume_url} target="_blank" className={detail.wx_consume_url ? '' : 'hide'}>
                  <Button type="primary" size="small">会员卡核销</Button>
                </a>
              </td>
              <td>卡号：{detail.member_card_number || '-'}</td>
              <td>开卡日期：{detail.member_start_date || '-'}</td>
              <td>到期日期：{detail.member_expire_date || '-'}</td>
            </tr>
            <tr className="ant-table-row  ant-table-row-level-0">
              <td>微信号：{detail.weixin}</td>
              <td>QQ：{detail.qq}</td>
              <td>邮箱：{detail.mail}</td>
              <td>{''}</td>
            </tr>
            <tr className="ant-table-row  ant-table-row-level-0">
              <td>常住地址：{detail.address}</td>
              <td>身份证地址：{detail.id_card_address}</td>
              <td>身份证号：{detail.id_card_num}</td>
              <td>
                身份证照片:
                <ImagePreview
                  title={`${detail.name}-身份证`}
                  images={idCardImages}
                  disabled={!detail.id_card_pic_front}
                />
              </td>
            </tr>
            <tr className="ant-table-row  ant-table-row-level-0">
              <td>驾驶证号：{detail.driver_license_num}</td>
              <td>
                驾驶证照片:
                <ImagePreview
                  title="驾驶证"
                  images={driverLicenceImage}
                  disabled={!detail.id_card_pic_front}
                />
              </td>
              <td>创建时间：{detail.ctime}</td>
              <td>更新时间：{detail.mtime}</td>
            </tr>
            <tr className="ant-table-row  ant-table-row-level-0">
              <td colSpan="4">备注：{detail.remark}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
