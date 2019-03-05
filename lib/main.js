'use strict';

new Vue({
   el: '#app',
   data: {
      region: '',
       city: ''
   },
    mounted: function () {
      axios.get(' http://api.sypexgeo.net/json/')
          .then(res => {
             console.log(res);
             this.region = res.data.region.name_ru;
             this.city = res.data.city.name_ru;
          })
    }
});

new Vue({
    el: '#bank',
    data: {
        savings: 100000,
        savingsPerMonth: 0,
        period: 12,
        procentType: 'Ежемесячно',
        result: 0,
        income: 0
    },
    methods:{
        culcSavings(val){
            this.savings = val.target.value*10000;
            this.culcResult();
        },
        culcSavingsPerMonth(val){
            this.savingsPerMonth = val.target.value*10000;
            this.culcResult();
        },
        periodFunc(val){
            this.period = val.target.value;
            this.culcResult();
        },
        culcResult(){
            switch (this.procentType) {
                case 'Ежемесячно':{
                    if(this.savingsPerMonth === 0) {
                        this.result = 0;
                        this.result = (+this.savings * (1 + 0.1395 * +this.period / 12)).toFixed(0);
                        this.income = (this.result - this.savings).toFixed(0);
                    } else {
                        this.result = 0;
                        let savings = +this.savings;
                        for (let i = 0; i <= +this.period; i++) {
                            if (i === 0) {
                                this.result += savings *(1+0.1395 / 12);
                            } else {
                                savings += +this.savingsPerMonth;
                                this.result += savings * (1+0.1395 / 12);
                            }
                        };
                        this.income = (+this.result - savings).toFixed(0);
                    }
                    break;
                }
                case 'В конце срока с капитализацией':{
                    if(this.savingsPerMonth === 0) {
                        this.result = 0;
                        this.result = (+this.savings * Math.pow((1 + 0.1395 / 12), +this.period)).toFixed(0);
                        this.income = (this.result - this.savings).toFixed(0);
                    } else {
                        this.result = (+this.savingsPerMonth * (Math.pow(1+0.1395/12, +this.period/12*12) -1)*12/0.1395).toFixed(0);
                        this.income = (this.result - +this.savings).toFixed(0);
                    }
                    break;
                }
            }
        }
    }
});
