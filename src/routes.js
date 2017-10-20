import React from 'react';
import { Redirect } from 'react-router-dom';

import api from './middleware/api';
import LazyRoute from 'lazy-route';

import Home from './containers/Home';
import OverView from './containers/overview/Index';

const routers = [
  {
    path: '/',
    breadcrumbName: '首页/',
    exact: true,
    render: () => api.isLogin() ? <Redirect to="/home" /> : <Redirect to="/login" />,
  }, {
    path: '/home',
    exact: true,
    breadcrumbName: '首页/',
    render: () => api.isHeadquarters() ? <OverView /> : <Home />,
  }, {
    path: '/customer/detail/',
    breadcrumbName: '客户管理/详情',
    exact: true,
    render: props => <LazyRoute {...props} component={import('./containers/customer/Detail')} />,
  }, {
    path: '/customer/detail/:customerId',
    breadcrumbName: '客户管理/详情',
    exact: true,
    render: props => <LazyRoute {...props} component={import('./containers/customer/Detail')} />,
  }, {
    path: '/presales/potential/index',
    breadcrumbName: '销售/意向客户/列表',
    exact: true,
    render: props => <LazyRoute {...props}
                                component={import('./containers/presales/potential/List')} />,
  }, {
    breadcrumbName: '销售/成交车辆/列表',
    path: '/presales/deal/index',
    render: props => <LazyRoute {...props}
                                component={import('./containers/presales/deal/List')} />,
  }, {
    exact: true,
    breadcrumbName: '销售/成交车辆/新增',
    path: '/presales/deal/new',
    render: props => <LazyRoute {...props}
                                component={import('./containers/presales/deal/New')} />,
  }, {
    exact: true,
    breadcrumbName: '销售/成交车辆/新增',
    path: '/presales/deal/new/:customerId/:intentionId',
    render: props => <LazyRoute {...props}
                                component={import('./containers/presales/deal/New')} />,
  }, {
    exact: true,
    breadcrumbName: '销售/成交车辆/新增',
    path: '/presales/deal/new/:customerId/:autoId/:intentionId',
    render: props => <LazyRoute {...props}
                                component={import('./containers/presales/deal/New')} />,
  }, {
    exact: true,
    breadcrumbName: '销售/成交车辆/详情',
    path: '/presales/deal/detail',
    render: props => <LazyRoute {...props}
                                component={import('./containers/presales/deal/New')} />,
  }, {
    exact: true,
    breadcrumbName: '销售/成交车辆/详情',
    path: '/presales/deal/detail/:autoDealId/:customerId/:intentionId',
    render: props => <LazyRoute {...props}
                                component={import('./containers/presales/deal/New')} />,
  }, {
    exact: true,
    breadcrumbName: '销售/成交车辆/详情',
    path: '/presales/deal/detail/:autoDealId/:customerId/:autoId/:intentionId',
    render: props => <LazyRoute {...props}
                                component={import('./containers/presales/deal/New')} />,
  }, {
    breadcrumbName: '销售/成交车辆/结算单',
    exact: true,
    path: '/presales/deal/clearing',
    render: props => <LazyRoute {...props}
                                component={import('./containers/presales/deal/Clearing')} />,
  }, {
    breadcrumbName: '销售/成交车辆/结算单',
    path: '/presales/deal/clearing/:id',
    render: props => <LazyRoute {...props}
                                component={import('./containers/presales/deal/Clearing')} />,
  }, {
    breadcrumbName: '售后/工单管理/列表',
    path: '/aftersales/project/index',
    render: props => <LazyRoute {...props}
                                component={import('./containers/aftersales/project/List')} />,
  }, {
    exact: true,
    breadcrumbName: '售后/工单管理/新增',
    path: '/aftersales/project/new',
    render: props => <LazyRoute {...props}
                                component={import('./containers/aftersales/project/New')} />,
  }, {
    exact: true,
    breadcrumbName: '售后/工单管理/新增',
    path: '/aftersales/project/new/:id',
    render: props => <LazyRoute {...props}
                                component={import('./containers/aftersales/project/New')} />,
  }, {
    exact: true,
    breadcrumbName: '售后/工单管理/新增',
    path: '/aftersales/project/new/:customerId/:autoId',
    render: props => <LazyRoute {...props}
                                component={import('./containers/aftersales/project/New')} />,
  }, {
    exact: true,
    breadcrumbName: '售后/工单管理/编辑',
    path: '/aftersales/project/edit',
    render: props => <LazyRoute {...props}
                                component={import('./containers/aftersales/project/New')} />,
  }, {
    exact: true,
    breadcrumbName: '售后/工单管理/编辑',
    path: '/aftersales/project/edit/:id',
    render: props => <LazyRoute {...props}
                                component={import('./containers/aftersales/project/New')} />,
  }, {
    exact: true,
    breadcrumbName: '售后/工单管理/编辑',
    path: '/aftersales/project/edit/:id/:autoId',
    render: props => <LazyRoute {...props}
                                component={import('./containers/aftersales/project/New')} />,
  }, {
    exact: true,
    breadcrumbName: '售后/工单管理/编辑',
    path: '/aftersales/project/edit/:id/:customerId/:autoId',
    render: props => <LazyRoute {...props}
                                component={import('./containers/aftersales/project/New')} />,
  }, {
    exact: true,
    breadcrumbName: '售后/工单管理/详情',
    path: '/aftersales/project/detail/:id',
    render: props => <LazyRoute {...props}
                                component={import('./containers/aftersales/project/New')} />,
  }, {
    exact: true,
    breadcrumbName: '售后/工单管理/详情',
    path: '/aftersales/project/detail/:id/:autoId',
    render: props => <LazyRoute {...props}
                                component={import('./containers/aftersales/project/New')} />,
  }, {
    exact: true,
    breadcrumbName: '售后/工单管理/详情',
    path: '/aftersales/project/detail/:id/:autoId/:customerId',
    render: props => <LazyRoute {...props}
                                component={import('./containers/aftersales/project/New')} />,
  }, {
    breadcrumbName: '售后/销售单管理',
    path: '/aftersales/part-sale/index',
    render: props => <LazyRoute {...props}
                                component={import('./containers/aftersales/part-sale/List')} />,
  }, {
    breadcrumbName: '售后/销售管理/创建销售单',
    path: '/aftersales/part-sale/new',
    render: props => <LazyRoute {...props}
                                component={import('./containers/aftersales/part-sale/New')} />,
  }, {
    breadcrumbName: '售后/销售管理/编辑销售单',
    path: '/aftersales/part-sale/edit/:id',
    render: props => <LazyRoute {...props}
                                component={import('./containers/aftersales/part-sale/New')} />,
  }, {
    exact: true,
    breadcrumbName: '售后/耗材领用/列表',
    path: '/aftersales/consumptive-material/index',
    render: props => <LazyRoute {...props}
                                component={import('./containers/aftersales/consumptive-material/List')} />,
  }, {
    breadcrumbName: '售后/耗材领用/列表',
    path: '/aftersales/consumptive-material/index/:consumptiveShow',
    render: props => <LazyRoute {...props}
                                component={import('./containers/aftersales/consumptive-material/List')} />,
  }, {
    exact: true,
    breadcrumbName: '售后/客户管理/列表',
    path: '/aftersales/customer/index',
    render: props => <LazyRoute {...props}
                                component={import('./containers/customer/List')} />,
  }/* , {
    exact: true,
    breadcrumbName: '售后/客户管理/列表',
    path: '/aftersales/customer/index-admin',
    render: props => <LazyRoute {...props}
                                  component={import('./containers/customer/ListAdmin')} />,
  }*/, {
    breadcrumbName: '售后/耗材领用/列表',
    path: '/aftersales/consumptive-material/index/:consumptiveShow',
    render: props => <LazyRoute {...props}
                                component={import('./containers/aftersales/consumptive-material/List')} />,
  }, {
    breadcrumbName: '售后/仓库预警/列表',
    path: '/aftersales/inventory-warn/index',
    render: props => <LazyRoute {...props}
                                component={import('./containers/aftersales/inventory-warn/List')} />,
  }, {
    breadcrumbName: '售后/评价管理/列表',
    path: '/aftersales/customer/score',
    render: props => <LazyRoute {...props}
                                  component={import('./containers/aftersales/score/List')} />,
  }, {
    breadcrumbName: '周报',
    path: '/weekly/new',
    render: props => <LazyRoute {...props}
                                component={import('./containers/aftersales/weekly/New')} />,
  }, {
    breadcrumbName: '仓库/配件/列表',
    path: '/warehouse/part/index',
    render: props => <LazyRoute {...props}
                                component={import('./containers/warehouse/part/List')} />,
  }, {
    exact: true,
    breadcrumbName: '仓库/配件/列表',
    path: '/warehouse/part/detail',
    render: props => <LazyRoute {...props}
                                component={import('./containers/warehouse/part/Detail')} />,
  }, {
    exact: true,
    breadcrumbName: '仓库/配件/列表',
    path: '/warehouse/part/detail/:id',
    render: props => <LazyRoute {...props}
                                component={import('./containers/warehouse/part/Detail')} />,
  }, {
    breadcrumbName: '仓库/配件/商城',
    path: '/warehouse/part/store',
    render: props => <LazyRoute {...props}
                                component={import('./containers/warehouse/part/Store')} />,
  }, {
    breadcrumbName: '仓库/配件分类管理',
    path: '/warehouse/category/index',
    render: props => <LazyRoute {...props}
                                component={import('./containers/warehouse/category/List')} />,
  }, {
    breadcrumbName: '仓库/分类及加价率',
    path: '/warehouse/markup-rate/index',
    render: props => <LazyRoute {...props}
                                component={import('./containers/warehouse/markup-rate/List')} />,
  }, {
    breadcrumbName: '仓库/采购单管理/列表',
    path: '/warehouse/purchase/index',
    render: props => <LazyRoute {...props}
                                component={import('./containers/warehouse/purchase/List')} />,
  }, {
    exact: true,
    breadcrumbName: '仓库/采购单管理/采购开单',
    path: '/warehouse/purchase/new',
    render: props => <LazyRoute {...props}
                                component={import('./containers/warehouse/purchase/New')} />,
  }, {
    breadcrumbName: '仓库/采购单管理/采购开单',
    path: '/warehouse/purchase/new/:partId',
    render: props => <LazyRoute {...props}
                                component={import('./containers/warehouse/purchase/New')} />,
  }, {
    exact: true,
    breadcrumbName: '仓库/采购单管理/采购单编辑',
    path: '/warehouse/purchase/edit',
    render: props => <LazyRoute {...props}
                                component={import('./containers/warehouse/purchase/New')} />,
  }, {
    exact: true,
    breadcrumbName: '仓库/采购单管理/采购单编辑',
    path: '/warehouse/purchase/edit/:id',
    render: props => <LazyRoute {...props}
                                component={import('./containers/warehouse/purchase/New')} />,
  }, {
    exact: true,
    breadcrumbName: '仓库/采购单管理/详情',
    path: '/warehouse/purchase/detail',
    render: props => <LazyRoute {...props}
                                component={import('./containers/warehouse/purchase/Detail')} />,
  }, {
    breadcrumbName: '仓库/采购单管理/详情',
    path: '/warehouse/purchase/detail/:id',
    render: props => <LazyRoute {...props}
                                component={import('./containers/warehouse/purchase/Detail')} />,
  }, {
    breadcrumbName: '仓库/退货单管理/列表',
    path: '/warehouse/purchase-reject/index',
    render: props => <LazyRoute {...props}
                                component={import('./containers/warehouse/purchase-reject/List')} />,
  }, {
    breadcrumbName: '仓库/退货单管理/退货开单',
    path: '/warehouse/purchase-reject/new',
    render: props => <LazyRoute {...props}
                                component={import('./containers/warehouse/purchase-reject/New')} />,
  }, {
    exact: true,
    breadcrumbName: '仓库/退货单管理/退货单编辑',
    path: '/warehouse/purchase-reject/edit',
    render: props => <LazyRoute {...props}
                                component={import('./containers/warehouse/purchase-reject/New')} />,
  }, {
    exact: true,
    breadcrumbName: '仓库/退货单管理/退货单编辑',
    path: '/warehouse/purchase-reject/edit/:id',
    render: props => <LazyRoute {...props}
                                component={import('./containers/warehouse/purchase-reject/New')} />,
  }, {
    exact: true,
    breadcrumbName: '仓库/退货单管理/详情',
    path: '/warehouse/purchase-reject/detail',
    render: props => <LazyRoute {...props}
                                component={import('./containers/warehouse/purchase-reject/Detail')} />,
  }, {
    breadcrumbName: '仓库/退货单管理/详情',
    path: '/warehouse/purchase-reject/detail/:id',
    render: props => <LazyRoute {...props}
                                component={import('./containers/warehouse/purchase-reject/Detail')} />,
  }, {
    breadcrumbName: '仓库/盘点管理/列表',
    path: '/warehouse/stocktaking/index',
    render: props => <LazyRoute {...props}
                                component={import('./containers/warehouse/stocktaking/List')} />,
  }, {
    breadcrumbName: '仓库/盘点管理/盘点开单',
    path: '/warehouse/stocktaking/new',
    render: props => <LazyRoute {...props}
                                component={import('./containers/warehouse/stocktaking/New')} />,
  }, {
    exact: true,
    breadcrumbName: '仓库/盘点管理/盘点单',
    path: '/warehouse/stocktaking/edit',
    render: props => <LazyRoute {...props}
                                component={import('./containers/warehouse/stocktaking/Edit')} />,
  }, {
    exact: true,
    breadcrumbName: '仓库/盘点管理/盘点单',
    path: '/warehouse/stocktaking/edit/:id',
    render: props => <LazyRoute {...props}
                                component={import('./containers/warehouse/stocktaking/Edit')} />,
  }, {
    breadcrumbName: '仓库/盘点管理/审核单',
    exact: true,
    path: '/warehouse/stocktaking/auth',
    render: props => <LazyRoute {...props}
                                component={import('./containers/warehouse/stocktaking/Auth')} />,
  }, {
    breadcrumbName: '仓库/盘点管理/审核单',
    path: '/warehouse/stocktaking/auth/:id',
    render: props => <LazyRoute {...props}
                                component={import('./containers/warehouse/stocktaking/Auth')} />,
  }, {
    breadcrumbName: '仓库/出入库管理/列表',
    path: '/warehouse/logs/index',
    render: props => <LazyRoute {...props}
                                component={import('./containers/warehouse/log/List')} />,
  }, {
    breadcrumbName: '仓库/进货历史/列表',
    path: '/warehouse/part-entry-log/index',
    render: props => <LazyRoute {...props}
                                component={import('./containers/warehouse/purchase/List')} />,
  }, {
    breadcrumbName: '仓库/供应商/列表',
    path: '/warehouse/supplier/index',
    render: props => <LazyRoute {...props}
                                component={import('./containers/warehouse/supplier/List')} />,
  }, {
    breadcrumbName: '维修项目/列表',
    path: '/maintain-item/index',
    render: props => <LazyRoute {...props}
                                component={import('./containers/maintain-item/List')} />,
  }, {
    exact: true,
    breadcrumbName: '报表/销售业务',
    path: '/dashboard/presales',
    render: props => <LazyRoute {...props}
                                component={import('./containers/dashboard/PresalesStatistics')} />,
  }, {
    exact: true,
    breadcrumbName: '报表/售后业务',
    path: '/dashboard/aftersales',
    render: props => <LazyRoute {...props}
                                component={import('./containers/dashboard/AftersalesStatistics')} />,
  }, {
    exact: true,
    breadcrumbName: '报表/售后业务/营业额明细',
    path: '/dashboard/aftersales/turnover/:startTime/:endTime',
    render: props => <LazyRoute {...props}
                                component={import('./containers/dashboard/TurnoverDetails')} />,
  }, {
    exact: true,
    breadcrumbName: '财务管理/收支管理/列表',
    path: '/finance/expense/list',
    render: props => <LazyRoute {...props}
                                component={import('./containers/finance/expense/List')} />,
  }, {
    breadcrumbName: '财务管理/收支管理/列表',
    path: '/finance/expense/list/:incomeShow/:expenseShow',
    render: props => <LazyRoute {...props}
                                component={import('./containers/finance/expense/List')} />,
  }, {
    breadcrumbName: '财务管理/新车收入/列表',
    path: '/finance/presales-income/list',
    render: props => <LazyRoute {...props}
                                component={import('./containers/finance/presales/IncomeList')} />,
  }, {
    breadcrumbName: '财务管理/售后收入/列表',
    path: '/finance/aftersales-income/list',
    render: props => <LazyRoute {...props}
                                component={import('./containers/finance/aftersales/IncomeList')} />,
  }, {
    breadcrumbName: '财务管理/售后收入结算/列表',
    path: '/finance/aftersales-income-transfer/list',
    render: props => <LazyRoute {...props}
                                component={import('./containers/finance/aftersales/IncomeTransferList')} />,
  }, {
    breadcrumbName: '财务管理/固定资产/列表',
    path: '/finance/fixed-assets/index',
    render: props => <LazyRoute {...props}
                                component={import('./containers/finance/fixed-assets/List')} />,
  }, {
    breadcrumbName: '财务管理/月报汇总',
    path: '/finance/monthly_report',
    render: props => <LazyRoute {...props}
                                component={import('./containers/finance/MonthlyReport')} />,
  }, {
    breadcrumbName: '人事管理/员工管理/列表',
    path: '/personnel/user/list',
    render: props => <LazyRoute {...props}
                                component={import('./containers/personnel/user/List')} />,
  }, {
    exact: true,
    breadcrumbName: '人事管理/员工管理/详情',
    path: '/personnel/user/detail',
    render: props => <LazyRoute {...props}
                                component={import('./containers/personnel/user/Detail')} />,
  }, {
    breadcrumbName: '人事管理/员工管理/详情',
    path: '/personnel/user/detail/:userId',
    render: props => <LazyRoute {...props}
                                component={import('./containers/personnel/user/Detail')} />,
  }, {
    breadcrumbName: '人事管理/薪资管理/列表',
    path: '/personnel/salary/list',
    render: props => <LazyRoute {...props}
                                component={import('./containers/personnel/salary/List')} />,
  }, {
    breadcrumbName: '人事管理/提成管理/列表',
    path: '/personnel/commission/list',
    render: props => <LazyRoute {...props}
                                component={import('./containers/personnel/commission/List')} />,
  }, {
    breadcrumbName: '营销/计次优惠/列表',
    path: '/marketing/times/list',
    render: props => <LazyRoute {...props}
                                component={import('./containers/marketing/coupon/times/List')} />,
  }, {
    breadcrumbName: '营销/计次优惠/新增',
    path: '/marketing/times/new',
    render: props => <LazyRoute {...props}
                                component={import('./containers/marketing/coupon/times/New')} />,
  }, {
    exact: true,
    breadcrumbName: '营销/计次优惠/详情',
    path: '/marketing/times/detail/:id',
    render: props => <LazyRoute {...props}
                                component={import('./containers/marketing/coupon/times/Detail')} />,
  }, {
    breadcrumbName: '营销/折扣优惠/列表',
    path: '/marketing/discount/list',
    render: props => <LazyRoute {...props}
                                component={import('./containers/marketing/coupon/discount/List')} />,
  }, {
    exact: true,
    breadcrumbName: '营销/折扣优惠/详情',
    path: '/marketing/discount/detail/:id',
    render: props => <LazyRoute {...props}
                                component={import('./containers/marketing/coupon/discount/Detail')} />,
  }, {
    breadcrumbName: '营销/折扣优惠/新增',
    path: '/marketing/discount/new',
    render: props => <LazyRoute {...props}
                                component={import('./containers/marketing/coupon/discount/New')} />,
  }, {
    exact: true,
    breadcrumbName: '营销/优惠券/优惠券核销',
    path: '/marketing/coupon/verification/index',
    render: props => <LazyRoute {...props}
                                component={import('./containers/marketing/coupon/verification/Index')} />,
  }, {
    breadcrumbName: '营销/套餐卡管理/列表',
    path: '/marketing/membercard/list',
    render: props => <LazyRoute {...props}
                                component={import('./containers/marketing/member-card/List')} />,
  }, {
    exact: true,
    breadcrumbName: '营销/套餐卡管理/新增',
    path: '/marketing/membercard/new',
    render: props => <LazyRoute {...props}
                                component={import('./containers/marketing/member-card/New')} />,
  }, {
    exact: true,
    breadcrumbName: '营销/套餐卡管理/新增',
    path: '/marketing/membercard/new/:id',
    render: props => <LazyRoute {...props}
                                component={import('./containers/marketing/member-card/New')} />,
  }, {
    exact: true,
    breadcrumbName: '营销/套餐卡管理/详情',
    path: '/marketing/membercard/detail',
    render: props => <LazyRoute {...props}
                                component={import('./containers/marketing/member-card/Detail')} />,
  }, {
    exact: true,
    breadcrumbName: '营销/套餐卡管理/详情',
    path: '/marketing/membercard/detail/:memberCardType',
    render: props => <LazyRoute {...props}
                                component={import('./containers/marketing/member-card/Detail')} />,
  }, {
    breadcrumbName: '营销/套餐卡管理/购买记录',
    path: '/marketing/membercard/salelog',
    render: props => <LazyRoute {...props}
                                component={import('./containers/marketing/member-card/SaleLogs')} />,
  }, {
    breadcrumbName: '营销/套餐卡管理/开卡',
    path: '/marketing/membercard/sale',
    render: props => <LazyRoute {...props}
                                component={import('./containers/marketing/member-card/Sale')} />,
  }, {
    exact: true,
    breadcrumbName: '营销/套餐卡管理/购买详情',
    path: '/marketing/membercard/sale-detail/:id',
    render: props => <LazyRoute {...props}
                                component={import('./containers/marketing/member-card/SaleDetail')} />,
  }, {
    breadcrumbName: '营销/营销活动/列表',
    path: '/marketing/activity/list',
    render: props => <LazyRoute {...props}
                                component={import('./containers/marketing/activity/List')} />,
  }, {
    exact: true,
    breadcrumbName: '营销/营销活动/新建',
    path: '/marketing/activity/new',
    render: props => <LazyRoute {...props}
                                component={import('./containers/marketing/activity/New')} />,
  }, {
    exact: true,
    breadcrumbName: '营销/营销活动/新建',
    path: '/marketing/activity/new/:couponId',
    render: props => <LazyRoute {...props}
                                component={import('./containers/marketing/activity/New')} />,
  }, {
    exact: true,
    breadcrumbName: '营销/营销活动/编辑',
    path: '/marketing/activity/edit/:id',
    render: props => <LazyRoute {...props}
                                component={import('./containers/marketing/activity/New')} />,
  }, {
    exact: true,
    breadcrumbName: '营销/营销活动/活动详情',
    path: '/marketing/activity/detail/:id',
    render: props => <LazyRoute {...props}
                                component={import('./containers/marketing/activity/Detail')} />,
  }, {
    exact: true,
    breadcrumbName: '营销/数据统计/优惠券统计',
    path: '/marketing/statistics/coupon',
    render: props => <LazyRoute {...props}
                                component={import('./containers/marketing/statistics/Coupon')} />,
  }, {
    exact: true,
    breadcrumbName: '营销/数据统计/活动统计',
    path: '/marketing/statistics/activity',
    render: props => <LazyRoute {...props}
                                component={import('./containers/marketing/statistics/Activity')} />,
  }, {
    exact: true,
    breadcrumbName: '营销/领券活动/列表',
    path: '/marketing/coupon-activity/list',
    render: props => <LazyRoute {...props}
                                component={import('./containers/marketing/coupon-activity/Index')} />,
  }, {
    exact: true,
    breadcrumbName: '营销/领券活动/列表',
    path: '/marketing/coupon-activity/list/:id',
    render: props => <LazyRoute {...props}
                                component={import('./containers/marketing/coupon-activity/Index')} />,
  }, {
    exact: true,
    breadcrumbName: '营销/领券活动/新建',
    path: '/marketing/coupon-activity/new',
    render: props => <LazyRoute {...props}
                                component={import('./containers/marketing/coupon-activity/New')} />,
  }, {
    exact: true,
    breadcrumbName: '营销/领券活动/编辑',
    path: '/marketing/coupon-activity/edit/:id',
    render: props => <LazyRoute {...props}
                                component={import('./containers/marketing/coupon-activity/New')} />,
  }, {
    exact: true,
    breadcrumbName: '营销/领券活动/详情',
    path: '/marketing/coupon-activity/detail/:id',
    render: props => <LazyRoute {...props}
                                component={import('./containers/marketing/coupon-activity/New')} />,
  }, {
    exact: true,
    breadcrumbName: '营销/助力砍价/活动列表',
    path: '/marketing/bargain/index',
    render: props => <LazyRoute {...props}
                                component={import('./containers/marketing/bargain/List')} />,
  }, {
    exact: true,
    breadcrumbName: '营销/助力砍价/活动列表',
    path: '/marketing/bargain/index/:id',
    render: props => <LazyRoute {...props}
                                component={import('./containers/marketing/bargain/List')} />,
  }, {
    exact: true,
    breadcrumbName: '营销/助力砍价/创建活动',
    path: '/marketing/bargain/new',
    render: props => <LazyRoute {...props}
                                component={import('./containers/marketing/bargain/New')} />,
  }, {
    exact: true,
    breadcrumbName: '营销/助力砍价/创建活动',
    path: '/marketing/bargain/edit/:id',
    render: props => <LazyRoute {...props}
                                component={import('./containers/marketing/bargain/New')} />,
  }, {
    exact: true,
    breadcrumbName: '营销/短信推送',
    path: '/marketing/sms-manage',
    render: props => <LazyRoute {...props}
                                  component={import('./containers/marketing/sms-manage/List')} />,
  }, {
    exact: true,
    breadcrumbName: '营销/短信推送',
    path: '/marketing/sms-manage/:activeKey',
    render: props => <LazyRoute {...props}
                                  component={import('./containers/marketing/sms-manage/List')} />,
  }, {
    exact: true,
    breadcrumbName: '提醒/续保提醒',
    path: '/remind/renewal',
    render: props => <LazyRoute {...props}
                                component={import('./containers/remind/renewal/List')} />,
  }, {
    exact: true,
    breadcrumbName: '提醒/保养提醒',
    path: '/remind/maintain',
    render: props => <LazyRoute {...props}
                                component={import('./containers/remind/maintain/List')} />,
  }, {
    exact: true,
    breadcrumbName: '提醒/年检提醒',
    path: '/remind/yearly-inspection',
    render: props => <LazyRoute {...props}
                                component={import('./containers/remind/yearly-inspection/List')} />,
  }, {
    breadcrumbName: '提醒/催收提醒',
    path: '/remind/debt',
    render: props => <LazyRoute {...props}
                                component={import('./containers/remind/debt/List')} />,
  }, {
    breadcrumbName: '提醒/套餐卡到期',
    path: '/remind/coupon-card',
    render: props => <LazyRoute {...props}
                                component={import('./containers/remind/coupon-card/List')} />,
  }, {
    breadcrumbName: '提醒/生日提醒',
    path: '/remind/birthday',
    render: props => <LazyRoute {...props}
                                component={import('./containers/remind/birthday/List')} />,
  }, {
    breadcrumbName: '提醒/其他回访',
    path: '/remind/common',
    render: props => <LazyRoute {...props}
                                component={import('./containers/remind/common/List')} />,
  }, {
    breadcrumbName: '产品/技术问答/列表',
    path: '/product/question/index',
    render: props => <LazyRoute {...props}
                                component={import('./containers/product/question/List')} />,
  }, {
    exact: true,
    breadcrumbName: '产品/技术问答/详情',
    path: '/product/question/detail',
    render: props => <LazyRoute {...props}
                                component={import('./containers/product/question/Detail')} />,
  }, {
    exact: true,
    breadcrumbName: '产品/技术问答/详情',
    path: '/product/question/detail/:id',
    render: props => <LazyRoute {...props}
                                component={import('./containers/product/question/Detail')} />,
  }, {
    breadcrumbName: '产品/技师管理/列表',
    path: '/product/artificer/index',
    render: props => <LazyRoute {...props}
                                component={import('./containers/product/artificer/List')} />,
  }, {
    exact: true,
    breadcrumbName: '产品/技师管理/详情',
    path: '/product/artificer/detail',
    render: props => <LazyRoute {...props}
                                component={import('./containers/product/artificer/Detail')} />,
  }, {
    exact: true,
    breadcrumbName: '产品/技师管理/详情',
    path: '/product/artificer/detail/:customerId',
    render: props => <LazyRoute {...props}
                                component={import('./containers/product/artificer/Detail')} />,
  }, {
    breadcrumbName: '公司管理',
    path: '/company',
    render: props => <LazyRoute {...props} component={import('./containers/company/List')} />,
  }, {
    breadcrumbName: '头条管理',
    path: '/headlines',
    render: props => <LazyRoute {...props}
                                component={import('./containers/product/headlines/List')} />,
  }, {
    breadcrumbName: '广告管理',
    path: '/advert',
    render: props => <LazyRoute {...props}
                                component={import('./containers/product/advert/List')} />,
  }, {
    breadcrumbName: '活动管理',
    path: '/activity',
    render: props => <LazyRoute {...props}
                                component={import('./containers/product/activity/List')} />,
  }, {
    breadcrumbName: '评价管理',
    path: '/comment',
    render: props => <LazyRoute {...props}
                                component={import('./containers/product/comment/List')} />,
  }, {
    breadcrumbName: '设置/功能设置',
    path: '/settings/index',
    render: props => <LazyRoute {...props} component={import('./containers/settings/Index')} />,
  }, {
    breadcrumbName: '设置/账号管理/列表',
    path: '/settings/account/index',
    render: props => <LazyRoute {...props}
                                component={import('./containers/settings/account/List')} />,
  }, {
    breadcrumbName: '设置/权限管理/角色权限',
    path: '/settings/permission/role',
    render: props => <LazyRoute {...props}
                                component={import('./containers/settings/permission/Role')} />,
  }, {
    breadcrumbName: '设置/权限管理/系统权限',
    path: '/settings/permission/system',
    render: props => <LazyRoute {...props}
                                component={import('./containers/settings/permission/System')} />,
  }, {
    breadcrumbName: '设置门店信息',
    path: '/company-setting',
    render: props => <LazyRoute {...props}
                                component={import('./containers/company/Set')} />,
  }, {
    breadcrumbName: '新车/产品管理',
    path: '/new-car/product/index',
    render: props => <LazyRoute {...props}
                                component={import('./containers/new-car/product/Index')} />,
  }, {
    breadcrumbName: '新车/产品管理／创建产品',
    path: '/new-car/product/addProduct/:id',
    render: props => <LazyRoute {...props}
                                component={import('./containers/new-car/product/AddProduct')} />,
  }, {
    breadcrumbName: '新车/产品管理／编辑',
    path: '/new-car/product/editDetail/:id',
    render: props => <LazyRoute {...props}
                                component={import('./containers/new-car/product/EditDetail')} />,
  }, {
    breadcrumbName: '新车/方案管理',
    path: '/new-car/programme/list',
    render: props => <LazyRoute {...props}
                                component={import('./containers/new-car/programme/List')} />,
  }, {
    exact: true,
    breadcrumbName: '新车/车型方案/创建金融方案',
    path: '/new-car/programme-car/new/addFinancialPlan',
    render: props => <LazyRoute {...props}
                                component={import('./containers/new-car/programme/AddFinancialPlan')} />,
  }, {
    exact: true,
    breadcrumbName: '新车/车型方案/创建金融方案',
    path: '/new-car/programme-car/new/addFinancialPlan/:id',
    render: props => <LazyRoute {...props}
                                component={import('./containers/new-car/programme/AddFinancialPlan')} />,
  },{
    exact: true,
    breadcrumbName: '新车/车型方案/创建车型方案',
    path: '/new-car/programme-car/new/addVehiclePlay',
    render: props => <LazyRoute {...props}
                                component={import('./containers/new-car/programme/AddVehiclePlay')} />,
  },{
    exact: true,
    breadcrumbName: '新车/车型方案/创建车型方案',
    path: '/new-car/programme-car/new/addVehiclePlay/:id',
    render: props => <LazyRoute {...props}
                                component={import('./containers/new-car/programme/AddVehiclePlay')} />,
  }, {
    exact: true,
    breadcrumbName: '新车/车型方案/编辑金融方案',
    path: '/new-car/programme-car/new/editFinancialPlan/:id',
    render: props => <LazyRoute {...props}
                                component={import('./containers/new-car/programme/EditFinancialPlan')} />,
  }, {
    exact: true,
    breadcrumbName: '新车/车型方案/编辑车型方案',
    path: '/new-car/programme-car/new/editVehiclePlay/:id',
    render: props => <LazyRoute {...props}
                                component={import('./containers/new-car/programme/EditVehiclePlay')} />,
  }, {
    breadcrumbName: '新车/订单管理',
    path: '/new-car/order/index',
    render: props => <LazyRoute {...props}
                                component={import('./containers/new-car/order/Index')} />,
  }, {
    exact: true,
    breadcrumbName: '新车/订单管理/详情',
    path: '/new-car/order/detail/:id',
    render: props => <LazyRoute {...props}
                                component={import('./containers/new-car/order/Detail')} />,
  }, {
    exact: true,
    breadcrumbName: '新车/Banner管理',
    path: '/new-car/banner/list',
    render: props => <LazyRoute {...props}
                                component={import('./containers/new-car/banner/List')} />,
  }, {
    exact: true,
    breadcrumbName: '新车/问答管理',
    path: '/new-car/qa/list',
    render: props => <LazyRoute {...props}
                                component={import('./containers/new-car/qa/List')} />,
  }, {
    exact: true,
    breadcrumbName: '新车/资源方管理',
    path: '/new-car/resource/list',
    render: props => <LazyRoute {...props}
                                component={import('./containers/new-car/resource/List')} />,
  }, {
    exact: true,
    breadcrumbName: '新车/收益记录',
    path: '/new-car/earnings-record/list',
    render: props => <LazyRoute {...props}
                                component={import('./containers/new-car/earnings-record/List')} />,
  }, {
    exact: true,
    breadcrumbName: '新车/材料配置',
    path: '/new-car/material/list',
    render: props => <LazyRoute {...props}
                                component={import('./containers/new-car/material/List')} />,
  }, {
    breadcrumbName: '测试',
    path: '/test',
    render: props => <LazyRoute {...props} component={import('./containers/Test')} />,
  }, {
    breadcrumbName: '403/',
    path: '/permission-403',
    render: props => <LazyRoute {...props} component={import('./containers/403')} />,
  }, {
    breadcrumbName: '404/',
    path: '*',
    render: props => <LazyRoute {...props} component={import('./containers/404')} />,
  }];

export default routers;

