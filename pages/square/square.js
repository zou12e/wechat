import regeneratorRuntime from '../../utils/regenerator-runtime';
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        tab: 0
    },
    async getBlogList (reload) {
        const url = '/blog/list';
        const param = { type: parseInt(this.data.tab) + 1};
        this.audioList.setList(url, param,reload);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad (options) {
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
    onShow () {
        
        this.getBlogList(true);
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
        this.getBlogList();
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage () {

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