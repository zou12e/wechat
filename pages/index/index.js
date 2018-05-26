import regeneratorRuntime from '../../utils/regenerator-runtime';

//获取应用实例
const app = getApp()

Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onLoad: function () {
        app.loading('加载中...');
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
        if (userInfo.nickName) {
            this.goHome();
        }
    },
    getUserInfo: function (e) {
        wx.success(e.detail.errMsg);
        if (e.detail.errMsg == 'getUserInfo:ok') {
            const userInfo = e.detail.userInfo;
            app.globalData.userInfo.nickName = userInfo.nickName
            app.globalData.userInfo.av9atarUrl = userInfo.avatarUrl
            this.goHome();
            // TODO updatUserinfo
        } else {
            wx.faile('用户授权失败');
        }
    },
    goHome: function () {
        console.log('--goHome--');
        console.log(app.globalData.userInfo);
        wx.reLaunch({
            // url: '/pages/home/home'
            url: '/pages/audio/audio?id=1'
        })
    }
})
