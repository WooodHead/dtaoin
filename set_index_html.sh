#!/usr/bin/env bash

cd `dirname $0`

dev="index.dev"
dist="index.dist"

if [ x$1 == x"dev" ] || [ x$1 == x"dist" ]
then
    eval ln -sf ./\$$1.html ./index.html
    echo "链接成功"
else
    echo "参数:[ dev | dist ]!"
fi
