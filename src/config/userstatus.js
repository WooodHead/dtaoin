import BrandInfo from './brand';
import validator from '../utils/validator';
const hrefBack = location.href;

const whiteList = ['app/download'];       // 白名单
let inWhiteList = false;                // 是否在白名单，在白名单则请求用户状态
for (const key of whiteList) {
  if (hrefBack.indexOf(key) >= 0) {
    inWhiteList = true;
    break;
  }
}

if (!inWhiteList) {
  const API_HOST = `${window.baseURL  }/v1/`;
  // 防止localStorage预存信息不是base64报错
  const USER_SESSION = localStorage.getItem('USER_SESSION');
  const base64Reg = validator.pattern.base64;
  const isbase64 = base64Reg.test(USER_SESSION);
  if (!isbase64) {
    localStorage.clear();
  }

  // 获取用户详情
  $.ajax({
    url: `${API_HOST  }user/info`,
    type: 'GET',
    header: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
    },
    xhrFields: {
      withCredentials: true,
    },
    dataType: 'json',
    success (data) {
      if (data.code == 0) {
        const user = data.res.user;
        const userSession = {
          brand_name: BrandInfo.brand_name,
          brand_logo: BrandInfo.brand_logo,
          uid: user._id,
          name: user.name,
          company_id: user.company_id,
          company_name: user.company_name,
          company_num: user.company_num,
          has_purchase: user.has_purchase,
          department: user.department,
          department_name: user.department_name,
          role: user.role,
          user_type: user.user_type,
          is_pos_device: user.is_pos_device,
          cooperation_type_name: user.cooperation_type_name.full_name,
          cooperation_type_short: user.cooperation_type_name.short,
          operation_name: user.operation_name,
          operation_phone: user.operation_phone,
        };
        localStorage.setItem('USER_SESSION', window.btoa(window.encodeURIComponent(JSON.stringify(userSession))));
      } else {
        localStorage.clear();
      }
    },
    error () {
      localStorage.clear();
    },
  });
}
