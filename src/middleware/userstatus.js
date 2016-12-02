import config from 'config';
import BrandInfo from './brand';
const API_HOST = config.baseHost + '/v1/';

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
      withCredentials: true
    },
    dataType: 'json',
    success: function (data) {
      if (data.code == 0) {
        const user = data.res.user;
        let userSession = Object.assign(user, {
          brand_name: BrandInfo.brand_name,
          brand_logo: BrandInfo.brand_logo,
          uid: user._id,
        });
        sessionStorage.setItem('USER_SESSION', JSON.stringify(userSession));
        location.href = location.href;
      } else {
        console.log('获取用户信息: 数据失败，', data.msg);
        location.hash = 'login';
      }
    },
    error: function (data) {
      console.log('获取用户信息: 请求失败', data);
      location.hash = 'login';
    }
  });
}
