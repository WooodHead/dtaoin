import React from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
require('./config/userstatus');
import api from './middleware/api';

import App from './containers/App';
import Home from './containers/Home';
import Login from './containers/Login';
import Register from './containers/Register';

import PresalesPotentialList from 'containers/presales/potential/List';
// import PresalesPotentialDetail from 'containers/presales/potential/Detail';
import PresalesCustomerList from 'containers/presales/customer/List';
// import PresalesCustomerDetail from 'containers/presales/customer/Detail';

import AftersalesProjectList from 'containers/aftersales/project/List';
import AftersalesProjectDetail from 'containers/aftersales/project/Detail';
import AftersalesProjectCreate from 'containers/aftersales/project/Create';
import AftersalesCustomerList from 'containers/customer/List';
import CustomerDetail from 'containers/customer/Detail';
import ConsumptiveMaterialList from 'containers/aftersales/consumptive-material/ConsumpMaterialList';

import WarehouseCategoryList from 'containers/warehouse/category/List';

import WarehousePartList from 'containers/warehouse/part/List';
import WarehousePartStore from 'containers/warehouse/part/Store';
import WarehousePartDetail from 'containers/warehouse/part/Detail';

import WarehousePurchase from 'containers/warehouse/purchase/List';
import WarehousePurchaseNew from 'containers/warehouse/purchase/New';
import WarehousePurchaseDetail from 'containers/warehouse/purchase/Detail';

import WarehouseReject from 'containers/warehouse/purchase-reject/List';
import WarehouseRejectNew from 'containers/warehouse/purchase-reject/New';
import WarehouseRejectDetail from 'containers/warehouse/purchase-reject/Detail';

import WarehouseLogsIndex from 'containers/warehouse/log/List';

import WarehouseStocktakingIndex from 'containers/warehouse/stocktaking/List';
import WarehouseStocktakingNew from 'containers/warehouse/stocktaking/New';
import WarehouseStocktakingEdit from 'containers/warehouse/stocktaking/Edit';
import WarehouseStocktakingAuth from 'containers/warehouse/stocktaking/Auth';

import WarehouseSupplierList from 'containers/warehouse/supplier/List';

import WarehousePartEntryLogList from 'containers/warehouse/purchase/List';

import MaintainItemList from 'containers/maintain-item/List';

import PresalesStatistics from './containers/dashboard/PresalesStatistics';
import AftersalesStatistics from './containers/dashboard/AftersalesStatistics';

import FinanceExpenseList from 'containers/finance/ExpenseList';
import FinancePresalesIncomeList from 'containers/finance/presales/IncomeList';
import FinanceAfterSalesIncomeList from 'containers/finance/aftersales/IncomeList';
import FinanceAfterSalesIncomeTransferList from 'containers/finance/aftersales/IncomeTransferList';
import FinanceFixedAssetsIndex from './containers/finance/fixed-assets/Index';
import MonthlyReport from 'containers/finance/MonthlyReport';

import PersonnelUserList from 'containers/personnel/user/List';
import PersonnelUserDetail from 'containers/personnel/user/Detail';
import PersonnelSalaryList from 'containers/personnel/salary/List';

import CompanyList from 'containers/company/List';
import AdvertList from 'containers/advert/List';
import ActivityList from 'containers/activity/List';
import CommentList from 'containers/comment/List';

import Timecount from 'containers/marketing/discount/timeCount/TimecountList';
import CreateTimecout from 'containers/marketing/discount/timeCount/CreateTimecout';
import Discount from 'containers/marketing/discount/disCount/DiscountList';
import CreateDiscount from 'containers/marketing/discount/disCount/CreateDiscount';
import MemberCardTypeList from 'containers/marketing/member-card/manage/MembercardTypeList';
import MemberCardTypeCreate from 'containers/marketing/member-card/manage/MembercardTypeCreate';
import MemberCardTypeInfo from 'containers/marketing/member-card/manage/MembercardTypeInfo';
import MemberCardSaleLog from 'containers/marketing/member-card/saleLog/SaleLog';
import MemberCardSale from 'containers/marketing/member-card/sale/Sale';

import CustomerTask from 'containers/task/CustomerTask';
import RenewalTask from 'containers/task/RenewalTask';
import YearlyInspectionTask from 'containers/task/YearlyInspectionTask';

import AppDownloadToB from 'containers/AppDownloadToB';
import AppDownloadToC from 'containers/AppDownloadToC';

render((
  <Router history={browserHistory}>
    <Route breadcrumbName="首页" path="/" component={App}>
      <IndexRoute breadcrumbName="工作台" component={Home}/>
      <Route breadcrumbName="登录" path="login" component={Login}/>
      <Route breadcrumbName="注册" path="register" component={Register}/>

      <Route breadcrumbName="销售" path="presales">
        <Route breadcrumbName="意向管理" path="potential" component={PresalesPotentialList}/>
        <Route breadcrumbName="成交客户" path="customer" component={PresalesCustomerList}/>
      </Route>

      <Route breadcrumbName="售后" path="aftersales">
        <Route breadcrumbName="工单管理" path="project">
          <Route breadcrumbName="列表" path="index" component={AftersalesProjectList}/>
          <Route breadcrumbName="新增" path="create" component={AftersalesProjectCreate}/>
          <Route breadcrumbName="详情" path="detail" component={AftersalesProjectDetail}/>
        </Route>

        <Route breadcrumbName="耗材领用" path="consumptive_material" component={ConsumptiveMaterialList}/>
        <Route breadcrumbName="客户管理" path="customer" component={AftersalesCustomerList}/>
      </Route>

      <Route breadcrumbName="客户" path="customer">
        <Route breadcrumbName="详情" path="detail" component={CustomerDetail}/>
      </Route>

      <Route breadcrumbName="仓库" path="warehouse">
        <Route breadcrumbName="配件" path="part">
          <Route breadcrumbName="列表" path="index" component={WarehousePartList}/>
          <Route breadcrumbName="详情" path="detail" component={WarehousePartDetail}/>
          <Route breadcrumbName="商城" path="store" component={WarehousePartStore}/>
        </Route>

        <Route breadcrumbName="配件分类" path="category" component={WarehouseCategoryList}/>

        <Route breadcrumbName="进货单管理" path="purchase">
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

        <Route breadcrumbName="出入库管理" path="logs" component={WarehouseLogsIndex}/>
        <Route breadcrumbName="进货历史" path="part-entry-log" component={WarehousePartEntryLogList}/>
        <Route breadcrumbName="供应商" path="supplier" component={WarehouseSupplierList}/>
      </Route>

      <Route breadcrumbName="维修项目" path="maintain-item" component={MaintainItemList}/>

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
        {
          api.hasMarketingPermission()
            ?
            <Route breadcrumbName="计次优惠" path="timecount">
              <IndexRoute breadcrumbName="列表" component={Timecount}/>
              <Route breadcrumbName="新增" path="createTimecount" component={CreateTimecout}/>
            </Route>
            :
            null
        }
        {
          api.hasMarketingPermission()
            ?
            <Route breadcrumbName="折扣优惠" path="discount">
              <IndexRoute breadcrumbName="折扣优惠" component={Discount}/>
              <Route breadcrumbName="新增" path="createDiscount" components={CreateDiscount}/>
            </Route>
            :
            null
        }

        {
          api.hasMarketingPermission()
            ?
            <Route breadcrumbName="会员卡品管理" path="membercard-type">
              <Route breadcrumbName="列表" path="list" component={MemberCardTypeList}/>
              <Route breadcrumbName="新增" path="create" component={MemberCardTypeCreate}/>
              <Route breadcrumbName="详情" path="info" component={MemberCardTypeInfo}/>
            </Route>
            :
            null
        }

        <Route breadcrumbName="会员卡管理" path="membercard">
          <Route breadcrumbName="购买记录" path="salelog" component={MemberCardSaleLog}/>
          <Route breadcrumbName="开卡" path="sale" component={MemberCardSale}/>
        </Route>

      </Route>

      <Route breadcrumbName="任务" path="task">
        <Route breadcrumbName="客户任务" path="customertask" component={CustomerTask}/>
        <Route breadcrumbName="续保任务" path="renewaltask" component={RenewalTask}/>
        <Route breadcrumbName="年检任务" path="yearlyinspectiontask" component={YearlyInspectionTask}/>
      </Route>

      <Route breadcrumbName="公司管理" path="company" component={CompanyList}/>
      <Route breadcrumbName="广告管理" path="advert" component={AdvertList}/>
      <Route breadcrumbName="活动管理" path="activity" component={ActivityList}/>
      <Route breadcrumbName="评价管理" path="comment" component={CommentList}/>

      <Route breadcrumbName="手机端下载" path="app">
        <Route breadcrumbName="工作端" path="downloadtob" component={AppDownloadToB}/>
        <Route breadcrumbName="客户端" path="downloadtoc" component={AppDownloadToC}/>
      </Route>

    </Route>
  </Router>
), document.getElementById('app'));
