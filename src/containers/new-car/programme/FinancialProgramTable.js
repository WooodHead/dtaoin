import React from 'react';
import { Link } from 'react-router-dom';

import { message, Popconfirm, Icon, Badge } from 'antd';
import api from '../../../middleware/api';
import formatter from '../../../utils/DateFormatter';
import TableWithPagination from '../../../components/widget/TableWithPagination';

export default class TableIntention extends React.Component {
  cancel = e => {
    message.error('Click on No');
  };
  isUpPlan = e => {
    console.log(e);
    const plan_id = {
      plan_id: e._id,
    };
    this.props.post_marketPlanOnline(plan_id);
  };
  isDownPlan = e => {
    console.log(e);
    const plan_id = {
      plan_id: e._id,
    };
    this.props.post_marketPlanOffline(plan_id);
  };
  render() {
    const { isFetching, page, total, list ,hqOrOperate } = this.props;
    const columns = [
      {
        title: '车辆名称',
        dataIndex: 'auto_type_name',
        key: 'auto_type_name',
      }, {
        title: '产品名称',
        dataIndex: 'product_name',
        key: 'product_name',
      }, {
        title: '指导价',
        dataIndex: 'guide_price',
        key: 'guide_price',
      }, {
        title: '资源方产品',
        dataIndex: 'resource_product_name',
        key: 'resource_product_name',
      },{
        title: '资源方',
        dataIndex: 'resource_name',
        key: 'resource_name',
      }, {
        title: '方案状态',
        dataIndex: 'status_name',
        key: 'status_name',
        className: 'center',
        width: '80px',
        render: (text, record) => (
          <div>
            {record.status_name == '使用中' ? <Badge status="success" text="使用中" />
              : <Badge status="default" text="已下架" />}
          </div>
        ),
      }, {
        title: '操作',
        key: 'action',
        className: 'center',
        width: '180px',
        render: (text, record) => (
          <div>

            {record.status_name == '使用中' ? <span>
					<Link to={{ pathname: `/new-car/programme-car/new/editFinancialPlan/${record._id}` }}
                    target="_blank">
                     编辑
                   </Link>
		    		  <span className="ant-divider" />
                 <Popconfirm title="你确定要下架此产品吗?" data_id={record.key}
                             onConfirm={() => this.isDownPlan(record)}
                             onCancel={this.cancel} okText="确定" cancelText="取消">
                  <a href="#">下架</a>
                </Popconfirm>
		      </span>
              : <span>
	               <Link to={{ pathname: `/new-car/programme-car/new/editFinancialPlan/${record._id}` }}
                    target="_blank">
                     编辑
                   </Link>
                <span className="ant-divider" />
                <Popconfirm title="你确定要上架此产品吗?" onConfirm={() => this.isUpPlan(record)}
                            onCancel={this.cancel}
                            okText="确定" cancelText="取消">
                  <a href="#">上架</a>
                </Popconfirm>
	        </span>
            }
          </div>
        ),
      }];
    return (
      <TableWithPagination
        isLoading={isFetching}
        columns={columns}
        dataSource={list}
        total={total}
        currentPage={page}
        onPageChange={this.props.updatePage}
      />
    );
  }
}
