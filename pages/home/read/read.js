import regeneratorRuntime from '../../../utils/regenerator-runtime';
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        audioId: 0,
        audio: {}
    },
    async getAudio() {
        const ret = await app.get('/audio/getAudioById', { id: this.data.audioId});
         if (ret && ret.code === 1) {
            this.setData({
                audio:ret.data
            });
         }
    },
    async _load(options) {
        this.setData({
            audioId: options.id
        });
        this.getAudio();

        this.record = this.selectComponent("#record");
        this.record.init();
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
    /** 
     * 保存语音
     */
    async _savego() {
  
        const path = this.record.data.src;
        const time = this.record.data.audioTime;
        const ret =await app.post('/blog/save', {
            audioId: this.data.audioId,
            type: this.data.audio.type,
            url: path,
            time: time
        });
        if (ret && ret.code == 1) {
            app.success('保存成功');
            setTimeout(() => {
                wx.redirectTo({
                    url: '/pages/audio/audio?score=1&id=' + ret.data.id 
                })
            }, 1000)
        } else {
            this.record.fail();
        }
    }
})