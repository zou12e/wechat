import regeneratorRuntime from '/utils/regenerator-runtime';

App({
    onLaunch: function () {
        wx.login({
            success: (res) => {
                if (res.code) {
                    this.login(res.code);
                } else {
                    this.fail(res.errMsg);
                }
            }
        });
        // this.login('code');
    },
    globalData: {
        userInfo: null,
        // host: 'http://192.168.4.248',
        host: 'http://127.0.0.1',
        // host: "http://192.168.1.106",
        // host: "https://www.zourunze.com",
        port: "4001",
        // port: "443",
        apiversion: '/wechat/api/v1',
    },
    uri: function () {
        if (this.globalData.port == '443' || this.globalData.port == '80'){
            return this.globalData.host + this.globalData.apiversion;
        }
        return `${this.globalData.host}:${this.globalData.port + this.globalData.apiversion}`;
    },
    retain: (num) => {
        num = "0" + parseInt(num);
        return num.length > 2 ? num.substring(1) : num;
    },
    api: function (fn, data, type) {

        const uri = this.uri(); 
        const user = this.globalData.userInfo || {};
        return new Promise( (resolve, reject) =>{
            wx.request({
                url: uri + fn,
                method: type || 'GET',
                header: {
                    "user-sessionkey": user.session_key || "",
                    "user-opeind": user.openid || "",
                    "user-id": user.id || 0
                },
                data: data,
                success:  (res) => {
                    resolve(res.data)
                },
                fail:  (res) => {
                    this.success(res.errMsg.split(":")[1],100000);
                    reject(res);
                },
            });
        })
    },
    get: function (fn, data){
        return this.api(fn, data);
    },
    post: function (fn, data) {
        return this.api(fn, data,'POST');
    },
    loading: function (msg = '提交中...', time = 10000){
        wx.showToast({
            title: msg,
            icon: 'loading',
            duration: time
        })
    },
    success: function (msg ='操作成功', time = 2000) {
        wx.showToast({
            title: msg,
            icon: 'success',
            duration: time
        })
    },
    fail: function (msg = '操作失败', time = 2000){
        wx.showToast({
            title: msg,
            icon: 'none',
            duration: time
        })
    },
    hide: () => {
        wx.hideToast();
    },
    login: async function (code) {
        const ret = await this.post('/user/login', {
            code: code
        }).catch((err) => {
            this.fail('登录失败');
        });

        if (ret && ret.code) {
            this.globalData.userInfo = ret.data;
            if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback()
            }
        }
    }
})