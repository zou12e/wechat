import regeneratorRuntime from '../../utils/regenerator-runtime';
const moment = require('../../utils/moment/moment');
moment.locale('zh-cn');
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        first: true,
        isPlay: false,
        isScore: false,
        blogId: 0,
        userId: 0,
        blog: {},
        comment: {},
        playInfo: {},
        info: {},
        star: 3,
        random:1,
        score: 7
    },
    /**
     * 获取blog详情
     */
    async getBlogById() {

        const ret = await app.get('/blog/getBlogById', { id: this.data.blogId });
        if (ret && ret.code == 1) {
            this.setData({
                blog: ret.data
            });
            this.setPlayInfo();
        }


    },
    /**
     * 获取评论
     */
    async getComment(scrollTop) {
        const ret = await app.get('/comment/getCommentByBlogId', { id: this.data.blogId });
        if (ret && ret.code == 1) {
            ret.data.list.forEach(item => {
                item.createTime = moment(item.createTime).fromNow();
            });
            this.setData({
                comment: ret.data
            });
        }
        if (scrollTop) {
            console.log(11);
            wx.createSelectorQuery().select('#j_page').boundingClientRect(function (rect) {
                console.log(rect.bottom);
                wx.pageScrollTo({
                    scrollTop: rect.bottom,
                    duration: 0
                })
            }).exec();
        }
    },
    /**
     * 设置播放器
     */
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
            playInfo.current = this.innerAudioContext.currentTime
            this.setData({
                playInfo: playInfo
            });
            this.start.stom(playInfo.current);
        })
    },
    async _load(options) {

        this.start = this.selectComponent("#startime");
        this.end = this.selectComponent("#endtime");
        this.dialog = this.selectComponent("#dialog");

        this.setData({
            blogId: options.id,
            userId: app.globalData.userInfo.id
        });
        await this.getBlogById();

        if (options.comment) {
            this.showComment();
        }
        if (options.score) {
            this.goScore();
        }

        this.getComment(options.comment);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {

        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#ffffff'
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
     * 播放音频
     */
    play() {
        this.setData({
            isPlay: !this.data.isPlay
        })
        if (this.data.isPlay) {
            app.loading('加载中...');
            this.innerAudioContext.play();
        } else {
            this.innerAudioContext.pause();
        }
    },
    /**
     * 停止音频
     */
    stop() {
        this.setData({
            isPlay: false
        })
        this.innerAudioContext.pause();
    },
    /**
     * 改变进度
     */
    changeTime(event) {
        const playInfo = this.data.playInfo;
        playInfo.current = (event && event.detail.value) || 0;
        this.setData({
            playInfo: playInfo
        });
        this.start.stom(playInfo.current);
        this.innerAudioContext.seek(playInfo.current);
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
        if (!this.data.first) {
            this.getComment();
        }
        this.setData({
            first: false
        })
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
            title: '趣朗读，让世界听见你的声音',
            imageUrl: this.data.blog.banner
        }
    },
    /**
     * 点击回复
     */
    showReply(event) {
        const dataset = event.currentTarget.dataset;
        wx.navigateTo({
            url: dataset.url
        })
        // this.dialog.togglerMsg({
        //     id: dataset.id,
        //     toUserId: dataset.userid,
        //     toNickName: dataset.name,
        //     placeholder: "回复" + dataset.name,
        //     value: ""
        // });
    },
    /**
     * 点击评论
     */
    showComment(event) {

        if (!app.globalData.userInfo.nickName) {
            app.fail('请先登录！');
            wx.navigateTo({
                url: '/pages/index/index'
            })
            return;
        }

        this.dialog.togglerMsg({
            id: 0,
            toUserId: this.data.blog.userId,
            toNickName: this.data.blog.nickName,
            placeholder: "说点什么吧...",
            value: ""
        });
    },
    /**
     * 回调评论确定
     */
    _confirmMsgEvent() {


        app.loading();
        const content = this.dialog.data.msgData.value;

        if (!content) {
            app.fail('评论内容不能为空');
            return;
        }
        if (content.length > 100) {
            app.fail('评论内容不能超过100字');
            return;
        }
        this.comment(this.dialog.data.msgData);

    },
    /**
     * 关注
     */
    async goFollow() {
        const blog = this.data.blog;
        app.loading();
        const ret = await app.post('/user/follow', { id: blog.userId });
        app.hide();
        if (ret && ret.code === 1) {
            blog.isFollow = !blog.isFollow;
            this.setData({
                blog: blog,
            });
            app.success(blog.isFollow ? '已关注' : '已取消关注');
        } else {
            app.fail();
        }
    },
    /**
     * 转发
     */
    goForward(event) {
        const blog = this.data.blog;

    },
    /**
     * 收藏
     */
    async goCollection(event) {
        const blog = this.data.blog;
        app.loading();
        const ret = await app.post('/blog/collection', { id: blog.id });
        app.hide();
        if (ret && ret.code === 1) {
            blog.isCollection = !blog.isCollection;
            this.setData({
                blog: blog,
            });
            app.success(blog.isCollection ? '已收藏' : '已取消收藏');
        } else {
            app.fail();
        }
    },
    /**
     * 点赞
     */
    async goThumb(event) {
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
            app.success(blog.isThumb ? '已点赞' : '已取消点赞');
        } else {
            app.fail();
        }
    },
    /**
     * 评论
     */
    async comment(info) {
        const ret = await app.post('/comment/add', {
            blogId: this.data.blogId,
            parentId: info.id,
            toUserId: info.toUserId,
            toUserNickName: info.toNickName,
            content: info.value
        });

        if (ret && ret.code === 1) {
            this.dialog.togglerMsg();
            this.getComment(true);
            app.success('评论成功');
        } else {
            app.fail('评论失败');
        }
    },
    goHome() {
        wx.switchTab({
            url: '/pages/home/home'
        })
    },
    async goScore() {

        const ret = await app.get('/user/getInfo');
        
        if (ret && ret.code) {
            let star = 3;
            if (this.data.blog.score >= 90) {
                star = 5;
            } else if(this.data.blog.score >= 80) {
                star = 4;
            }
               
            this.setData({
                info: ret.data,
                isScore: 1,
                random: parseInt(Math.random()*9 ) + 1,
                star: star,
                score: parseInt(this.data.blog.score/10)
            })
 

            wx.setNavigationBarColor({
                frontColor: '#ffffff',
                backgroundColor: '#000000'
            })
        }

    },
    async saveImage () {
        app.loading('保存中...');
        const ret = await app.post('/blog/saveImage', {
            star: this.data.star,
            continuDays: this.data.info.continuDays,
            punchDays: this.data.info.punchDays,
            random: this.data.random,
            blog: this.data.blog
        });
        if (ret && ret.code) { 
            wx.downloadFile({
                url: ret.data, //仅为示例，并非真实的资源
                success: function (res) {
                    app.hide();
                    if (res.statusCode === 200) {
                        wx.saveImageToPhotosAlbum({
                            filePath: res.tempFilePath,
                            success: function (res) {
                                app.success('保存图片成功');
                            },
                            fail: function (res) {
                                app.fail('保存图片失败');
                            }
                        });
                    } else {
                        app.fail('保存图片失败');
                    }
                }
            })
        } else {
            app.fail('保存图片失败');
        }
    },
    closeScore() {
        this.setData({
            isScore: 0
        });
    }

})