# dva-mini-wechat
dva.js for mini wechat |  小程序版的Dva.js

---
## 关于Dva.js的使用方法

* [Dva.JS的中文文档](https://github.com/dvajs/dva/blob/master/README_zh-CN.md)
* 理解 dva 的 [8 个概念](https://github.com/dvajs/dva/blob/master/docs/Concepts_zh-CN.md) ，以及他们是如何串起来的
* 掌握 dva 的[所有 API](https://github.com/dvajs/dva/blob/master/docs/API_zh-CN.md)


## 一些特殊之处

以下能帮你更好地理解和使用 小程序版本的 dva ：

* 必须在`app.js`入口文件，使用`creatApp`来创建`store`
* 在需要用到`store`数据的组件/页面使用`connect`来连接`store`中的`state`，`connect`只接受传入`mapStateToProps`一个参数
* 页面的`onLoad`,`onShow`,`onReady`生命周期函数不能调用`dispatch`，意味着您要在`model`内的`subscriptions`中用`history.listen`来监听来实现，这也符合Dva的设计规范
* 我对`history.listen`的传入参数进行了调整，目前传入的参数是`{ pathname, query, isBack }`，分别代表`当前路由路径(以/开头)`、`路由携带参数 Object类型`、`是否是从上一个页面返回 Boolean类型`，其他的如果有特殊需要请自行参考源码进行调整或者反馈给我，谢谢。
* 由于微信小程序不支持`regeneratorRuntime`，所以在`models`与`services`内请记得引用`regeneratorRuntime`
* 关于路由的跳转：可以使用`this.dispatch(routerRedux({...}))`，也可以使用`wx.navigateTo`，这里`routerRedux`等价于`wx.navigateTo`，但不等价于`wx.redirectTo`等其他路由跳转的接口；如需要获取当前页面的路由信息，可以获取我已经预定义好的model，名称为`@@route`
* `dispatch`在页面的其他函数（`onLoad`,`onShow`,`onReady`生命周期函数以外）使用`this.dispatch`来调用，传入参数与Dva一致
* 参考了[labrador](https://github.com/maichong/labrador) 库对全局的 wx 变量进行了封装为`_wx`，将所有 wx 对象中的异步方法进行了Promise支持， 除了同步的方法，这些方法往往以 on*、create*、stop*、pause*、close* 开头或以 *Sync 结尾，这样在`model`的`effects`中。你可以直接使用`yield _wx.login()`的方法来“同步”的获取数据
* `getNodeAttr` 可以用于获取事件中WXML节点的`data-`参数
* 目前就这些，其他待补充


## Demos

* [Demo](https://github.com/rojer95/dva-mini-wechat-demo)，简单计数器&斗鱼接口调用


## 快速上手DEMO

这里以Demo为例

1. 克隆本项目 `git clone https://github.com/rojer95/dva-mini-wechat.git`
2. `cd dva-mini-wechat`
3. 安装依赖 `npm install`
4. 克隆小程序的Demo到目录src下 `git clone https://github.com/rojer95/dva-mini-wechat-demo.git src`
5. 在小程序IDE中打开src目录的项目
6. 在`dva-mini-wechat`目录下运行命令`npm run build`编译依赖包，可以看到在`src\lib`目录下生成了`index.js`文件
7. 在小程序IDE编译并运行即可（必须开始ES6转ES5）
 

### 关于测试与其他
目前还没有写测试用例，以及性能方面的测试，后面有时间补上，欢迎各位提各种意见，感谢支持，谢谢。
