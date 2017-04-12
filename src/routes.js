import React from 'react';
import {Route, IndexRoute} from 'react-router';

import api from './middleware/api';
import App from './containers/App';
import Home from './containers/Home';
import Login from './containers/Login';

import OverView from './containers/overview/Index';

import PresalesPotentialList from './containers/presales/potential/List';

import PresalesDealList from './containers/presales/deal/List';
import PresalesDetail from './containers/presales/deal/New';
import PresalesClearing from './containers/presales/deal/Clearing';

import AftersalesProjectList from './containers/aftersales/project/List';
import AftersalesProjectNew from './containers/aftersales/project/New';
import AftersalesCustomerList from './containers/customer/List';
import CustomerDetail from './containers/customer/Detail';
import PartsSale from './containers/aftersales/part-sale/New';
import PartsSaleManageList from './containers/aftersales/part-sale/List';
import ConsumptiveMaterialList from './containers/aftersales/consumptive-material/List';

import WarehouseCategoryList from './containers/warehouse/category/List';

import WarehousePartList from './containers/warehouse/part/List';
import WarehousePartStore from './containers/warehouse/part/Store';
import WarehousePartDetail from './containers/warehouse/part/Detail';

import WarehousePurchase from './containers/warehouse/purchase/List';
import WarehousePurchaseNew from './containers/warehouse/purchase/New';
import WarehousePurchaseDetail from './containers/warehouse/purchase/Detail';

import WarehouseReject from './containers/warehouse/purchase-reject/List';
import WarehouseRejectNew from './containers/warehouse/purchase-reject/New';
import WarehouseRejectDetail from './containers/warehouse/purchase-reject/Detail';

import WarehouseLogsIndex from './containers/warehouse/log/List';

import WarehouseStocktakingIndex from './containers/warehouse/stocktaking/List';
import WarehouseStocktakingNew from './containers/warehouse/stocktaking/New';
import WarehouseStocktakingEdit from './containers/warehouse/stocktaking/Edit';
import WarehouseStocktakingAuth from './containers/warehouse/stocktaking/Auth';

import WarehouseSupplierList from './containers/warehouse/supplier/List';

import WarehousePartEntryLogList from './containers/warehouse/purchase/List';

import MaintainItemList from './containers/maintain-item/List';

import PresalesStatistics from './containers/dashboard/PresalesStatistics';
import AftersalesStatistics from './containers/dashboard/AftersalesStatistics';

import FinanceExpenseList from './containers/finance/expense/List';
import FinancePresalesIncomeList from './containers/finance/presales/IncomeList';
import FinanceAfterSalesIncomeList from './containers/finance/aftersales/IncomeList';
import FinanceAfterSalesIncomeTransferList from './containers/finance/aftersales/IncomeTransferList';
import FinanceFixedAssetsIndex from './containers/finance/fixed-assets/List';
import MonthlyReport from './containers/finance/MonthlyReport';

import PersonnelUserList from './containers/personnel/user/List';
import PersonnelUserDetail from './containers/personnel/user/Detail';
import PersonnelSalaryList from './containers/personnel/salary/List';

import CompanyList from './containers/company/List';
import AdvertList from './containers/product/advert/List';
import ActivityList from './containers/product/activity/List';
import CommentList from './containers/product/comment/List';

import TimesList from './containers/marketing/coupon/times/List';
import TimesNew from './containers/marketing/coupon/times/New';
import DiscountList from './containers/marketing/coupon/discount/List';
import DiscountNew from './containers/marketing/coupon/discount/New';
import MemberCardTypeList from './containers/marketing/member-card/List';
import MemberCardTypeNew from './containers/marketing/member-card/New';
import MemberCardTypeInfo from './containers/marketing/member-card/Detail';
import MemberCardSaleLog from './containers/marketing/member-card/SaleLogs';
import MemberCardSale from './containers/marketing/member-card/Sale';

import CustomerList from './containers/task/ListCustomer';
import RenewalList from './containers/task/ListRenewal';
import YearlyInspectionList from './containers/task/ListYearlyInspection';
import MaintenanceList from './containers/task/ListMaintenance';

import QuestionList from './containers/product/question/List';
import QuestionDetail from './containers/product/question/Detail';
import TechnicianList from './containers/product/artificer/List';
import TechnicianDetail from './containers/product/artificer/Detail';

import SettingIndex from './containers/settings/Index';
import AccountIndex from './containers/settings/account/List';
import PermissionRole from './containers/settings/permission/Role';
import PermissionSystem from './containers/settings/permission/System';

import Permission403 from './containers/403';
import Permisson404 from './containers/404';


const authOnEnter = (nextState, replace) => {
  if (!api.isSuperAdministrator() && !api.isChainAdministrator() && !api.isHeadquarters() && !api.isStoreGeneralManager()) {
    processAuth(nextState, replace);
  }
};

const authOnChange = (prevState, nextState, replace) => {
  if (!api.isSuperAdministrator() && !api.isChainAdministrator() && !api.isHeadquarters() && !api.isStoreGeneralManager()) {
    processAuth(nextState, replace);
  }
};

const processAuth = (nextState, replace) => {
  let path = assemblePath(nextState.location);

  if (['login', 'permission-403', 'permission-404'].indexOf(path) > -1) {
    return;
  }

  if (!path) {
    return;
  }

  authorization(path, replace);
};

const authorization = (path, replace) => {
  let userPermissions = JSON.parse(api.getUserPermissions());
  let hasPermission = userPermissions.find(permission => permission.item_path === path);
  if (!hasPermission) {
    replace('/permission-403');
  }
};

const assemblePath = (location) => {
  let path = location.pathname;
  if (path.startsWith('/')) {
    path = path.replace('/', '');
  }

  if (path.endsWith('/')) {
    path = path.substring(0, path.length - 1);
  }
  return path;
};

export default (
  <Route>
    <Route breadcrumbName="登录" path="/login" component={Login}/>

    <Route
      breadcrumbName="首页"
      path="/"
      component={App}
      onEnter={authOnEnter}
      onChange={authOnChange}
    >
      <IndexRoute breadcrumbName="工作台" component={api.isHeadquarters() ? OverView : Home}/>

      <Route breadcrumbName="首页" path="index" component={api.isHeadquarters() ? OverView : Home}/>

      <Route breadcrumbName="总览" path="overview">
        <Route breadcrumbName="数据" path="index" component={OverView}/>
      </Route>

      <Route breadcrumbName="客户管理" path="customer">
        <Route breadcrumbName="详情" path="detail" component={CustomerDetail}/>
      </Route>

      <Route breadcrumbName="销售" path="presales">
        <Route breadcrumbName="意向客户" path="potential">
          <Route breadcrumbName="列表" path="index" component={PresalesPotentialList}/>
        </Route>

        <Route breadcrumbName="成交单" path="deal">
          <Route breadcrumbName="列表" path="index" component={PresalesDealList}/>
          <Route breadcrumbName="新增" path="new" component={PresalesDetail}/>
          <Route breadcrumbName="详情" path="detail" component={PresalesDetail}/>
          <Route breadcrumbName="结算单" path="clearing" component={PresalesClearing}/>
        </Route>
      </Route>

      <Route breadcrumbName="售后" path="aftersales">
        <Route breadcrumbName="工单管理" path="project">
          <Route breadcrumbName="列表" path="index" component={AftersalesProjectList}/>
          <Route breadcrumbName="新增" path="new" component={AftersalesProjectNew}/>
          <Route breadcrumbName="编辑" path="edit" component={AftersalesProjectNew}/>
          <Route breadcrumbName="详情" path="detail" component={AftersalesProjectNew}/>
        </Route>

        <Route breadcrumbName="销售管理" path="part-sale">
          <Route breadcrumbName="销售单管理" path="index" component={PartsSaleManageList}/>
          <Route breadcrumbName="创建销售单" path="new" component={PartsSale}/>
          <Route breadcrumbName="编辑销售单" path="edit" component={PartsSale}/>
        </Route>

        <Route breadcrumbName="耗材领用" path="consumptive-material">
          <Route breadcrumbName="列表" path="index" component={ConsumptiveMaterialList}/>
        </Route>

        <Route breadcrumbName="客户管理" path="customer">
          <Route breadcrumbName="列表" path="index" component={AftersalesCustomerList}/>
        </Route>
      </Route>

      <Route breadcrumbName="仓库" path="warehouse">
        <Route breadcrumbName="配件" path="part">
          <Route breadcrumbName="列表" path="index" component={WarehousePartList}/>
          <Route breadcrumbName="详情" path="detail" component={WarehousePartDetail}/>
          <Route breadcrumbName="商城" path="store" component={WarehousePartStore}/>
        </Route>

        <Route breadcrumbName="配件分类" path="category">
          <Route breadcrumbName="列表" path="index" component={WarehouseCategoryList}/>
        </Route>

        <Route breadcrumbName="采购单管理" path="purchase">
          <Route breadcrumbName="列表" path="index" component={WarehousePurchase}/>
          <Route breadcrumbName="采购开单" path="new" component={WarehousePurchaseNew}/>
          <Route breadcrumbName="采购单编辑" path="edit" component={WarehousePurchaseNew}/>
          <Route breadcrumbName="详情" path="detail" component={WarehousePurchaseDetail}/>
        </Route>

        <Route breadcrumbName="退货单管理" path="purchase-reject">
          <Route breadcrumbName="列表" path="index" component={WarehouseReject}/>
          <Route breadcrumbName="退货开单" path="new" component={WarehouseRejectNew}/>
          <Route breadcrumbName="退货单编辑" path="edit" component={WarehouseRejectNew}/>
          <Route breadcrumbName="详情" path="detail" component={WarehouseRejectDetail}/>
        </Route>

        <Route breadcrumbName="盘点管理" path="stocktaking">
          <Route breadcrumbName="列表" path="index" component={WarehouseStocktakingIndex}/>
          <Route breadcrumbName="盘点开单" path="new" component={WarehouseStocktakingNew}/>
          <Route breadcrumbName="盘点单" path="edit" component={WarehouseStocktakingEdit}/>
          <Route breadcrumbName="审核单" path="auth" component={WarehouseStocktakingAuth}/>
        </Route>

        <Route breadcrumbName="出入库管理" path="logs">
          <Route breadcrumbName="列表" path="index" component={WarehouseLogsIndex}/>
        </Route>

        <Route breadcrumbName="进货历史" path="part-entry-log">
          <Route breadcrumbName="列表" path="index" component={WarehousePartEntryLogList}/>
        </Route>

        <Route breadcrumbName="供应商" path="supplier">
          <Route breadcrumbName="列表" path="index" component={WarehouseSupplierList}/>
        </Route>
      </Route>

      <Route breadcrumbName="维修项目" path="maintain-item">
        <Route breadcrumbName="列表" path="index" component={MaintainItemList}/>
      </Route>

      <Route breadcrumbName="报表" path="dashboard">
        <Route breadcrumbName="售前统计" path="presales" component={PresalesStatistics}/>
        <Route breadcrumbName="售后统计" path="aftersales" component={AftersalesStatistics}/>
      </Route>

      <Route breadcrumbName="财务管理" path="finance">
        <Route breadcrumbName="收支管理" path="expense">
          <Route breadcrumbName="列表" path="list" component={FinanceExpenseList}/>
        </Route>
        <Route breadcrumbName="新车收入" path="presales-income">
          <Route breadcrumbName="列表" path="list" component={FinancePresalesIncomeList}/>
        </Route>
        <Route breadcrumbName="售后收入" path="aftersales-income">
          <Route breadcrumbName="列表" path="list" component={FinanceAfterSalesIncomeList}/>
        </Route>
        <Route breadcrumbName="售后收入结算" path="aftersales-income-transfer">
          <Route breadcrumbName="列表" path="list" component={FinanceAfterSalesIncomeTransferList}/>
        </Route>

        <Route breadcrumbName="固定资产" path="fixed-assets">
          <Route breadcrumbName="列表" path="index" component={FinanceFixedAssetsIndex}/>
        </Route>

        <Route breadcrumbName="月报汇总" path="monthly_report" component={MonthlyReport}/>
      </Route>

      <Route breadcrumbName="人事管理" path="personnel">
        <Route breadcrumbName="员工管理" path="user">
          <Route breadcrumbName="列表" path="list" component={PersonnelUserList}/>
          <Route breadcrumbName="详情" path="detail" component={PersonnelUserDetail}/>
        </Route>
        <Route breadcrumbName="薪资管理" path="salary">
          <Route breadcrumbName="列表" path="list" component={PersonnelSalaryList}/>
        </Route>
      </Route>

      <Route breadcrumbName="营销" path="marketing">
        <Route breadcrumbName="计次优惠" path="times">
          <Route breadcrumbName="列表" path="list" component={TimesList}/>
          <Route breadcrumbName="新增" path="new" component={TimesNew}/>
        </Route>

        <Route breadcrumbName="折扣优惠" path="discount">
          <Route breadcrumbName="列表" path="list" component={DiscountList}/>
          <Route breadcrumbName="新增" path="new" components={DiscountNew}/>
        </Route>

        <Route breadcrumbName="会员卡管理" path="membercard">
          <Route breadcrumbName="列表" path="list" component={MemberCardTypeList}/>
          <Route breadcrumbName="新增" path="new" component={MemberCardTypeNew}/>
          <Route breadcrumbName="详情" path="detail" component={MemberCardTypeInfo}/>
          <Route breadcrumbName="购买记录" path="salelog" component={MemberCardSaleLog}/>
          <Route breadcrumbName="开卡" path="sale" component={MemberCardSale}/>
        </Route>
      </Route>

      <Route breadcrumbName="任务" path="task">
        <Route breadcrumbName="客户任务" path="list-customer" component={CustomerList}/>
        <Route breadcrumbName="续保任务" path="list-renewal" component={RenewalList}/>
        <Route breadcrumbName="年检任务" path="list-yearlyinspection" component={YearlyInspectionList}/>
        <Route breadcrumbName="保养任务" path="list-maintenance" component={MaintenanceList}/>
      </Route>

      <Route breadcrumbName="产品" path="product">
        <Route breadcrumbName="技术问答" path="question">
          <Route breadcrumbName="列表" path="index" component={QuestionList}/>
          <Route breadcrumbName="详情" path="detail" component={QuestionDetail}/>
        </Route>
        <Route breadcrumbName="技师管理" path="artificer">
          <Route breadcrumbName="列表" path="index" component={TechnicianList}/>
          <Route breadcrumbName="详情" path="detail" component={TechnicianDetail}/>
        </Route>
      </Route>

      <Route breadcrumbName="设置" path="settings">
        <Route breadcrumbName="功能设置" path="index" component={SettingIndex}/>

        <Route breadcrumbName="账号管理" path="account">
          <Route breadcrumbName="列表" path="index" component={AccountIndex}/>
        </Route>
        <Route breadcrumbName="权限管理" path="permission">
          <Route breadcrumbName="角色权限" path="role" component={PermissionRole}/>
          <Route breadcrumbName="系统权限" path="system" component={PermissionSystem}/>
        </Route>
      </Route>

      <Route breadcrumbName="公司管理" path="company" component={CompanyList}/>
      <Route breadcrumbName="广告管理" path="advert" component={AdvertList}/>
      <Route breadcrumbName="活动管理" path="activity" component={ActivityList}/>
      <Route breadcrumbName="评价管理" path="comment" component={CommentList}/>

      <Route breadcrumbName="403" path="permission-403" component={Permission403}/>
      <Route breadcrumbName="404" path="*" component={Permisson404}/>

    </Route>
  </Route>
);
