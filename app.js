import regeneratorRuntime from '/utils/regenerator-runtime';

App({
    onLaunch () {
        wx.login({
            success: (res) => {
                if (res.code) {
                    this.login(res.code);
                } else {
                    this.fail(res.errMsg);
                }
            }
        });
    },
    globalData: {
        name: '趣朗读',
        userInfo: null,
        refresh: true,
        shareMsg: [
            "我已坚持在“趣朗读”打卡99天，免费邀请你来和我一起练就魅力好声音。",
            "最后100个名额，美化声音训练打卡软件免费体验。",
            "简单照做，普通人也能练免费就魅力好嗓音。",
            "微信语音不好听的人注意了，来“趣朗读”小程序打卡训练一周就能改善。",
            "普通话说不好的人注意了，来“趣朗读”小程序打卡训练一周就能改善。",
            "跟我一起“趣朗读”，改善乡音，自信讲话。",
            "邀请你加入“趣朗读”，坚持打卡为自己的声音整整容。"
        ],
        // host: 'http://192.168.4.94',
        // host: 'http://127.0.0.1',
        // host: "http://192.168.0.101",
        host: "https://www.wisdomwords.cn",
        // port: "4001",
        port: "443",
        apiversion: '/wechat/api/v1',
    },
    uri () {
        if (this.globalData.port == '443' || this.globalData.port == '80'){
            return this.globalData.host + this.globalData.apiversion;
        }
        return `${this.globalData.host}:${this.globalData.port + this.globalData.apiversion}`;
    },
    retain: (num) => {
        num = "0" + parseInt(num);
        return num.length > 2 ? num.substring(1) : num;
    },
    api (fn, data, type) {

        const uri = this.uri(); 
        const user = this.globalData.userInfo || {};
        return new Promise( (resolve, reject) =>{
            wx.request({
                url: uri + fn,
                method: type || 'GET',
                header: {
                    "Content-Type": "application/json;charset=UTF-8",
                    "user-sessionkey": user.session_key || "",
                    "user-openid": user.openid || "",
                    "user-id": user.id || 0
                },
                data: data,
                success:  (res) => {
                    resolve(res.data)
                },
                fail:  (res) => {
                     reject(res);
                },
            });
        })
    },
    get (fn, data){
        return this.api(fn, data);
    },
    post (fn, data) {
        return this.api(fn, data,'POST');
    },
    uploadFile(fn, filePath, data = {}) {
        const uri = this.uri();
        const user = this.globalData.userInfo || {};
        return new Promise((resolve, reject) => {
            wx.uploadFile({
                url: uri + fn,
                header: {
                    "Content-Type": "multipart/form-data",
                    "user-sessionkey": user.session_key || "",
                    "user-openid": user.openid || "",
                    "user-id": user.id || 0
                },
                filePath: filePath,
                name: 'file',
                formData: data ,
                success: (res) => {
                    try {
                        resolve(JSON.parse(res.data))
                    } catch (e){
                        reject(e);
                    }
                },
                fail: (res) => {
                    reject(res);
                },
            })
        })
    },
    loading (msg = '提交中...', time = 10000){
        wx.showToast({
            title: msg,
            icon: 'loading',
            duration: time
        })
    },
    success (msg ='操作成功', time = 2000) {
        wx.showToast({
            title: msg,
            icon: 'success',
            duration: time
        })
    },
    fail (msg = '操作失败', time = 2000){
        wx.showToast({
            title: msg,
            icon: 'none',
            duration: time
        })
    },
    hide: () => {
        wx.hideToast();
    },
    async login (code) {
        const ret = await this.post('/user/login', {
            code: code
        }).catch((err) => {
            this.fail('登录失败');
        });
        if (ret && ret.code) {
            this.globalData.userInfo = ret.data;
            const shareMsg = [
                "我是" + this.globalData.userInfo.nickName + "，我已坚持在“趣朗读”打卡" + (this.globalData.userInfo.days || 1) + "天，免费邀请你来和我一起练就魅力好声音。",
                "最后100个名额，美化声音训练打卡软件免费体验。",
                "简单照做，普通人也能练免费就魅力好嗓音。",
                "微信语音不好听的人注意了，来“趣朗读”小程序打卡训练一周就能改善。",
                "普通话说不好的人注意了，来“趣朗读”小程序打卡训练一周就能改善。",
                "我是" + this.globalData.userInfo.nickName + "，跟我一起“趣朗读”，改善乡音，自信讲话。",
                "我是" + this.globalData.userInfo.nickName + "，邀请你加入“趣朗读”，坚持打卡为自己的声音整整容。"
            ];
            this.globalData.shareMsg = shareMsg;
            if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback()
            } else {
                // 异常处理，过1秒在检查
                setTimeout(()=>{
                    if (this.userInfoReadyCallback) {
                        this.userInfoReadyCallback()
                    } 
                },1000)
            }
        } else {
            this.fail('no login');
        }
    }
})