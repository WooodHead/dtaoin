$(function() {

  var customerId = getQueryString('customer_id');
  var intentionId = getQueryString('intention_id');

  var attitude = '';
  var quality = '';
  var environment = '';

  var intentionInfo = {};

  //获取地址栏参数
  function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }

  var express = {
    1: '很差',
    2: '一般',
    3: '较好',
    4: '很好',
    5: '完美',
  };

  (function getDetail() {
    $.ajax({
      url: window.baseURL + '/v1/' + 'comment/intention-detail-for-comment',
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      data: {
        customer_id: customerId,
        intention_id: intentionId,
      },
      success: function(data) {
        data = JSON.parse(data);
        if (Number(data.code) === 0) {
          intentionInfo = data.res.intention_info;
          setIntentionInfo();
        }
      },
      error: function(data) {
      },
    });
  })();

  function setIntentionInfo() {
    // $('#car p').html(intentionInfo.plate_num + '<span>' + intentionInfo.auto_type_name + '</span>');
    $('#plant-num').html(intentionInfo.plate_num);
    $('#car-name').html(intentionInfo.auto_type_name);
    $('#project').text('工单项目：' + intentionInfo.item_names);
    $('#money').text('消费金额：' + intentionInfo.total_fee);
    $('#time').text('进厂时间：' + intentionInfo.start_time);
  }

  $('#express').on('click', 'img', function(e) {
    var node = e.target;
    var type = node.getAttribute('data-type');
    var index = node.getAttribute('data-index');

    if (type === 'service') {
      attitude = index;
    } else if (type === 'construction') {
      quality = index;
    } else if (type === 'environment') {
      environment = index;
    }

    var imgNode = $('#' + type + ' img');
    var wordNode = $('#' + type + ' .word');

    if (Number(index) === 1) {
      for (var i = 0; i < imgNode.length; i++) {
        $(imgNode[i]).attr('src', './image/face_default@2x.png');
      }

      $(imgNode[0]).attr('src', './image/face_bad@2x.png');
      $(wordNode[0]).text(express[index]);
    } else if (Number(index) > 1) {
      for (var i = 0; i < imgNode.length; i++) {
        $(imgNode[i]).attr('src', './image/face_default@2x.png');
      }

      for (var i = 0; i < index; i++) {
        $(imgNode[i]).attr('src', './image/face_good@2x.png');
      }
      $(wordNode[0]).text(express[index]);
    }
  });

  $('#submit').on('click', function() {
    if (Number(intentionInfo.is_comment) === 1) {
      $('#message').text('该工单已评价').slideDown();
      setTimeout(function() {
        $('#message').slideUp();
      }, 2000);
      return false;
    }

    var remark = $('#textarea').val();

    if (!attitude) {
      $('#message').text('请对服务态度进行评价').slideDown();
      setTimeout(function() {
        $('#message').slideUp();
      }, 2000);
      return false;
    } else if (!quality) {
      $('#message').text('请对施工质量进行评价').slideDown();
      setTimeout(function() {
        $('#message').slideUp();
      }, 2000);
      return false;
    } else if (!environment) {
      $('#message').text('请对店面环境进行评价').slideDown();
      setTimeout(function() {
        $('#message').slideUp();
      }, 2000);
      return false;
    }

    $.ajax({
      url: window.baseURL + '/v1/' + 'comment/comment-intention',
      type: 'POST',
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      data: {
        customer_id: customerId,
        intention_id: intentionId,
        attitude: attitude,
        quality: quality,
        environment: environment,
        remark: remark,
      },
      success: function(data) {
        data = JSON.parse(data);
        if (Number(data.code) === 0) {
          $('#message').text('评价提交成功').slideDown();
          setTimeout(function() {
            location.href = 'thank.html';
          }, 1500);
        } else {
          $('#message').text(data.msg).slideDown();
          setTimeout(function() {
            $('#message').slideUp();
          }, 2000);
        }
      },
      error: function(data) {
      },
    });
  });
});