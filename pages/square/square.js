const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        tab: 0,
        data: [],
        last: -1
    },
    getBlogList: async function () {
        const ret = await app.get('/blog/list', { type: parseInt(this.data.tab) + 1 });
        if (ret && ret.code === 1) {
            const list = ret.data.list;
            this.setData({
                data: list
            });
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getBlogList();
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
        this.getBlogList();
    },
    play: function (event) {

        const index = event.currentTarget.dataset.index;
        const blog = this.data.data[index];
        console.log(blog);
        blog.isPlay = !blog.isPlay;

        if (!blog.audio) {
            blog.audio = wx.createInnerAudioContext();
            blog.audio.src = blog.url;
            blog.audio.onEnded(() => {
                blog.isPlay = false;
            });
        }

        if (this.data.last != -1 && blog.isPlay && this.data.last != index) {
            this.data.data[this.data.last].isPlay = false;
            blog.audio.pause();
        }

        this.setData({
            data: this.data.data,
            last: index
        });

        if (blog.isPlay) {
            blog.audio.play();
        } else {
            blog.audio.pause();
        }

    },
    goFollow: async function (event) {
        const index = event.currentTarget.dataset.index;
        const blog = this.data.data[index];
        app.loading();
        const ret =await app.post('/user/follow', { id: blog.userId });
        app.hide();
        if (ret && ret.code === 1) {
            blog.isFollow = !blog.isFollow;
            this.setData({
                data: this.data.data,
            });
            app.success();
        }
    },
    goForward: function (event) {
        const index = event.currentTarget.dataset.index;
        const blog = this.data.data[index];
        app.success('转发成功');
    },
    goCollection: async function (event) {
        const index = event.currentTarget.dataset.index;
        const blog = this.data.data[index];
        app.loading();
        const ret = await app.post('/user/follow', { id: blog.userId });
        app.hide();
        if (ret && ret.code === 1) {
            blog.isCollection = !blog.isCollection;
            this.setData({
                data: this.data.data,
            });
            app.success();
        }     
    },
    goThumb: async function (event) {
        const index = event.currentTarget.dataset.index;
        const blog = this.data.data[index];
        app.loading();
        const ret = await app.post('/user/follow', { id: blog.userId });
        app.hide();
        if (ret && ret.code === 1) {
            blog.isThumb = !blog.isThumb;
            blog.thumbs = parseInt(blog.thumbs) + (blog.isThumb ? 1 : -1);
            this.setData({
                data: this.data.data,
            });
            app.success();
        }   
    }

})