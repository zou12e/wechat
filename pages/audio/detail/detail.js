import regeneratorRuntime from '../../../utils/regenerator-runtime';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
      blogId: 0,
      commnetId: 0,
      comment: {},
    },
    getCommentById: async function () {
        const ret = await app.get('/comment/getCommentById', { id: this.data.commnetId });
        if (ret && ret.code == 1) {
            this.setData({
                blogId: ret.data.blogId,
                comment: ret.data.comment
            });
        }

    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.dialog = this.selectComponent("#dialog");
      this.setData({
          commnetId: options.id
      })
      this.getCommentById();
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
  showReply: function (event) {

      this.dialog.togglerMsg({
          placeholder: "回复" + event.currentTarget.dataset.name,
          value: ""
      });
  },
  _confirmMsgEvent: function () {
     // TODO 评论
      console.log(this.dialog.data);
      this.dialog.togglerMsg();
  }
})