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
        isMsg: false,
        showData: {
            title: "",
            author: "",
            content: ""
        },
        msgData: {
            placeholder: "",
            value:"",
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        togglerShow (cfg){
            cfg = cfg || this.data.showData,
            this.setData({
                isShow: !this.data.isShow,
                showData: cfg
            });
        },
        togglerMsg (cfg) {
            cfg = cfg || this.data.msgData,
                this.setData({
                    isMsg: !this.data.isMsg,
                    msgData: cfg
                });
        },
        bindMsg (e){
            var msgData = this.data.msgData;
            msgData.value = e.detail.value;
            this.setData({
                msgData: msgData
            })

        },
        _confirmMsgEvent() {

            this.triggerEvent("confirmMsgEvent")
        }
    }
})
