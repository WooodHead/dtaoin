# daotian-web-v2

## 说明

* 路由设置，现在使用browserHistory，使用rote/:id的方式匹配路由


## 一、配置项目

---

#### 1、 配置nginx

前端路由方案使用browserHistory, 需要配置服务器，所有的请求都指向index.html, 且静态资源文件均使用绝对路径
 * 开发环境 index.dev.html
 * 生产环境 index.dist.html

```$xslt
// dev 环境
location / {
    try_files $uri /index.dev.html
}

// prod 环境
location / {
    try_files $uri /dist/index.html // 使用处理过的HTML文件
}
```

---

#### 2、URL设定

执行下面某一行命令进行 api URL 的设定。

```
# 开发、测试环境 api 基地址1：https://api.daotian.dev1.yunbed.com
bash> ./set_base_URL.sh dev1

# 开发、测试环境 api 基地址2：https://api.daotian.dev2.yunbed.com
bash> ./set_base_URL.sh dev2

```

---

#### 3、首页设定

执行下面某一行命令进行 首页 的设定。

```
bash> ./set_base_URL.sh dev1   # 开发环境，热打包时dev1环境使用
bash> ./set_base_URL.sh dev2  # 开发环境，热打包时dev1环境使用

```
首次运行需要执行
bash> ./set_brand.sh daotian

---

#### 4、推荐配置命令

1. 开发

```
bash> ./set_base_URL.sh dev1    # 开发、测试环境 api 基地址：https://api.daotian.dev1.yunbed.com
bash> ./set_base_URL.sh dev2    # 开发、测试环境 api 基地址：https://api.daotian.dev2.yunbed.com
```

2. 测试

```
bash> ./set_base_URL.sh dev1    # 开发、测试环境 api 基地址：https://api.daotian.dev1.yunbed.com
bash> ./set_base_URL.sh dev2    # 开发、测试环境 api 基地址：https://api.daotian.dev2.yunbed.com
```

---

## 二、打包

说明：打包做了三件事情：1)清空dist里的内容。2)将print.css、baseUrl.js、jquery.min.js、favicon.ico拷贝到dist中。3)打包

1. 开发

    - dev 分支
    - 开发热打包，（带热更新），```npm run dev```

2. 普通测试

    - test 分支，需要把 dev 分支的代码合并过来
    - 打包，```npm run dist```

3. 回归测试

    - test 分支，需要把 dev 分支的代码合并过来
    - 打包，```npm run dist```

4. 提交上线

    - master 分支，需要把 test 分支的代码合并过来
    - 打包，```npm run dist```
