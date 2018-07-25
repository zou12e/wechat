import regeneratorRuntime from '../../../utils/regenerator-runtime';
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlay: false,
        share: 0,
        id: 0,
        playInfo: {},
        data: {}
    },
    /**
     * 获取音频信息
     */
    async getAudioInfo(id) {
        app.loading();
        const ret = await app.get('/audio/getAudioById', {
            id: id
        });

        if (ret && ret.code === 1) {
            app.hide();
            this.setData({
                data: ret.data
            });
            this.setPlayInfo();
            this.play();
        } else {
            app.hide();
            app.fail('网络延迟，请稍后再试');
        }
    },
    setPlayInfo() {
        const playInfo = this.data.data;
        playInfo.current = 0;
        this.setData({
            playInfo: playInfo
        });

        this.start.stom(0);
        this.end.stom(playInfo.time);

        this.innerAudioContext = wx.getBackgroundAudioManager();
        this.innerAudioContext.title = this.data.data.title;
        this.innerAudioContext.coverImgUrl = this.data.data.banner;
        this.innerAudioContext.src = playInfo.url;
        this.innerAudioContext.onPlay(() => {
            console.log('开始播放');
            app.hide();
        })
        this.innerAudioContext.onEnded(() => {
            console.log('音频结束');
            this.setData({
                isPlay: false
            })
            const playInfo = this.data.playInfo;
            playInfo.current = 0;
            this.setData({
                playInfo: playInfo
            });
            this.start.stom(0);
        });

        this.innerAudioContext.onTimeUpdate(() => {
            const playInfo = this.data.playInfo;
            playInfo.current = this.innerAudioContext.currentTime;
            this.setData({
                playInfo: playInfo
            });
            this.start.stom(playInfo.current);
        })
    },
    async _load(options) {
        this.setData({
            id: options.id,
            share: options.share || 0
        });
        this.getAudioInfo(options.id);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.start = this.selectComponent('#startime');
        this.end = this.selectComponent('#endtime');

        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#ffffff'
        })

        wx.setTabBarStyle({
            backgroundColor: '#000000',
        })

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
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
        this.stop();
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        this.stop();
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
        return {
            title: app.globalData.shareMsg[parseInt(Math.random() * 7)],
            imageUrl: this.data.data.banner,
            path: '/pages/home/detail/detail?share=1&id=' + this.data.id,
        }
    },
    play() {

        this.setData({
            isPlay: !this.data.isPlay
        })

        if (this.data.isPlay) {
            try {
                this.innerAudioContext.play();
            } catch (e) {
                this.setPlayInfo();
            }
        } else {
            this.innerAudioContext.pause();
        }

    },
    stop() {
        this.setData({
            isPlay: false
        })
        if (this.innerAudioContext) {
            this.innerAudioContext.stop();
            this.innerAudioContext = null;
        }
    },
    changeTime(event) {
        const playInfo = this.data.playInfo;
        playInfo.current = (event && event.detail.value) || 0;
        this.setData({
            playInfo: playInfo
        });
        this.start.stom(playInfo.current);
        this.innerAudioContext.seek(playInfo.current);
    },
    async changeAudio() {
        const ret = await app.get('/home/changeInfo', {});
        if (ret && ret.code === 1) {
            this.stop();
            this.setData({
                data: ret.data
            });
            this.setPlayInfo();
        }
    }, goRead () {
        if (!app.globalData.userInfo.nickName) {
            app.fail('请先登录！');
            wx.navigateTo({
                url: '/pages/index/index'
            })
            return;            
        } 
        
        wx.navigateTo({
            url: '/pages/home/read/read?id=' + this.data.data.id
        })
    }, goHome () {
        wx.switchTab({
            url: '/pages/home/home' 
        })
    }
})