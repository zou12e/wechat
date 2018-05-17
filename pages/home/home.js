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
    }
})
 
 