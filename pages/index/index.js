//获取应用实例
const app = getApp()

Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onLoad: function () {
        app.loading();
        if (app.globalData.userInfo) {
            this.judge();
        } else {
            app.userInfoReadyCallback = () => {
                this.judge();
            };
        }
    },
    judge: function () {
        app.hide();
        const userInfo = app.globalData.userInfo;
        if (userInfo.nickName){
            this.goHome();
        }
    },
    getUserInfo: function (e) {
        if (e.detail.errMsg == 'getUserInfo:ok') {
            const userInfo = e.detail.userInfo;
            app.globalData.userInfo.nickName = userInfo.nickName
            app.globalData.userInfo.av9atarUrl = userInfo.avatarUrl
            console.log('--goHome--');
            this.goHome();
            // TODO updatUserinfo
        } else {
            wx.faile('用户授权失败');
        }
    },
    goHome: function () {
        wx.reLaunch({
            url: '/pages/home/home'
        })
    }
})
