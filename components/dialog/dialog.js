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
        isConfirm: false,
        isImage: false,
        showData: {
            title: "",
            author: "",
            content: ""
        },
        msgData: {
            placeholder: "",
            value:"",
        },
        confirmData: {
            id: 0,
            title: "温馨提示",
            content: "确定操作？",
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
        togglerConfirm(cfg) {
            cfg = cfg || this.data.confirmData,
                this.setData({
                     isConfirm: !this.data.isConfirm,
                     confirmData: cfg
                });
        },
        togglerImage() {
                this.setData({
                    isImage: !this.data.isImage
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
        },
        _cancelEvent() {
            this.togglerConfirm();
        },
        _confirmEvent() {

            this.triggerEvent("confirmEvent")
        }
    }
})
