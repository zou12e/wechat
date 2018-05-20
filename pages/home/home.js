// pages/square/square.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isMorning: true,
        isPlay:false,
        playInfo: {

        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const playInfo =  {
            title: "【月亮与六便士】",
            src:"http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46",
            time:401,
            current:0
        } ;
        this.setData({
            playInfo: playInfo
        });
        this.dialog = this.selectComponent("#dialog");
        this.start = this.selectComponent("#startime");
        this.end = this.selectComponent("#endtime");

        this.start.stom(0);
        this.end.stom(playInfo.time);

        this.innerAudioContext = wx.createInnerAudioContext();
        this.innerAudioContext.src = playInfo.src;
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

        wx.setTabBarBadge({
            index: 1,
            text: '1'
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
    play: function(){

        this.setData({
            isPlay: !this.data.isPlay
        })

        if (this.data.isPlay){
            this.innerAudioContext.play();
        }else {
            this.innerAudioContext.pause();
        }

    },
    stop:function(){
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
    toUrl:function(){
        
        if (this.data.isMorning){
            wx.navigateTo({
                url: '/pages/home/read/read'
            })
        }else {
            wx.navigateTo({
                url: '/pages/home/speak/speak'
            })
        }
    },
    showContent:function(){

        this.dialog.togglerShow({
            title:"【月亮与六便士】",
            author:"[英]威廉·萨默塞特·毛姆",
            content: "世界上只有少数人能够最终达到自己的理想。我们的生活很单纯、很简朴。我们并不野心勃勃，如果说我们也有骄傲的话，那是因为在想到通过双手获得的劳动成果时的骄傲。我们对别人既不嫉妒，更不怀恨。唉，我亲爱的先生，有人认为劳动的幸福是句空话，对我说来可不是这样。我深深感到这句话的重要意义。我是个很幸福的人。世界上只有少数人能够最终达到自己的理想。我们的生活很单纯、很简朴。我们并不野心勃勃，如果说我们也有骄傲的话，那是因为在想到通过双手获得的劳动成果时的骄傲。我们对别人既不嫉妒，更不怀恨。唉，我亲爱的先生，有人认为劳动的幸福是句空话，对我说来可不是这样。我深深感到这句话的重要意义。我是个很幸福的人。"
        });
    },
    changeTime: function(event){

        var playInfo = this.data.playInfo;
        playInfo.current = (event && event.detail.value) || 0;
        this.setData({
            playInfo: playInfo
        });
        this.start.stom(playInfo.current);
        this.innerAudioContext.seek(playInfo.current);
    },
    changeAudio: function(){

        const playInfo = {
            title:"【追风筝的人】",
            src: "http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46",
            time: 401,
            current: 0
        };
        this.setData({
            playInfo: playInfo
        });
        this.innerAudioContext.seek(playInfo.current);
        this.stop();
    }
})
 
 