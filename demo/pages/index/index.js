//index.js
//获取应用实例
import {
  connect,
  routerRedux
} from '../../lib/index.js';

Page(connect(({ index }) => ({ index }))({
 
   /**
    * 页面的初始数据
    */
   data: {
     
   },
 
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
     this.dispatch({
       type: 'index/adjust',
       payload: 2
     })
   },
 
   /**
    * 生命周期函数--监听页面初次渲染完成
    */
   onReady: function () {
   },
 
   /**
    * 生命周期函数--监听页面显示
    */
   onShow: function () {
   },
 
   /**
    * 生命周期函数--监听页面隐藏
    */
   onHide: function () {
     
   },
 
   /**
    * 生命周期函数--监听页面卸载
    */
   onUnload: function () {
     
   },
 
   /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
   onPullDownRefresh: function () {
     
   },
 
   /**
    * 页面上拉触底事件的处理函数
    */
   onReachBottom: function () {
     
   },
 
   /**
    * 用户点击右上角分享
    */
   onShareAppMessage: function () {
     
   },

   plus: function () {
     this.dispatch({
       type: 'index/adjust',
       payload: 1
     })
   },

   minus: function(){
     this.dispatch({
       type: 'index/adjust',
       payload: -1
     })
   },


   login: function(){
     this.dispatch({
       type: 'index/login',
     })
   },

   goDouyu: function(){

     this.dispatch(routerRedux({
       pathname: '/pages/douyu/index',
       query: {
         type: 'LOL',
       },
     }))

   }
 }))