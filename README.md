# daotian-web-v2

## 说明

* 路由设置，现在使用browserHistory，使用rote/:id的方式刷新页面会匹配不到路由，暂时使用 query: {id}的方式传递参数


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
# 开发、测试环境 api 基地址：https://api.daotian.dev1.yunbed.com
bash> ./set_base_URL.sh dev1

# 回归测试环境 api 基地址： https://api.daotian.yunbed.com
bash> ./set_base_URL.sh yunbed

# 上线环境 api 基地址： https://api.daotian.shuidao.com
bash> ./set_base_URL.sh shuidao
```

---

#### 3、首页设定

执行下面某一行命令进行 首页 的设定。

```
bash> ./set_index_html.sh dev   # 开发环境，热打包时使用
bash> ./set_index_html.sh dist  # 开发、测试、上线环境，非热打包下使用。
```

---

#### 4、推荐配置命令

1. 开发

```
bash> ./set_base_URL.sh dev1    # 开发、测试环境 api 基地址：https://api.daotian.dev1.yunbed.com
bash> ./set_index_html.sh dev   # 开发环境，热打包时使用
```

2. 测试

```
bash> ./set_base_URL.sh dev1    # 开发、测试环境 api 基地址：https://api.daotian.dev1.yunbed.com
bash> ./set_index_html.sh dist  # 开发、测试、上线环境，非热打包下使用。
```

3. 回归测试

```
bash> ./set_base_URL.sh yunbed  # 回归测试环境 api 基地址： https://api.daotian.yunbed.com
bash> ./set_index_html.sh dist  # 开发、测试、上线环境，非热打包下使用。
```

4. 部署

```
bash> ./set_base_URL.sh shuidao # 上线环境 api 基地址： https://api.daotian.shuidao.com
bash> ./set_index_html.sh dist  # 开发、测试、上线环境，非热打包下使用。
```

---

## 二、打包

1. 开发

    - dev 分支
    - 开发热打包，（带热更新），```npm run start```
    - 不需要提交app.js文件

2. 普通测试

    - test 分支，需要把 dev 分支的代码合并过来
    - 打包，```npm run dist```
    - 需要提交app.js到该分支
    
3. 回归测试

    - test 分支，需要把 dev 分支的代码合并过来
    - 打包，```npm run dist```
    - 需要提交app.js到该分支
    
4. 提交上线

    - master 分支，需要把 test 分支的代码合并过来
    - 打包，```npm run dist```
    - 需要提交app.js到该分支
