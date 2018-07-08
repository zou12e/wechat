import regeneratorRuntime from '../../utils/regenerator-runtime';
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        first: true,
        tab: 0
    },
    async getBlogList (reload) {
        const url = '/blog/list';
        this.audioList.setList(url, {},reload);
    },
    async _load(options) {
       
        this.getBlogList(true);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad (options) {
        wx.hideShareMenu();
        this.audioList = this.selectComponent("#audiolist");
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
        app.loading('加载中');
        this.getBlogList(true);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom () {
        this.getBlogList();
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage (res) {
        return this.audioList.onShareAppMessage(res);
    },
    toPunch () {
        wx.navigateTo({
            url: '/pages/punch/punch'
        })
    },
    toThumb () {
        wx.navigateTo({
            url: '/pages/thumb/thumb'
        })
    },
    toTab (event) {
        this.setData({
            tab: event.currentTarget.dataset.tab
        })
        this.getBlogList(true);
    }
})