import regeneratorRuntime from '../../utils/regenerator-runtime';
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        first: true,
        userId: 0,
        user: {},
        userInfo: {},
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
    async _load(options) {
        this.audioList = this.selectComponent("#audiolist");
        this.setData({
            userId: options.id,
            userInfo: app.globalData.userInfo
        })

        this.getUserById();
        this.getOhtersBlogList(true);
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
        if (!this.data.first) {
            this.getOhtersBlogList(true);
        }
        this.setData({
            first: false
        })
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
    onShareAppMessage (res) {
        return this.audioList.onShareAppMessage(res);
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
            app.success(user.isFollow ? '已关注' : '已取消关注');
        } else {
            app.fail();
        }
    },
})