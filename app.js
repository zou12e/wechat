App({
    onLaunch: function () {
        wx.login({
            success: (res) => {
                if (res.code) {
                    this.login(res.code);
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        });
    },
    globalData: {
        userInfo: null,
        host: 'http://192.168.4.248',
        port: "4001",
        apiversion: '/wechat/api/v1',
    },
    uri: function () {
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
                    "user-sessionkey": user.session_key,
                    "user-opeind": user.openid
                },
                data: data,
                success: function (res) {
                    resolve(res.data)
                },
                fail: function (res) {
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
    login: async function (code) {
        const ret = await this.post('/user/login', {
            code: code
        }).catch(function(err){
            console.log(err);
        });
        if(ret && ret.code){
            this.globalData.userInfo = ret.data;
            if (this.userInfoReadyCallback) {
                 this.userInfoReadyCallback()
            }
        }
    }
})