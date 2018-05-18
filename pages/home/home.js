// pages/square/square.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isMorning: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.dialog = this.selectComponent("#dialog");

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
                url: '/pages/read/read'
            })
        }else {
            wx.navigateTo({
                url: '/pages/speak/speak'
            })
        }
    },
    showContent:function(){

        this.dialog.togglerShow({
            title:"【月亮与六便士】",
            author:"[英]威廉·萨默塞特·毛姆",
            content: "世界上只有少数人能够最终达到自己的理想。我们的生活很单纯、很简朴。我们并不野心勃勃，如果说我们也有骄傲的话，那是因为在想到通过双手获得的劳动成果时的骄傲。我们对别人既不嫉妒，更不怀恨。唉，我亲爱的先生，有人认为劳动的幸福是句空话，对我说来可不是这样。我深深感到这句话的重要意义。我是个很幸福的人。世界上只有少数人能够最终达到自己的理想。我们的生活很单纯、很简朴。我们并不野心勃勃，如果说我们也有骄傲的话，那是因为在想到通过双手获得的劳动成果时的骄傲。我们对别人既不嫉妒，更不怀恨。唉，我亲爱的先生，有人认为劳动的幸福是句空话，对我说来可不是这样。我深深感到这句话的重要意义。我是个很幸福的人。"
        });
    }
})
 
 