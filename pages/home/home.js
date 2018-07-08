
import regeneratorRuntime from '../../utils/regenerator-runtime';
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isMorning: true,
        isHidden: true,
        isPlay: false,
        playInfo: {},
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
            this.setPlayInfo();
            if(this.data.data.info.isRead){
                this.toMorning();
            } else {
                this.toNight();
            }
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
    /**
     * 获取用户信息
     */
    getUserInfo () {
        if (app.globalData.userInfo) {
            this.getReadSpeak();
        } else {
            app.userInfoReadyCallback = () => {
                this.getReadSpeak();
            };
        }
    },
    setHidden() {
        if (this.data.isMorning){
            this.setData({
                isHidden:this.data.data.info.isRead?false:true
            });
        } else {
            this.setData({
                isHidden: this.data.data.info.isRead ? true : false
            });
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad (options) {


        this.dialog = this.selectComponent('#dialog');
        this.start = this.selectComponent('#startime');
        this.end = this.selectComponent('#endtime');
       
        this.getUserInfo();
        // wx.setTabBarBadge({
        //     index: 2,
        //     text: '1'
        // })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady () {

    },
    /**
     * 生命周期函数--监听页面显示
     */
    async onShow () {
        
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide () {
        this.stop();
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
    play () {
        
        this.setData({
            isPlay: !this.data.isPlay
        })

        if (this.data.isPlay) {
            this.showContent();
            this.innerAudioContext.play();
        } else {
            this.innerAudioContext.pause();
        }

    },
    stop () {
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
            backgroundColor: '#FFB307'
        })

        wx.setTabBarStyle({
            backgroundColor: '#fff',
        })

        this.setHidden();

    },
    toNight(event) {
        this.stop();
        this.setData({
            isMorning: false
        })

        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#00132A'
        })

        wx.setTabBarStyle({
            backgroundColor: '#fff',
        })

        this.setHidden();
    },
    toUrl () {

        if (this.data.isMorning) {
            wx.navigateTo({
                // url: '/pages/home/detail/detail?id=' +this.data.data.read.id
                url: '/pages/home/read/read?id=' + this.data.data.read.id
            })
        } else {
            wx.navigateTo({
                url: '/pages/home/speak/speak' + this.data.data.speak.id
            })
        }
    },
    /**
     * 查看文章内容
     */
    showContent () {

        this.dialog.togglerShow({
            title: this.data.data.read.title,
            author: this.data.data.read.author,
            content: this.data.data.read.content
        });
    },
    changeTime (event) {
        const playInfo = this.data.playInfo;
        playInfo.current = (event && event.detail.value) || 0;
        this.setData({
            playInfo: playInfo
        });
        this.start.stom(playInfo.current);
        this.innerAudioContext.seek(playInfo.current);
    },
    async changeAudio () {
        const ret = await app.get('/home/changeInfo', { });
        console.log(ret);
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
    }
})

