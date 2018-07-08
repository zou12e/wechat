import regeneratorRuntime from '../../utils/regenerator-runtime';
import _ from '../../utils/underscore-min';

//获取应用实例
const app = getApp()

Page({
    data: {
        load: true,
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
        } else {
            this.setData({
                load: false
            })
        }
    },
    async getUserInfo (e) {
        if (e.detail.errMsg == 'getUserInfo:ok') {
            const userInfo = e.detail.userInfo;

            _.extend(app.globalData.userInfo, userInfo);
           
            await this.updateUser();
            
        } else {
            app.fail('用户授权失败');
        }
    },
    goHome () {
        console.log('--goHome--');
        console.log(app.globalData.userInfo);
        wx.reLaunch({
            url: '/pages/home/home' 
        })
    },
    async updateUser () {
        const ret = await app.post('/user/update',{
            user: app.globalData.userInfo
        });
        if(ret && ret.code ==1){
            this.goHome();
        } else {
            app.fail('用户授权失败');
        }
    }
})
