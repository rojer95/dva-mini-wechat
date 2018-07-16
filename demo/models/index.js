import {
  regenerator as regeneratorRuntime,
  _wx
} from '../lib/index.js';

export default {
  namespace: 'index',
  state: {
    count: 0,
    code: '点击下方按钮获取code'
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    }
  },

  effects: {
    *adjust({ payload }, { call, put, select }) {
      let count = yield select((_)=>_.index.count)
      count += payload;
      yield put({
        type: 'save',
        payload: {
          count
        }
      })
    },

    *login({ payload }, { call, put, select }) {
      let res = yield _wx.login()
      yield put({
        type: 'save',
        payload: {
          code : res.code
        }
      })
    },

  }
}