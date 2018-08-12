import regeneratorRuntime from '../../utils/regenerator-runtime';
import qiniuUploader from '../../utils/qiniu/qiniuUploader';
const app = getApp();

Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        type: 0,  // 0：录制  1：停止录制  2：播放  3：暂停
        isCommit:false,
        time: 0,
        audioTime: 0,
        src: "",
        classer: ["begin", "stop", "play", "pause"],
    },

    /**
     * 组件的方法列表
     */
    methods: {
        init() {

            this.time = this.selectComponent("#time");
            this.recorderManager = wx.getRecorderManager()

            this.recorderManager.onStop((cfg) => {
                
                this.setData({
                    src: cfg.tempFilePath,
                    audioTime: this.data.time
                })
            })
        },
        fail() {
            app.fail('保存失败！');
            this.setData({
                isCommit: false
            });
        },
        go() {
            
            if (this.data.type == 0) { //点击录音

                const options = {
                    duration: 120000,
                    sampleRate: 44100,
                    numberOfChannels: 1,
                    encodeBitRate: 192000,
                    format: 'mp3',
                    frameSize: 50
                }
                this.recorderManager.start(options);

                this.setData({
                    type: 1,
                    time: 0
                })
                this.time.stom(this.data.time);
                this.cleartime = setInterval(() => {
                    this.setData({
                        time: ++this.data.time
                    })
                    this.time.stom(this.data.time);

                    if (this.data.time >= 120){
                        this.setData({
                            type: 2
                        })
                        clearInterval(this.cleartime);
                        this.recorderManager.stop();
                    }
                }, 1000)


            } else if (this.data.type == 1) {//点击停止
                if (this.data.time < 3 ) {
                    return ;
                }
                this.setData({
                    type: 2
                })
                clearInterval(this.cleartime);

                this.recorderManager.stop();

            } else if (this.data.type == 2 && this.data.src) {//点击播放
                this.setData({
                    type: 3
                });
                if (this.innerAudioContext) {
                    this.innerAudioContext.src = this.data.src;
                    this.innerAudioContext.play();
                    return;
                }
                this.innerAudioContext = wx.createInnerAudioContext();
                this.innerAudioContext.src = this.data.src;
                this.innerAudioContext.onPlay(() => {
                    console.log('开始播放')
                });
                this.innerAudioContext.onEnded(() => {
                    console.log('音频结束')
                    this.setData({
                        type: 2,
                        time: 0
                    });
                    this.time.stom(this.data.time);
                });
                this.innerAudioContext.onTimeUpdate(() => {
                    if (!this.innerAudioContext) {
                        return;
                    }
                    this.setData({
                        time: this.innerAudioContext.currentTime
                    });
                    this.time.stom(this.data.time);
                })
                this.innerAudioContext.play();
            } else if (this.data.type == 3) {//点击暂停
                this.innerAudioContext.pause();
                this.setData({
                    type: 2
                })
            }
        },
        rego() {
            if (this.innerAudioContext) {
                this.innerAudioContext.stop();
            }
            // this.innerAudioContext = null;
            this.setData({
                type: 0,
                time: 0,
                audioTime: 0,
                src: ''
            })
        },
        async _savego() {
            if (this.innerAudioContext) {
                this.innerAudioContext.stop();
            }
            if (this.data.isCommit) {
                app.loading();
                return ;
            }
            if (!this.data.isCommit && this.data.src) {
                this.setData({
                    isCommit: true,
                })
                app.loading();

                const ret = await app.get('/blog/getUploadToken');

                if (ret && ret.code === 1) {
                    const filePath = this.data.src;
                    const uptoken = ret.data;
                    const key = 'audio3/' + app.globalData.userInfo.id + '/' + new Date().getTime() + '.mp3';

                    qiniuUploader.upload(filePath, (res) => {
                        if (res && res.imageURL) {
                            this.setData({
                                src: res.imageURL
                            })
                            this.triggerEvent("savego");
                        } else {
                            app.fail('上传录音文件失败');
                            this.setData({
                                isCommit: false
                            });
                        }
                    }, (error) => {
                        app.fail('上传录音文件保存失败');
                        this.setData({
                            isCommit: false
                        });
                    }, {
                        region: 'SCN',
                        domain: 'https://audio.wisdomwords.cn', 
                        key, 
                        uptoken: uptoken, 
                    }, (res) => {});
                } else {
                    app.fail('获取上传凭证失败');
                }
            } else {
                app.fail('录音失败，请检查是否授权“趣朗读”录音功能');
            }
        }
    }
})
