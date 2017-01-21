import BrandInfo from './brand';

let hrefBack = location.href;

let whiteList = ['app/download'];       //白名单
let inWhiteList = false;                //是否在白名单，在白名单则请求用户状态
for (let key of whiteList) {
  if (hrefBack.indexOf(key) >= 0) {
    inWhiteList = true;
    break;
  }
}

if (!inWhiteList) {
  const API_HOST = window.baseURL + '/v1/';
  const USER_SESSION = sessionStorage.getItem('USER_SESSION');

  if (!USER_SESSION) {
    sessionStorage.setItem('USER_SESSION', '{}');
    //获取用户详情
    //http://api.daotian.kevin.yunbed.com/v1/user/info
    $.ajax({
      url: API_HOST + 'user/info',
      type: 'GET',
      header: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
      },
      xhrFields: {
        withCredentials: true,
      },
      dataType: 'json',
      success: function (data) {
        if (data.code == 0) {
          const user = data.res.user;
          // 'brand_name': "{%$brand_name%}",
          // 'brand_logo': "{%$brand_logo%}",
          // 'uid': "{%$uid%}",
          // 'company_id': "{%$company_id%}",
          // 'name': "{%$name%}",
          // 'company_name': "{%$company_name%}",
          // 'has_purchase': "{%$has_purchase%}",
          // 'department': "{%$department%}",
          // 'role': "{%$role%}"

          let userSession = {
            brand_name: BrandInfo.brand_name,
            brand_logo: BrandInfo.brand_logo,
            uid: user._id,
            name: user.name,
            company_id: user.company_id,
            company_name: user.company_name,
            company_num: user.company_num,
            has_purchase: user.has_purchase,
            department: Number(user.department),
            department_name: user.department_name,
            role: Number(user.role),
          };
          sessionStorage.setItem('USER_SESSION', JSON.stringify(userSession));
          // location.href = hrefBack;
          setTimeout(() => {
            location.href = hrefBack;
          }, 0);
        } else {
          // console.log('获取用户信息: 数据失败，', data.msg);
          location.href = '/login';
        }
      },
      error: function () {
        // console.log('获取用户信息: 请求失败', data);
        location.href = '/login';
      },
    });
  }
}
