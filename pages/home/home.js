// pages/square/square.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isMorning: true,
        isPlay: false,
        playInfo: {},
        data: {}
    },
    /**
     * 获取早读晚讲信息
     */
    getReadSpeak: async function () {

        const ret = await app.get('/home/getReadSpeak');
        if (ret && ret.code === 1) {
            this.setData({
                data: ret.data
            });
            this.setPlayInfo();
        }

    },
    setPlayInfo() {

        const playInfo = this.data.data.read;
        playInfo.current = 0;
        this.setData({
            playInfo: playInfo
        });

        this.start.stom(0);
        this.end.stom(playInfo.time);

        this.innerAudioContext = wx.createInnerAudioContext();
        this.innerAudioContext.src = playInfo.url;
        this.innerAudioContext.onPlay(() => {
            console.log('开始播放')
        })
        this.innerAudioContext.onEnded(() => {
            console.log('音频结束');
            this.setData({
                isPlay: false
            })
            var playInfo = this.data.playInfo;
            playInfo.current = 0;
            this.setData({
                playInfo: playInfo
            });
            this.start.stom(0);
        });

        this.innerAudioContext.onTimeUpdate(() => {
            var playInfo = this.data.playInfo;
            playInfo.current = this.innerAudioContext.currentTime;
            this.setData({
                playInfo: playInfo
            });
            this.start.stom(playInfo.current);
        })
    },
    /**
     * 获取用户信息
     */
    getUserInfo: function () {
        if (app.globalData.userInfo) {
            this.getReadSpeak();
        } else {
            app.userInfoReadyCallback = () => {
                this.getReadSpeak();
            };
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {


        this.dialog = this.selectComponent("#dialog");
        this.start = this.selectComponent("#startime");
        this.end = this.selectComponent("#endtime");

        this.getUserInfo();

        // wx.setTabBarBadge({
        //     index: 2,
        //     text: '1'
        // })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: async function () {

    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        this.stop();
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
    play: function () {

        this.setData({
            isPlay: !this.data.isPlay
        })

        if (this.data.isPlay) {
            this.innerAudioContext.play();
        } else {
            this.innerAudioContext.pause();
        }

    },
    stop: function () {
        this.setData({
            isPlay: false
        })
        this.innerAudioContext.pause();
    }
    ,
    toMorning(event) {

        this.setData({
            isMorning: true
        })

        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: "#FFB307"
        })

        wx.setTabBarStyle({
            backgroundColor: '#fff',
        })



    },
    toNight(event) {
        this.stop();
        this.setData({
            isMorning: false
        })

        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: "#00132A"
        })

        wx.setTabBarStyle({
            backgroundColor: '#fff',
        })
    },
    toUrl: function () {

        if (this.data.isMorning) {
            wx.navigateTo({
                url: '/pages/home/read/read'
            })
        } else {
            wx.navigateTo({
                url: '/pages/home/speak/speak'
            })
        }
    },
    /**
     * 查看文章内容
     */
    showContent: function () {

        this.dialog.togglerShow({
            title: this.data.data.read.title,
            author: this.data.data.read.author,
            content: this.data.data.read.content
        });
    },
    changeTime: function (event) {

        var playInfo = this.data.playInfo;
        playInfo.current = (event && event.detail.value) || 0;
        this.setData({
            playInfo: playInfo
        });
        this.start.stom(playInfo.current);
        this.innerAudioContext.seek(playInfo.current);
    },
    changeAudio: async function () {
        const ret = await app.get('/home/changeInfo', { type: this.data.isMorning ? 1 : 2 });
        if (ret && ret.code === 1) {
            const data = this.data.data;
            if (this.data.isMorning) {
                data.read = ret.data;
                this.stop();
                this.setPlayInfo();
            } else {
                data.speak = ret.data;
            }
            this.setData({
                data: data
            });
           
        }

        // const playInfo = {
        //     title: "【追风筝的人】",
        //     url: "http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46",
        //     time: 401,
        //     current: 0
        // };
        // this.setData({
        //     playInfo: playInfo
        // });
        // this.innerAudioContext.seek(playInfo.current);
        // this.stop();
    }
})

