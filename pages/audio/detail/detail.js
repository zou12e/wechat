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
    async getCommentById () {
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
    onLoad (options) {
        this.dialog = this.selectComponent("#dialog");
        this.setData({
            commnetId: options.id
        })
        this.getCommentById();
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
    showReply (event) {
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
    }
})