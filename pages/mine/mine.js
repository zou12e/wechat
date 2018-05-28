import regeneratorRuntime from '../../utils/regenerator-runtime';
const moment = require('../../utils/moment/moment');
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        allDays: 0,
        punchDays: 0,
        continuDays:0,
        info:{}
    },
    async getInfo(){
        const ret = await app.get('/user/getInfo');
        if(ret && ret.code){
            this.setData({
                info: ret.data
            })
        }
    },
    async getPunchInfo(year, month){
        const ret = await app.get('/user/getPunchInfo',{
            year: year,
            month: month
        });
        if(ret && ret.code ==1){
            const continuDays = this.calendar.setDays(ret.data.list, year, month);
            this.setData({
                allDays: ret.data.allDays,
                punchDays: ret.data.punchDays,
                continuDays: continuDays,
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad (options) {
        this.calendar = this.selectComponent("#calendar");
        const current = this.calendar.getCurrentMonth();
        this.getPunchInfo(current.year(), current.month() + 1);
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
        this.getInfo();
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
    _preMonth() {
        const last = this.calendar.getCurrentMonth().subtract(1, 'month');
        this.getPunchInfo(last.year(), last.month() + 1)
    },
    _nextMonth() {
        const next = this.calendar.getCurrentMonth().add(1, 'month');
        this.getPunchInfo(next.year(), next.month() + 1)
    },
})