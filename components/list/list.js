import regeneratorRuntime from '../../utils/regenerator-runtime';
import _ from '../../utils/underscore-min';
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
        userInfo: {},
        isLoad: true,
        data: [],
        count: 0,
        lastId: 0,
        last: -1
    },

    /**
     * 组件的方法列表
     */
    methods: {
        async setList (url, param, reload ){
            if (reload){
                wx.pageScrollTo({
                    scrollTop: 0
                })
            }
            if (this.data.lastId == -1 && !reload)
                return ;
            this.setData({
                isLoad: true
            });
            _.extend(param, { lastId: reload ? 0 : this.data.lastId});
            const ret =await app.get(url, param);
            if(ret && ret.code ===1 ) {
                let _data = this.data.data;
                const data = ret.data.list;
                if (reload) {
                    _data = data;
                } else {
                    _data =  _data.concat(data);
                }
                
                this.setData({
                    userInfo: app.globalData.userInfo,
                    data: _data,
                    count: ret.data.count,
                    lastId: data && data.length ? data[data.length-1].id : -1,
                    isLoad:false,
                })

            }
            
        },
        play (event) {

            const index = event.currentTarget.dataset.index;
            const blog = this.data.data[index];

            blog.isPlay = !blog.isPlay;

            if (!blog.audio) {
                blog.audio = wx.createInnerAudioContext();
                blog.audio.src = blog.url;
                blog.audio.onPlay(() => {
                    console.log('开始播放')
                    app.hide();
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
                app.loading('加载中...');
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
        async goFollow  (event) {
            const index = event.currentTarget.dataset.index;
            const blog = this.data.data[index];
            app.loading();
            const ret = await app.post('/user/follow', { id: blog.userId });
            app.hide();
            if (ret && ret.code === 1) {

                this.data.data.forEach((item) => {
                    if (item.userId === blog.userId){
                        item.isFollow = !item.isFollow;
                    }
                })
                this.setData({
                    data: this.data.data,
                });
                app.success();
            } else {
                app.fail();
            }
        },
        goForward (event) {
            const index = event.currentTarget.dataset.index;
            const blog = this.data.data[index];
            app.success('转发成功');
        },
        async goCollection (event) {
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
        async goThumb (event) {
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
        },
        onReachBottom() {

            
        }
    }
})
