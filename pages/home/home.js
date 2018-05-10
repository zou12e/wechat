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
      isMorning: true
      
  },

  /**
   * 组件的方法列表
   */
  methods: {

    toMorning(event) {

        this.setData({
            isMorning: true
        })

      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: "#FFB307"
      })

      wx.setTabBarStyle({
          backgroundColor: '#fff',
      })

      wx.setTabBarBadge({
          index: 1,
          text: '1'
      })

    },
    toNight(event) {

        this.setData({
            isMorning: false
        })

      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: "#00132A"
      })

      wx.setTabBarStyle({
          backgroundColor: '#fff',
      })
    }
  },
  
})
