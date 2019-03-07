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

Vue.component('inputFieldSelect', {
    props: {
        label: String,
        options: Array
    },
    template: `
    <div class="field">
                <label class="label">{{label}}</label>
                <div class="control">
                  <div class="select">
                    <select ref="selector" @change="$emit('value-changed', $event.target.value)">
                      <option v-for="option in options">
                      {{option}}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
    `,
    mounted: function () {
        this.$refs.selector.value = this.options[0];
    }
});

Vue.component('inputFieldText', {
    props: {
        label: String,
        units: String,
        max: Number,
        min: Number,
        val: Number,
        sliderMult: Number
    },
    template: `
    <div class="field">
                <label class="label">{{label}}</label>
                <label class="label" style="color:red" v-if="errorMessage">{{errorMessageText}}</label>
                <p class="control">
                  <input
                    class="input"
                    type="summ"
                    value="100 000"
                    :min="min"
                    :max="max"
                    placeholder="Введите сумму сбережений"
                    @input="input($event)"
                    ref="numInputField"
                  />
                  <span class="active-placeholder">
                    {{units}}                    
                  </span>
                  <input
                    class="slider"
                    type="range"
                    :min="min/sliderMult"
                    :max="max/sliderMult"
                    @input="inputSlider($event)"
                    :value="value/sliderMult"
                  />
                </p>
              </div>
    `,
    data: function () {
        return {
            errorMessage: false,
            errorMessageText: `Значение должно находиться в пределах между ${this.min.toLocaleString()} и ${this.max.toLocaleString()} ${this.units}`,
            value: this.val
        }
    },
    watch: {
        value: function (newValue) {
            this.$emit('value-changed', newValue);
        }
    },
    methods: {
        input(event) {
            let number = event.target.value.replace(/[^0-9]/g, '');
            number = +number;
            if (number < this.min || number > this.max) {
                this.errorMessage = true;
            } else {
                this.errorMessage = false;
            }
            this.value = number;
            event.target.value = number.toLocaleString();
        },
        inputSlider(event) {
            this.value = event.target.value * this.sliderMult;
            this.$refs.numInputField.value = this.value.toLocaleString();
        }
    },
    mounted: function () {
        this.$refs.numInputField.value = this.value;
    }
});

new Vue({
    el: '#bank',
    data: {
        savings: 100000,
        savingsPerMonth: 0,
        period: 12,
        procentType: 'Ежемесячно'
    },
    computed: {
        result: function () {
            let result = 0;
            switch (this.procentType) {
                case 'Ежемесячно': {
                    if (this.savingsPerMonth === 0) {
                       result = 0;
                        result = (+this.savings * (1 + 0.1395 * +this.period / 12)).toFixed(0);
                        this.income = (result - this.savings).toFixed(0);
                    } else {
                        result = 0;
                        let savings = +this.savings;
                        for (let i = 0; i <= +this.period; i++) {
                            if (i === 0) {
                                result += savings * (1 + 0.1395 / 12);
                            } else {
                                savings += +this.savingsPerMonth;
                                result += savings * (1 + 0.1395 / 12);
                            }
                        }
                    }
                    break;
                }
                case 'В конце срока с капитализацией': {
                    if (this.savingsPerMonth === 0) {
                        result = 0;
                        result = (+this.savings * Math.pow((1 + 0.1395 / 12), +this.period)).toFixed(0);
                        this.income = (result - this.savings).toFixed(0);
                    } else {
                        result = (+this.savingsPerMonth * (Math.pow(1 + 0.1395 / 12, +this.period / 12 * 12) - 1) * 12 / 0.1395).toFixed(0);
                    }
                    break;
                }
            }
            return +result;
        },
        income: function () {
            return this.result - this.savings;
        }
    },
    methods: {
        culcResult() {
            switch (this.procentType) {
                case 'Ежемесячно': {
                    if (this.savingsPerMonth === 0) {
                        this.result = 0;
                        this.result = (+this.savings * (1 + 0.1395 * +this.period / 12)).toFixed(0);
                        this.income = (this.result - this.savings).toFixed(0);
                    } else {
                        this.result = 0;
                        let savings = +this.savings;
                        for (let i = 0; i <= +this.period; i++) {
                            if (i === 0) {
                                this.result += savings * (1 + 0.1395 / 12);
                            } else {
                                savings += +this.savingsPerMonth;
                                this.result += savings * (1 + 0.1395 / 12);
                            }
                        }
                        ;
                        this.income = (+this.result - savings).toFixed(0);
                    }
                    break;
                }
                case 'В конце срока с капитализацией': {
                    if (this.savingsPerMonth === 0) {
                        this.result = 0;
                        this.result = (+this.savings * Math.pow((1 + 0.1395 / 12), +this.period)).toFixed(0);
                        this.income = (this.result - this.savings).toFixed(0);
                    } else {
                        this.result = (+this.savingsPerMonth * (Math.pow(1 + 0.1395 / 12, +this.period / 12 * 12) - 1) * 12 / 0.1395).toFixed(0);
                        this.income = (this.result - +this.savings).toFixed(0);
                    }
                    break;
                }
            }
        }
    }
});
