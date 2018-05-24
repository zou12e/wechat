import regeneratorRuntime from '../../../utils/regenerator-runtime';
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        type: 0,  // 0：录制  1：停止录制  2：播放  3：暂停
        time: 0,
        src: "",
        classer: ["begin", "stop", "play", "pause"],
        audio: {}
    },
    getAudio: async function(id) {
         const ret =  await app.get('/audio/getAudioById', { id: id});
         if (ret && ret.code === 1) {
            this.setData({
                audio:ret.data
            });
         }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.getAudio(options.id);


        this.time = this.selectComponent("#time");
        this.recorderManager = wx.getRecorderManager()

        this.recorderManager.onStop((cfg) => {
            this.setData({
                src: cfg.tempFilePath
            })
        })
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
    go: function () {

        if (this.data.type == 0) { //点击录音

            const options = {
                duration: 120000,
                sampleRate: 44100,
                numberOfChannels: 1,
                encodeBitRate: 192000,
                format: 'mp3',
                frameSize: 50
            }
            this.recorderManager.start(options);

            this.setData({
                type: 1
            })
            this.time.stom(this.data.time);
            this.cleartime = setInterval(() => {
                this.setData({
                    time: ++this.data.time
                })
                this.time.stom(this.data.time);
            }, 1000)


        } else if (this.data.type == 1) {//点击停止
            this.setData({
                type: 2
            })
            clearInterval(this.cleartime);

            this.recorderManager.stop();

        } else if (this.data.type == 2 && this.data.src) {//点击播放
            this.setData({
                type: 3
            });
            if (this.innerAudioContext) {
                this.innerAudioContext.play();
                return;
            }
            this.innerAudioContext = wx.createInnerAudioContext();
            this.innerAudioContext.src = this.data.src;
            this.innerAudioContext.onPlay(() => {
                console.log('开始播放')
            });
            this.innerAudioContext.onEnded(() => {
                console.log('音频结束')
                this.setData({
                    type: 2,
                    time: 0
                });
                this.time.stom(this.data.time);
            });
            this.innerAudioContext.onTimeUpdate(() => {
                this.setData({
                    time: this.innerAudioContext.currentTime
                });
                this.time.stom(this.data.time);
            })
            this.innerAudioContext.play();
        } else if (this.data.type == 3) {//点击暂停
            this.innerAudioContext.pause();
            this.setData({
                type: 2
            })
        }


    },
    rego: function () {
        this.innerAudioContext = null;
        this.setData({
            type: 0
        })
    },
    savego:function(){
        wx.navigateTo({
            url: '/pages/audio/audio'
        })
    }
})