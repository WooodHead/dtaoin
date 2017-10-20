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
  isUpProduct = e => {
    const product_id = {
      product_id: e._id,
    };
    this.props.post_marketProductOnline(product_id);
  };
  isDownProduct = e => {
    const product_id = {
      product_id: e._id,
    };
    this.props.post_marketProductOffline(product_id);
  };

  render() {
    const { isFetching, page, total, list, typeValue,hqOrOperate } = this.props;
    const columns = [
      {
        title: '产品名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '资源方产品',
        dataIndex: 'resource_product_name',
        key: 'resource_product_name',
      }, {
        title: '资源方',
        dataIndex: 'resource_name',
        key: 'resource_name',
      }, {
        title: '指定车型',
        dataIndex: 'is_specific_auto_type',
        key: 'is_specific_auto_type',
        className: !!(String(typeValue) == '2') ? '' : 'hide',
        render: (text, record) => (
          <span>
            {record.is_specific_auto_type == '0' ? '否'
              : '是'}
          </span>
        ),
      }, {
        title: '产品状态',
        dataIndex: 'status_name',
        key: 'status_name',
        className: 'center',
        width: 180,
        render: (text, record) => (
          <div>
            {record.status_name == '使用中' ? <Badge status="success" text="使用中" />
              : <Badge status="default" text="已下架" />}
          </div>
        ),
      }, {
        title: '操作',
        key: 'action',
        width: 180,
        className: 'center',
        render: (text, record) => (
          <div>
            {this.props.hqOrOperate ? (
              record.status_name == '使用中' ? <span>
	              <Link to={{ pathname: `/new-car/product/editDetail/${record._id}` }}
                      target="_blank">
                 	编辑
                 </Link>
		    		  <span className="ant-divider" />
                 <Popconfirm title="你确定要下架此产品吗?" data_id={record.key}
                             onConfirm={() => this.isDownProduct(record)}
                             onCancel={this.cancel} okText="确定" cancelText="取消">
                  <a href="#">下架</a>
                </Popconfirm>
                <span className="ant-divider" />
                  {this.props.typeValue == 1 ?
                    <Link to={{ pathname: `/new-car/programme-car/new/addVehiclePlay/${record._id}` }}
                          target="_blank">
                      创建方案</Link>
                    : <Link
                      to={{ pathname: `/new-car/programme-car/new/addFinancialPlan/${record._id}` }}
                      target="_blank">
                      创建方案</Link>
                  }
		      </span>
                : <span>
	              <Link to={{ pathname: `/new-car/product/editDetail/${record._id}` }}
                      target="_blank">
                 	编辑
                 </Link>
                <span className="ant-divider" />
                <Popconfirm title="你确定要上架此产品吗?" onConfirm={() => this.isUpProduct(record)}
                            onCancel={this.cancel}
                            okText="确定" cancelText="取消">
                  <a href="#">上架</a>
                </Popconfirm>
	        </span>
            ) : (
              record.status_name == '使用中' ? <span>
		    		 <Link to={{ pathname: `/new-car/product/editDetail/${record._id}` }} target="_blank">
                 	详情
                 </Link>
		    		  <span className="ant-divider" />

                  {this.props.typeValue == 2 ? <Link
                      to={{ pathname: `/new-car/programme-car/new/addFinancialPlan/${record.customer_id}` }}
                      target="_blank">
                      创建方案</Link>
                    : <Link
                      to={{ pathname: `/new-car/programme-car/new/addVehiclePlay/${record.customer_id}` }}
                      target="_blank">
                      创建方案</Link>
                  }

		      </span>
                : <span>
		    	     <Link to={{ pathname: `/new-car/product/editDetail/${record._id}` }} target="_blank">
                 	详情
                 </Link>
		      </span>
            )

            }


          </div>
        ),
      }];
    return (
      <TableWithPagination
        isLoading={this.props.isFetching}
        columns={columns}
        dataSource={list}
        total={total}
        currentPage={page}
        onPageChange={this.props.updatePage}
      />

    );
  }
}
