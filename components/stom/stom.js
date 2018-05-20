// components/s2m/s2m.js
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
        data: ''
    },

    /**
     * 组件的方法列表
     */
    methods: {
        stom: function (second) {

            
            this.setData({
                data: getApp().retain(second > 59 ? second / 60 : "00") + ":" + getApp().retain(second > 59 ? second % 60 : second)
            });
        }
    }
})
