import regeneratorRuntime from '../../utils/regenerator-runtime';

//获取应用实例
const app = getApp()

Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onLoad () {
        app.loading('加载中...');
        if (app.globalData.userInfo) {
            this.judge();
        } else {
            app.userInfoReadyCallback = () => {
                this.judge();
            };
        }
    },
    judge () {
        app.hide();
        const userInfo = app.globalData.userInfo;
        if (userInfo.nickName) {
            this.goHome();
        }
    },
    async getUserInfo (e) {
        if (e.detail.errMsg == 'getUserInfo:ok') {
            const userInfo = e.detail.userInfo;
            app.globalData.userInfo.nickName = userInfo.nickName;
            app.globalData.userInfo.avatarUrl = userInfo.avatarUrl;
            await this.updateUser();
            this.goHome();
        } else {
            wx.faile('用户授权失败');
        }
    },
    goHome () {
        console.log('--goHome--');
        console.log(app.globalData.userInfo);
        wx.reLaunch({
            // url: '/pages/home/home' 
            url: '/pages/home/read/read?id=1' 
        })
    },
    async updateUser () {
        const ret = app.post('/user/update',{
            user: app.globalData.userInfo
        });
    }
})
