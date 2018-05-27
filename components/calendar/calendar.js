import regeneratorRuntime from '../../utils/regenerator-runtime';
const moment = require('../../utils/moment/moment');
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
        continuDays: 0,
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
            return this.data.continuDays;
        },
        getData(days = []) {
          
            const current = this.getCurrentMonth();
            const week = current.weekday();
            const today = moment().date();
            const currentLastDay = current.daysInMonth();
            const lastMonth = current.subtract(1, 'month');
            const lastMonthLastDay = lastMonth.daysInMonth();
            
           
            let day = [];
            let nextDay = 1;
            let cday = 0;
            for (let i = 0; i < 6; i++) {
                for (let j = 0 ;j < 7 ;j++) {
                   
                    if(i ==0 && j < week){
                        day.push({
                            classer: "no",
                            day: lastMonthLastDay - week + 1 + j
                        });
                    }else{
                        cday = j - week + 1 + i * 7;
                        if (cday > currentLastDay){
                            day.push({
                                classer: "no",
                                day: nextDay++
                            });
                        }else {
                            day.push({
                                day: cday,
                                classer: days.indexOf(cday)!=-1 ? "punch" : ''
                            });
                        }
                    }
                    
                }
                // data.push(day);
                // day = [];
            }
            let currentDay = {};
            let preDay = today - 1;
            let continuDays = 0;
            for(let i = day.length-1; i >= 0; i--) {
                currentDay = day[i];
                if (currentDay.classer =='punch' ){
                    if (currentDay.day == today) {
                        currentDay.classer ='continu continu-l'
                        preDay = currentDay.day - 1;
                        continuDays ++;
                    } else if (currentDay.day == preDay) {
                        currentDay.classer = 'continu'
                        preDay = currentDay.day - 1;
                        continuDays++;
                    }
                }
            }
            this.setData({
                continuDays: continuDays
            })
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
        }
    }
})
