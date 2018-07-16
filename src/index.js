import * as dva from 'dva-core';
import regenerator from 'regenerator-runtime';
import EventEmitter from 'events';

const connect = (mapStateToProps) => {
    const app = getApp()
    const state = app._store.getState();
    const watchMap = mapStateToProps(state);

    return (opts) => {

        const onLoad = opts.onLoad || function (options) { };
        const onShow = opts.onShow || function () { };
        const onUnload = opts.onUnload || function () { };

        opts.__watch__ = function (key, newData) {
            const diff = {};
            for (const itemKey in newData) {
                if (newData.hasOwnProperty(itemKey)) {
                    const element = newData[itemKey];
                    diff[`${key}.${itemKey}`] = element;
                }
            }

            if (Object.keys(diff).length === 0) {
                return;
            }

            if (app.debug) {
                console.log('[page]:', this.route, '[diff]:', diff);
            }
            this.setData(diff)
        }

        opts.onLoad = function (options) {
            this._query = options;
            // 注册监听
            for (const key of Object.keys(watchMap)) {
                global._event_.on(key, this.__watch__);
            }
            this.setData(mapStateToProps(app._store.getState()))
            onLoad.call(this, options)
        }

        opts.onShow = function () {
            global._routing_ = false;
            const _dva_app_ = app._dva_app_;
            _dva_app_._history._handler();
            onShow.call(this);
        }

        opts.onUnload = function () {
            // 注销监听
            for (const key of Object.keys(watchMap)) {
                global._event_.removeListener(key, this.__watch__);
            }
            onUnload.call(this);
        }

        return {
            ...opts,
            data: {
                ...opts.data,
            },
            dispatch: app._store.dispatch
        }
    }
}



const history = {
    _listenHooks: [],
    _oldPages: [],
    _handler: () => {
        const pages = getCurrentPages();
        const oldPages = history._oldPages;

        if (pages.length > 0) {
            const isBack = pages.length + 1 == oldPages.length; //页面返回	页面不断出栈，直到目标返回页，新页面入栈
            // console.log(isBack)
            history._oldPages = pages;
            const currentPage = { route: pages[pages.length - 1].route, _query: pages[pages.length - 1]._query }

            if (currentPage.route.indexOf('/') != 0) {
                currentPage.route = '/' + currentPage.route
            }

            const app = getApp();
            app._store.dispatch({
                type: '@@route/save',
                payload: {
                    pathname: currentPage.route,
                    query: currentPage._query,
                    isBack
                }
            })

            history._listenHooks.forEach((listen) => {

                listen({
                    pathname: currentPage.route,
                    query: currentPage._query,
                    isBack
                })


            })
        }

    },

    listen: (callback) => {
        history._listenHooks.push(callback)
    },
}

const creatApp = (opts) => {
    const app = dva.create({
        ...opts.dvaHooks
    });

    app.use(require('./handleActions.js'));

    app._history = history;

    if (opts.models) {
        opts.models.forEach((model) => {
            app.model(model)
        })
    }

    // 初始化记录路由数据的模块
    app.model({
        namespace: '@@route',
        state: {
            pathname: null,
            query: {},
            isBack: false
        },
        reducers: {
            save(state, { payload }) {
                return { ...state, ...payload };
            },
        },

        effects: {}
    })

    app.start()

    opts._store = app._store;
    opts._dva_app_ = app;
    global._event_ = new EventEmitter();

    return opts;
}

const request = (opts) => {

    return new Promise((resolve, reject) => {
        opts.success = ({ data, statusCode, header }) => {
            if (statusCode < 200 || statusCode >= 300) {
                reject({ data, statusCode, header })
            }
            resolve({ data, statusCode, header })
        }

        opts.fail = (error) => {
            reject(error)
        }

        wx.request(opts)
    })
}


const getNodeAttr = (e, name) => {
    // console.log(e)
    if (Object.prototype.hasOwnProperty.call(e, 'currentTarget') &&
        Object.prototype.hasOwnProperty.call(e.currentTarget, 'dataset') &&
        Object.prototype.hasOwnProperty.call(e.currentTarget.dataset, name)
    ) {
        return e.currentTarget.dataset[name];
    }
    return undefined;
}
global._routing_ = false
const routerRedux = ({ pathname, query }) => {
    if (global._routing_) return { type: '@@route/save', payload: {} };
    global._routing_ = true;
    let queryStr = '';
    Object.keys(query).forEach((key) => {
        queryStr += key + '=' + query[key];
    });

    wx.navigateTo({
        url: pathname + '?' + queryStr
    })

    return {
        type: '@@route/save',
        payload: {
            pathname,
            query,
            isBack: false
        }
    };
}

/**
 * 这段代码复制来自
 * https://github.com/maichong/labrador/blob/ed416658f1ab5395e81a847b6255d47857a39410/index.js#L55
 * 
 * 主要作用是把微信的接口直接用Promise封装
 */

// 特别指定的wx对象中不进行Promise封装的方法
const noPromiseMethods = {
    clearStorage: 1,
    hideToast: 1,
    showNavigationBarLoading: 1,
    hideNavigationBarLoading: 1,
    drawCanvas: 1,
    canvasToTempFilePath: 1,
    hideKeyboard: 1,
};
const _wx = {};
Object.keys(wx).forEach((key) => {
    if (
        noPromiseMethods[key]                        // 特别指定的方法
        || /^(on|create|stop|pause|close)/.test(key) // 以on* create* stop* pause* close* 开头的方法
        || /\w+Sync$/.test(key)                      // 以Sync结尾的方法
    ) {
        // 不进行Promise封装
        _wx[key] = function () {
            if (__DEV__) {
                let res = wx[key].apply(wx, arguments);
                if (!res) {
                    res = {};
                }
                if (res && typeof res === 'object') {
                    res.then = () => {
                        console.warn('wx.' + key + ' is not a async function, you should not use await ');
                    };
                }
                return res;
            }
            return wx[key].apply(wx, arguments);
        };
        return;
    }

    // 其余方法自动Promise化
    _wx[key] = function (obj) {
        obj = obj || {};
        return new Promise((resolve, reject) => {
            obj.success = resolve;
            obj.fail = (res) => {
                if (res && res.errMsg) {
                    reject(new Error(res.errMsg));
                } else {
                    reject(res);
                }
            };
            wx[key](obj);
        });
    };
});
/**
 * 复制结束 (#^.^#)
 */
export {
    creatApp,
    regenerator,
    connect,
    request,
    getNodeAttr,
    routerRedux,
    _wx
}