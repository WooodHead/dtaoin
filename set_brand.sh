#!/usr/bin/env bash

cd `dirname $0`

if [ x$1 == x"daotian" ] || [ x$1 == x"habo" ]
then
    ln -sf ./brand_config/$1/favicon.$1.ico ./favicon.ico
    ln -sf ./brand_config/$1/brand.$1.logo.png ./brand.logo.png
    cd ./src/config/
    ln -f ../../brand_config/$1/brand.$1.info.js ./brand.info.js
    echo "链接成功"
else
    echo "参数:[ daotian | habo ]!"
fi
