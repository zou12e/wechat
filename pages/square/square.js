Page({

    /**
     * 页面的初始数据
     */
    data: {
        tab: 0,
        data: [{ isPlay: false, audio: null }, { isPlay: false, audio: null }, { isPlay: false, audio: null }, { isPlay: false, audio: null }],
        last: -1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    toPunch: function () {
        wx.navigateTo({
            url: '/pages/punch/punch'
        })
    },
    toThumb: function () {
        wx.navigateTo({
            url: '/pages/thumb/thumb'
        })
    },
    toTab: function (event) {
        this.setData({
            tab: event.currentTarget.dataset.tab
        })

    },
    play: function (event) {



        var index = event.currentTarget.dataset.index;
        this.data.data[index].isPlay = !this.data.data[index].isPlay;

        const playInfo = {
            src: "http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46"
        };
        if (!this.data.data[index].audio) {
            this.data.data[index].audio = wx.createInnerAudioContext();
            this.data.data[index].audio.src = playInfo.src;
            this.data.data[index].audio.onEnded(() => {
                this.data.data[index].isPlay = false;
            });
        }



        if (this.data.last != -1 && this.data.data[index].isPlay && this.data.last != index) {
            this.data.data[this.data.last].isPlay = false;
            this.data.data[index].audio.pause();
        }

        this.setData({
            data: this.data.data,
            last: index
        });

        if (this.data.data[index].isPlay) {
            this.data.data[index].audio.play();
        } else {
            this.data.data[index].audio.pause();
        }

    }

})