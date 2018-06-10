
import regeneratorRuntime from '../../../utils/regenerator-runtime';
import moment from '../../../utils/moment/moment';
moment.locale('zh-cn');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },
  async getMineComments () {
      const ret = await app.get('/comment/getMineComments');
      if (ret && ret.code == 1) {
          ret.data.list.forEach(item=> {
              item.createTime = moment(item.createTime).fromNow();
          });
          
        this.setData({
            list: ret.data.list
        })
      }
  }
  ,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
      this.dialog = this.selectComponent("#dialog");
      this.getMineComments();
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
  
  },
  showReply(event) {
      const dataset = event.currentTarget.dataset;
      this.dialog.togglerMsg({
          id: dataset.id,
          blogId: dataset.blogid,
          toUserId: dataset.userid,
          toNickName: dataset.name,
          placeholder: "回复" + dataset.name,
          value: ""
      });
  },
  _confirmMsgEvent() {
      app.loading();
      this.comment(this.dialog.data.msgData);

  },
  async comment(info) {

      const ret = await app.post('/comment/add', {
          blogId: info.blogId,
          parentId: info.id,
          toUserId: info.toUserId,
          toUserNickName: info.toNickName,
          content: info.value
      });

      if (ret && ret.code === 1) {
          this.dialog.togglerMsg();
          this.getMineComments();
          app.success('评论成功');
      } else {
          app.fail('评论失败');
      }
  }
})