import regeneratorRuntime from '../../utils/regenerator-runtime';
const app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        type: {            
            type: String,     
            value: 'all'  
        },
    },
    /**
     * 组件的初始数据
     */
    data: {
        data: [],
        last: -1
    },

    /**
     * 组件的方法列表
     */
    methods: {
        setList:function(data){
            this.setData({
                data:data
            })
        },
        play: function (event) {

            const index = event.currentTarget.dataset.index;
            const blog = this.data.data[index];

            blog.isPlay = !blog.isPlay;

            if (!blog.audio) {
                blog.audio = wx.createInnerAudioContext();
                blog.audio.src = blog.url;
                blog.audio.onPlay(() => {
                    console.log('开始播放')
                })
                blog.audio.onEnded(() => {
                    console.log('音频结束');
                    this.data.data[this.data.last].isPlay = false;
                    this.setData({
                        data: this.data.data
                    });
                });
            }

            

            if (this.data.last != -1  && this.data.last != index) {
                const lastBlog = this.data.data[this.data.last];
                if (lastBlog.isPlay){
                    lastBlog.isPlay = false;
                    lastBlog.audio.pause();
                }
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
        stop() {
            if (this.data.last != -1) {
                const lastBlog = this.data.data[this.data.last];
                if (lastBlog.isPlay) {
                    lastBlog.isPlay = false;
                    lastBlog.audio.pause();
                    this.setData({data: this.data.data});
                }
            }
        },
        goFollow: async function (event) {
            const index = event.currentTarget.dataset.index;
            const blog = this.data.data[index];
            app.loading();
            const ret = await app.post('/user/follow', { id: blog.userId });
            app.hide();
            if (ret && ret.code === 1) {
                blog.isFollow = !blog.isFollow;
                this.setData({
                    data: this.data.data,
                });
                app.success();
            } else {
                app.fail();
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
            const ret = await app.post('/blog/collection', { id: blog.id });
            app.hide();
            if (ret && ret.code === 1) {
                blog.isCollection = !blog.isCollection;
                this.setData({
                    data: this.data.data,
                });
                app.success();
            } else {
                app.fail();
            }
        },
        goThumb: async function (event) {
            const index = event.currentTarget.dataset.index;
            const blog = this.data.data[index];
            app.loading();
            const ret = await app.post('/blog/thumb', { id: blog.id });
            app.hide();
            if (ret && ret.code === 1) {
                blog.isThumb = !blog.isThumb;
                blog.thumbs = parseInt(blog.thumbs) + (blog.isThumb ? 1 : -1);
                this.setData({
                    data: this.data.data,
                });
                app.success();
            } else {
                app.fail();
            }
        }
    }
})
