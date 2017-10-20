#!/usr/bin/env bash

cd `dirname $0`

dev1="api.daotian.dev1.yunbed.com"
dev2="api.daotian.dev2.yunbed.com"
yunbed="api.daotian.yunbed.com"
shuidao="api.daotian.shuidao.com"

if [ x$1 == x"dev1" ] || [ x$1 == x"yunbed" ] || [ x$1 == x"shuidao" ] || [ x$1 == x"dev2" ]
then
    cd ./dist/
    eval ln -sf ../cfg/url_config/\$$1.js ./baseUrl.js
    eval ln -sf ../cfg/url_config/\$$1.js ../cfg/baseUrl.js
    echo "链接成功"
else
    echo "参数:[ dev1 | dev2 | yunbed | shuidao ]!"
fi
