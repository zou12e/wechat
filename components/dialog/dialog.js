// component/dialog/dialog.js
Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        isShow: false,
        showData: {
            title: "",
            author: "",
            content: ""
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        togglerShow: function (cfg){
            cfg = cfg || this.data.showData,
            this.setData({
                isShow: !this.data.isShow,
                showData: cfg
            });
        }
    }
})
