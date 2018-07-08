import regeneratorRuntime from '../../../utils/regenerator-runtime';
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        name: app.globalData.name,
        tab: 0,
        ranking: [],
        mine: {}
    },
    async getPunchRanking () {
        const ret = await app.get('/ranking/punch', { type: this.data.tab });
        if (ret && ret.code === 1) {
            this.setData({
                mine: ret.data.mine,
                ranking: ret.data.list
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad (options) {
        this.getPunchRanking();
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: "#000000"
        })
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
    toTab (event) {
        this.setData({
            tab: event.currentTarget.dataset.tab
        })
        this.getPunchRanking();
    }
})