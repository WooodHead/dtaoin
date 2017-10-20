$(function() {
  //下载链接
  (function downloadApp() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var downloadUrl = '';

    $('button').on('touchstart', function(e) {
      e.stopPropagation();
      $(this).css({
        border: '1px solid #02C874',
        color: '#02C874',
      });
    });

    $.ajax({
      type: 'GET',
      url: window.baseURL + '/v1/' + 'system/get-app-toc-download-url',
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      success: function(data) {
        downloadUrl = JSON.parse(data).res.url;
        var iosUrl = downloadUrl.ios ? downloadUrl.ios.url : '';
        var androidUrl = downloadUrl.android ? downloadUrl.android.url : '';
        if (isAndroid) {
          $('.downloadBtn').attr('href', androidUrl);
        } else {
          $('.downloadBtn').attr('href', iosUrl);
        }
      },
      error: function() {
      },
    });
  })();
});