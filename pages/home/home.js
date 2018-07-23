
import regeneratorRuntime from '../../utils/regenerator-runtime';
const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        data: {}
    },
    /**
     * 获取早读晚讲信息
     */
    async getReadSpeak () {
        const ret = await app.get('/home/getReadSpeak');
        if (ret && ret.code === 1) {
            this.setData({
                data: ret.data
            });
        }
    },
    async _load(options) {
        this.getReadSpeak();
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad (options) {
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
    onReady () {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow () {},
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide () {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload () {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh () {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom () {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage () {
        return {
            title: '趣朗读，让世界听见你的声音',
        }
    },
    toUrl () {
        wx.navigateTo({
            url: '/pages/home/detail/detail?id=' +this.data.data.read.id
        })
    },
    async changeAudio () {
        const ret = await app.get('/home/changeInfo', { });
        if (ret && ret.code === 1) {
            wx.navigateTo({
                url: '/pages/home/detail/detail?id=' + ret.data.id
            })
        }
    }
})

