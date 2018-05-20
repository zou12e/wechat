// pages/audio/audio.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.dialog = this.selectComponent("#dialog");
        if (options.comment){
            this.showComment();
        }
        
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
    showContent: function () {

        this.dialog.togglerShow({
            title: "【月亮与六便士】",
            author: "[英]威廉·萨默塞特·毛姆",
            content: "世界上只有少数人能够最终达到自己的理想。我们的生活很单纯、很简朴。我们并不野心勃勃，如果说我们也有骄傲的话，那是因为在想到通过双手获得的劳动成果时的骄傲。我们对别人既不嫉妒，更不怀恨。唉，我亲爱的先生，有人认为劳动的幸福是句空话，对我说来可不是这样。我深深感到这句话的重要意义。我是个很幸福的人。世界上只有少数人能够最终达到自己的理想。我们的生活很单纯、很简朴。我们并不野心勃勃，如果说我们也有骄傲的话，那是因为在想到通过双手获得的劳动成果时的骄傲。我们对别人既不嫉妒，更不怀恨。唉，我亲爱的先生，有人认为劳动的幸福是句空话，对我说来可不是这样。我深深感到这句话的重要意义。我是个很幸福的人。"
        });
    },
    showReply: function () {
        this.dialog.togglerMsg({
            placeholder: "回复",
            value:""
        });
    }
    ,
    showComment: function () {
        this.dialog.togglerMsg({
            placeholder:"评论",
            value: ""
        });
    },
    _confirmMsgEvent: function () {
        console.log(this.dialog.data);
        this.dialog.togglerMsg();
    }
})