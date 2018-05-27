import regeneratorRuntime from '../../utils/regenerator-runtime';
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlay: false,
        blogId: 0,
        userId: 0,
        blog: {},
        comment: {},
        playInfo: {}
    },
    getBlogById: async function () {
        const ret = await app.get('/blog/getBlogById', { id: this.data.blogId });
        if (ret && ret.code == 1) {
            this.setData({
                blog: ret.data
            });
            this.setPlayInfo();
        }
        const mret = await app.get('/comment/getCommentByBlogId', { id: this.data.blogId });
        if (mret && mret.code == 1) {
            this.setData({
                comment: mret.data
            });
        }

    },
    setPlayInfo() {
        this.innerAudioContext = wx.createInnerAudioContext();
        const playInfo = {
            title: this.data.blog.title,
            src: this.data.blog.url,
            time: this.data.blog.time,
            current: 0
        };
        this.setData({
            playInfo: playInfo
        });

        this.start.stom(0);
        this.end.stom(playInfo.time);


        this.innerAudioContext.src = playInfo.src;
        this.innerAudioContext.onPlay(() => {
            console.log('开始播放')
        })
        this.innerAudioContext.onTimeUpdate(() => {
            const playInfo = this.data.playInfo;
            playInfo.current = this.innerAudioContext.currentTime
            this.setData({
                playInfo: playInfo
            });
            this.start.stom(playInfo.current);
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.dialog = this.selectComponent("#dialog");
        this.start = this.selectComponent("#startime");
        this.end = this.selectComponent("#endtime");
        this.dialog = this.selectComponent("#dialog");

        this.setData({
            blogId: options.id,
            userId: app.globalData.userInfo.id
        });
        this.getBlogById();

        if (options.comment) {
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
    showContent: function () {

        this.dialog.togglerShow({
            title: this.data.blog.title,
            author: this.data.blog.author,
            content: this.data.blog.content
        });
    },
    showReply: function (event) {
        this.dialog.togglerMsg({
            placeholder: "回复" + event.currentTarget.dataset.name,
            value: ""
        });
    }
    ,
    showComment: function (event) {
        this.dialog.togglerMsg({
            placeholder: "评论",
            value: ""
        });
    },
    _confirmMsgEvent: function () {
        // TODO 评论
        console.log(this.dialog.data);
        this.dialog.togglerMsg();
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
    },
    changeTime: function (event) {
        const playInfo = this.data.playInfo;
        playInfo.current = (event && event.detail.value) || 0;
        this.setData({
            playInfo: playInfo
        });
        this.start.stom(playInfo.current);
        this.innerAudioContext.seek(playInfo.current);
    },
    goFollow: async function () {
        const blog = this.data.blog;
        app.loading();
        const ret = await app.post('/user/follow', { id: blog.userId });
        app.hide();
        if (ret && ret.code === 1) {
            blog.isFollow = !blog.isFollow;
            this.setData({
                blog: blog,
            });
            app.success();
        } else {
            app.fail();
        }
    },
    goForward: function (event) {
        const blog = this.data.blog;
        app.success('转发成功');
    },
    goCollection: async function (event) {
        const blog = this.data.blog;
        app.loading();
        const ret = await app.post('/blog/collection', { id: blog.id });
        app.hide();
        if (ret && ret.code === 1) {
            blog.isCollection = !blog.isCollection;
            this.setData({
                blog: blog,
            });
            app.success();
        } else {
            app.fail();
        }
    },
    goThumb: async function (event) {
        const blog = this.data.blog;
        app.loading();
        const ret = await app.post('/blog/thumb', { id: blog.id });
        app.hide();
        if (ret && ret.code === 1) {
            blog.isThumb = !blog.isThumb;
            blog.thumbs = parseInt(blog.thumbs) + (blog.isThumb ? 1 : -1);
            this.setData({
                blog: blog,
            });
            app.success();
        } else {
            app.fail();
        }
    }

})