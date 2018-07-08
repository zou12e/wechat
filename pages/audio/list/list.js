import regeneratorRuntime from '../../../utils/regenerator-runtime';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: []
  },
  async getAudiList (type) {
    const ret = await app.get('/audio/getAudiosByType', { type});
    if (ret && ret.code == 1) {
        this.setData({
            data: ret.data
        });
    }
  },
  async _load(options) {
      this.getAudiList(options.type);  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
  
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
          title: '趣朗读，让世界听见你的声音',
          path: '/pages/home/home'
      }
  }
})