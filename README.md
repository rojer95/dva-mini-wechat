# dva-mini-wechat
dva.js for mini wechat |  小程序版的Dva.js

---
## 关于Dva.js的使用方法

* [Dva.JS的中文文档](https://github.com/dvajs/dva/blob/master/README_zh-CN.md)
* 理解 dva 的 [8 个概念](https://github.com/dvajs/dva/blob/master/docs/Concepts_zh-CN.md) ，以及他们是如何串起来的
* 掌握 dva 的[所有 API](https://github.com/dvajs/dva/blob/master/docs/API_zh-CN.md)
* 以上文档请忽略Route部分，因为小程序路由和React的路由还是不一样的

## 一些特殊之处 OR 使用方法

以下能帮你更好地理解和使用 小程序版本的 dva ：

#### 1.creatApp如何使用？

必须在`app.js`入口文件，使用`creatApp`来创建`store`，同时请在配置中传入`models`的数组来初始化model。[用法详细可见](./demo/app.js#L8)
#### 2.connect如何使用？

在需要用到`store`数据的组件/页面使用`connect`来连接`store`中的`state`，`connect`只接受传入`mapStateToProps`一个参数。[用法详细可见](./demo/pages/index/index.js#L8)
#### 3.页面初始化如何调用dispatch获取数据？

页面的`onLoad`,`onShow`,`onReady`生命周期函数中可以直接调用`this.dispatch`，但更建议您在`model`内的`subscriptions`中用`history.listen`来监听来实现，这也符合Dva的设计规范。[用法详细可见](./demo/pages/index/index.js#L21)
#### 4.监听路由如何使用？

我对`history.listen`的传入参数进行了调整，目前传入的参数是`{ pathname, query, isBack }`，分别代表`当前路由路径(以/开头)`、`路由携带参数 Object类型`、`是否是从上一个页面返回 Boolean类型`，其他的如果有特殊需要请自行参考源码进行调整或者反馈给我，谢谢。[用法详细可见](./demo/models/douyu.js#L21)
#### 5.为何models与services报regeneratorRuntime undefined错误？

由于微信小程序不支持`regeneratorRuntime`，所以在`models`与`services`内请记得引用`regeneratorRuntime`。[用法详细可见](./demo/models/douyu.js#L2)
#### 6.如何页面跳转？

关于路由的跳转：可以使用`this.dispatch(routerRedux({...}))`，也可以使用`wx.navigateTo`，这里`routerRedux`等价于`wx.navigateTo`，但不等价于`wx.redirectTo`等其他路由跳转的接口；如需要获取当前页面的路由信息，可以获取我已经预定义好的model，名称为`@@route`。[用法详细可见](./demo/pages/index/index.js#L97)
#### 7.dispatch如何调用？

`dispatch`在使用`connect`函数初始化过的页面，均会传入的`dispatch`，使用`this.dispatch`来调用，传入参数与Dva一致。[用法详细可见](./demo/pages/index/index.js#L21)
#### 8.如何优雅的调用微信的接口？

参考了[labrador](https://github.com/maichong/labrador) 库对全局的 wx 变量进行了封装为`_wx`，将所有 wx 对象中的异步方法进行了Promise支持， 除了同步的方法，这些方法往往以 on*、create*、stop*、pause*、close* 开头或以 *Sync 结尾，这样在`model`的`effects`中。你可以直接使用`yield call(_wx.login)`的方法来“同步”的获取数据。[用法详细可见](./demo/models/douyu.js#L65)
#### 9.事件获取传入参数有没有更简便的方法？

使用`getNodeAttr` 可以用于获取事件中WXML节点的`data-`参数。[用法详细可见](./demo/pages/douyu/index.js#L77)


*目前所能想到的就这些，以上所提到的均有在Demo中有体现，可自行查阅，其他的待补充，欢迎提议*



## Demos OR 案例

* ~~[简单计数器&斗鱼接口](https://github.com/rojer95/dva-mini-wechat-demo)~~，该Demo已经迁移到本项目的`Demo`目录下
* 公厕助手：用于查找附近公厕，并可导航【限龙岩地区】。
* 随手秒：一键发起秒杀，可在线支付发货收款提现。
* 吉祥利是：用户设置红包大小，分享给亲朋好友，亲朋好友说一句吉祥话，即可领取红包【政策原因已经下线】。
* 豪想聚：聚会场地优选，打造多样化聚会场地。

## 快速上手

这里以Demo为例

1. 克隆本项目 `git clone https://github.com/rojer95/dva-mini-wechat.git`
2. `cd dva-mini-wechat`
3. 安装依赖 `yarn install`
4. ~~克隆小程序的Demo到目录src下 `git clone https://github.com/rojer95/dva-mini-wechat-demo.git src`~~
5. 在小程序IDE中打开demo目录的项目
6. 在`dva-mini-wechat`目录下运行命令`npm run build`编译依赖包，可以看到在`demo\lib`目录下生成了`index.js`文件
7. 在小程序IDE编译并运行即可（必须开始ES6转ES5）


## 关于测试与其他
目前还没有写测试用例，以及性能方面的测试，后面有时间补上，欢迎各位提各种意见，感谢支持，谢谢。
