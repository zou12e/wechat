import regeneratorRuntime from '../../../utils/regenerator-runtime';
import moment from '../../../utils/moment/moment';
moment.locale('zh-cn');
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        blogId: 0,
        userId: 0,
        commnetId: 0,
        comment: {},
    },
    async getCommentById () {
        const ret = await app.get('/comment/getCommentById', { id: this.data.commnetId });

      
        if (ret && ret.code == 1) {

            ret.data.comment.createTime = moment(ret.data.comment.createTime).fromNow();
            ret.data.comment.replyList.forEach(item => {
                item.createTime = moment(item.createTime).fromNow();
            });
            this.setData({
                blogId: ret.data.blogId,
                comment: ret.data.comment
            });
        }

    },
    async _load(options) {
        this.dialog = this.selectComponent("#dialog");
        this.setData({
            commnetId: options.id,
            userId: app.globalData.userInfo.id
        })
        this.getCommentById();
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
            title: app.globalData.shareMsg[parseInt(Math.random() * 7)],
            path: '/pages/home/home?share=1'
        }
    },
    showReply (event) {
        if (!app.globalData.userInfo.nickName) {
            app.fail('请先登录！');
            wx.navigateTo({
                url: '/pages/index/index'
            })
            return;
        }

        const dataset = event.currentTarget.dataset;
        this.dialog.togglerMsg({
            id: dataset.id,
            toUserId: dataset.userid,
            toNickName: dataset.name,
            placeholder: "回复" + dataset.name,
            value: ""
        });
    },
    _confirmMsgEvent () {
        
        app.loading();
        this.comment(this.dialog.data.msgData);
        
    },
    async comment (info) {
 
        const ret =  await app.post('/comment/add', {
            blogId: this.data.blogId,
            parentId: info.id,
            toUserId: info.toUserId,
            toUserNickName: info.toNickName,
            content: info.value
        });

        if (ret && ret.code === 1) {
            this.dialog.togglerMsg();
            this.getCommentById();
            app.success('评论成功');
        } else {
            app.fail('评论失败');
        }
    },
    showDelete(event) {
        const dataset = event.currentTarget.dataset;
        this.dialog.togglerConfirm({
            id: dataset.id,
            title: '温馨提示',
            content: '确定删除该条评论 ？'
        });
    },
    async _confirmEvent() {
        app.loading();
        const commentId = this.dialog.data.confirmData.id;
        const ret = await app.post('/comment/delete', { id: commentId });
        app.hide();
        if (ret && ret.code === 1) {
            app.success('已删除');
            setTimeout(()=> {
                wx.navigateBack();
            }, 1000)
        } else {
            app.fail();
        }
        this.dialog.togglerConfirm();
    }
})