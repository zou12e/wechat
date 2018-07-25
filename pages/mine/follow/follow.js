import regeneratorRuntime from '../../../utils/regenerator-runtime';
const app = getApp();

// pages/follow/follow.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      tab: 0,
      data: [],
  },
  async getFollowList () {
        const ret =await app.get('/user/getFollow',{type:this.data.tab});
        if(ret && ret.code ===1){
            this.setData({
                data:ret.data.list
            })
        }
  },
  async _load(options) {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
      this.getFollowList();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
  
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow(options) {
      wx.hideShareMenu();
      if (app.globalData.userInfo) {
          this._load(options);
      } else {
          app.userInfoReadyCallback = () => {
              this._load(options);
          };
      }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage () {
      return {
          title: app.globalData.shareMsg[parseInt(Math.random() * 7)],
          path: '/pages/home/home?share=1'
      }
  },
  toTab (event) {
      this.setData({
          tab: event.currentTarget.dataset.tab
      })
        this.getFollowList();
  }
})