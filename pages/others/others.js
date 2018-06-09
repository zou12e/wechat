import regeneratorRuntime from '../../utils/regenerator-runtime';
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userId: 0,
        user: {},
    },
    async getOhtersBlogList(reload) {

        const url = '/blog/getBlogListByUserId';
        const param = { id: this.data.userId };
        this.audioList.setList(url, param, reload);
    },
    async getUserById () {
        const ret = await app.get('/user/getUserById',{id:this.data.userId});
        if (ret && ret.code === 1) {
            this.setData({
                user:ret.data
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad (options) {
        this.audioList = this.selectComponent("#audiolist");
        this.setData({
            userId: options.id
        })
        
        this.getUserById();
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
        this.getOhtersBlogList(true);
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide () {
        this.audioList.stop();
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload () {
        this.audioList.stop();
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
        this.getOhtersBlogList();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage () {

    },
    async goFollow  (event) {
        const user = this.data.user;
        app.loading();
        const ret = await app.post('/user/follow', { id: this.data.userId });
        app.hide();
        if (ret && ret.code === 1) {
            user.isFollow = !user.isFollow;
            this.setData({
                user: user,
            });
            app.success();
        } else {
            app.fail();
        }
    },
})