import regeneratorRuntime from '../../utils/regenerator-runtime';
const moment = require('../../utils/moment/moment');
moment.locale('zh-cn');
const _ = require('../../utils/underscore-min');
const app = getApp();

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
        year: moment().year(),
        month: moment().month() + 1,
        data: []
    },
    /**
     * 组件的方法列表
     */
    methods: {
        init () {
            this.setData({
                data: this.getData()
            })
        },
        setDate (year, month) {
            this.setData({
                year: year || this.data.year,
                month: month || this.data.month
            })
            this.setData({
                data: this.getData()
            })
        },
        setDays(days, year, month){
            this.setData({
                year: year || this.data.year,
                month: month || this.data.month
            })
            this.setData({
                data: this.getData(days)
            })
        },
        getData(days = []) {
          
            const current = this.getCurrentMonth();
            const year = current.year();
            const month = current.month();
            const week = current.weekday();
            const currentLastDay = current.daysInMonth();

            const todayYear = moment().year();
            const todayMonth = moment().month();
            const today = moment().date();

            
            const lastCurrent = current.subtract(1, 'month');
            const lastYear = lastCurrent.year();
            const lastMonth = lastCurrent.month();
            const lastMonthLastDay = lastCurrent.daysInMonth();

            const nextCurrent = lastCurrent.add(2,  'month');
            const nextYear = nextCurrent.year();
            const nextMonth = nextCurrent.month();
            
            
           
            let day = [];
            let nextDay = 1;
            let cday = 0;
            for (let i = 0; i < 6; i++) {
                for (let j = 0 ;j < 7 ;j++) {
                   
                    if(i ==0 && j < week){
                        day.push({
                            classer: "no",
                            year: lastYear,
                            month: lastMonth + 1,
                            day: lastMonthLastDay - week + 1 + j
                        });
                    }else{
                        cday = j - week + 1 + i * 7;
                        if (cday > currentLastDay){
                            day.push({
                                classer: "no",
                                year: nextYear,
                                month: nextMonth + 1,
                                day: nextDay++
                            });
                        }else {
                            day.push({
                                classer:"",
                                year: year,
                                month: month + 1,
                                day: cday,
                                today: (year == todayYear && month == todayMonth && cday == today)  ? "today" : ""
                            });
                        }
                    }
                    
                }
            }
            let ymd = '';
            let index = -1;
            day.forEach(item => {
                ymd = item.year + '-' + (item.month < 10 ? '0' + item.month : item.month) + '-' + (item.day < 10 ? '0' + item.day : item.day);
                index = _.findIndex(days, { date: ymd});
                if (index!=-1) {
                    if (days[index].continu){
                        item.classer += ' continu';
                        item.continu = true;
                    } else {
                        item.classer += ' punch';
                    }
                }
            });
            // let currentDay = {};
            // let preDay = today - 1;
            // for(let i = day.length-1; i >= 0; i--) {
            //     currentDay = day[i];
            //     if (currentDay.classer =='punch' ){
            //         if (currentDay.day == today) {
            //             currentDay.classer ='continu'
            //             preDay = currentDay.day - 1;
            //         } else if (currentDay.day == preDay) {
            //             currentDay.classer = 'continu'
            //             preDay = currentDay.day - 1;
            //         }
            //     }
            // }
            return day;
        },
        getCurrentMonth() {
            const month = this.data.month > 9 ? this.data.month : ('0' + this.data.month);
            return moment(`${this.data.year}-${month}-01`);
        },
        preMonth() {
            const last = this.getCurrentMonth().subtract(1, 'month');
            this.setDate(last.year(), last.month() + 1)
        },
        nextMonth() {
            const next = this.getCurrentMonth().add(1, 'month');
            this.setDate(next.year(), next.month() + 1)
        },
        _preMonth() {
            this.triggerEvent("preMonth");
        },
        _nextMonth() {
            this.triggerEvent("nextMonth");
        }
    }
})
