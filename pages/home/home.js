// pages/home/home.js
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

  },

  /**
   * 组件的方法列表
   */
  methods: {

    toMorning(event) {

      console.log(getApp().host());

      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: "#FFB307"
      })

      

    },
    toNight(event) {

      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: "#ff0000"
      })
    }
  },
  
})
