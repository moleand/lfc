'use strict';
const config = {
    hostUrl: 'http://localhost',
    modalClass: 'modal',
    activeClass: 'is-active',
    modalTitle: 'Укажите Ваш телефон и наш сотрудник свяжется с Вами!'
};

const modalTitles = ['Укажите Ваш телефон и наш сотрудник свяжется с Вами!',
    'Оставьте Ваш телефон и наш сотрудник свяжется с Вами для уточнения деталей'];

const programTypes = {
    pens: 'Пенсионная',
    nakop: 'Накопительная',
    invest: 'Инвестиционная'
};

let user = {
    name: null,
    nubmer: null,
    email: null,
    editionInfo: null
};

const functions = {
    modalSuccessActivity: function (operType) {
        let modal = document.getElementById('callback-success');
        if (arguments.length === 0) {
            let consistClass = modal.classList.contains(config.activeClass);
            if (consistClass) {
                modal.classList.remove(config.activeClass);
            } else {
                modal.classList.add(config.activeClass);
            }
        } else {
            switch (operType) {
                case 'open': {
                    if (!modal.classList.contains(config.activeClass))
                        modal.classList.add(config.activeClass);
                    break;
                }
                case 'close': {
                    modal.classList.remove(config.activeClass);
                    break;
                }
            }
        }
    },
    modalActivity: function (operType) {
        let modal = document.getElementById('call-me');
        if (arguments.length === 0) {
            let consistClass = modal.classList.contains(config.activeClass);
            if (consistClass) {
                modal.classList.remove(config.activeClass);
            } else {
                modal.classList.add(config.activeClass);
            }
        } else {
            switch (operType) {
                case 'open': {
                    if (!modal.classList.contains(config.activeClass))
                        modal.classList.add(config.activeClass);
                    break;
                }
                case 'close': {
                    modal.classList.remove(config.activeClass);
                    break;
                }
            }
        }
    },
    requestCall: function () {
        config.modalTitle = modalTitles[0];
        user.editionInfo = null;
        let updateEvent = new Event('modal-update-title');
        document.getElementById('call-me').dispatchEvent(updateEvent);
        this.modalActivity('open');
    }
};

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
Vue.component('modal', {
    props: {
        initTitle: String
    },
    template: `
   <div class="modal" id="call-me">
      <div class="modal-background"  @click="closeModal"></div>
      <div class="modal-card">
        <section class="modal-card-body">
          <p class="title">{{title}}</p>
          <div class="field">
            <div class="control">
              <input class="input" type="text" placeholder="Ваше имя"
                @input="controlInput($event)"/>
            </div>
            <div class="control">
              <input class="input" type="text" placeholder="Ваш телефон" ref="phone" id="userPhone"/>
            </div>
            <div class="control">
              <a class="button is-info" :disabled="submitDisabled" @click="makeOrder">
                Перезвоните мне!
              </a>
            </div>
          </div>
        </section>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="closeModal"></button>
    </div>`,
    data: function () {
        return {
            inputFieldNumber: null,
            userPhone: null,
            userName: null,
            title: this.initTitle
        }
    },
    computed: {
        submitDisabled() {
            if (this.inputFieldNumber) {
                if (this.inputFieldNumber.replace(/\D+/g, '').length === 11 && this.userName.length > 1) {
                    this.userPhone = this.inputFieldNumber;
                    return false;
                }
            }
            return true;
        }
    },
    methods: {
        makeOrder() {
            let body = {
                html: `
                Контакт:
                Имя: ${this.userName}
                Телефон: ${this.userPhone}
                    ${ user.editionInfo ? 'Выбранная программа - ' + user.editionInfo : ''}
             `
            }
            axios.post(config.hostUrl + '/api/order/program', body)
                .then(() => {
                    functions.modalActivity('close');
                    functions.modalSuccessActivity('open');

                    setTimeout(() => {
                        functions.modalSuccessActivity('close');
                    }, 3000);
                })
                .catch(err => {

                })
        },
        closeModal() {
            functions.modalActivity('close');
        },
        controlInput(event) {
            $('#userPhone').mask('+7 (999) 999-99-99', {autoclear: false});
            event.target.value = event.target.value.replace(/[^ A-zА-яё]/g, '');
            this.userName = event.target.value;
        }
    },
    mounted: function () {
        let contex = this;
        this.$el.addEventListener('modal-update-title', function () {
            contex.title = config.modalTitle;
        });
        this.inputFieldNumber = this.$refs.phone.value;
        let context = this;
        setInterval(() => {
            context.inputFieldNumber = this.$refs.phone.value;
        }, 500);
    }
});
Vue.component('button-choose-program', {
    props: {
        callbackText: String
    },
    template: `
     <button class="button is-fullwidth" @click="requestCallback">Оставить заявку</button>
    `,
    methods: {
        requestCallback() {
            user.editionInfo = this.callbackText;
            config.modalTitle = modalTitles[1];
            let updateEvent = new Event('modal-update-title');
            document.getElementById('call-me').dispatchEvent(updateEvent);
            functions.modalActivity('open');
        }
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
                        let percent = 0.1395;
                        let savings = +this.savings;
                        for (let i = 0; i < this.period; i++) {
                            let addition = this.savingsPerMonth;
                            if (i === 0) {
                                result += savings * (1 + percent / 12);
                            } else {
                                savings += addition;
                                result += savings * percent / 12 + addition;
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
            result = parseInt(result).toFixed(0);
            return +result;
        },
        income: function () {
            return this.result - this.savings - this.savingsPerMonth * (this.period - 1);
        }
    },
    methods: {}
});
new Vue({
    el: '#call-input',
    data: {
        userPhone: '',
        inputField: null,
        userName: null
    },
    computed: {
        requestButtonAvailable() {
            if (this.inputField) {
                if (this.inputField.replace(/\D+/g, '').length === 11) {
                    this.userPhone = this.inputField;
                    return true;
                }
            }
            return false;
        }
    },
    methods: {
        callRequest() {
            let body = {
                user: {
                    name: this.userName,
                    phone: this.userPhone
                },
                html:
                    `<div>
                        <h3>Контактные данные</h3>
                        <h4>
                            Имя:  <span style="font-weight:normal">
                           ${ this.userName ? this.userName : 'Клиент'}
                           </span>
                        </h4>
                        <h4>
                            Номер:  <span style="font-weight:normal">
                                    ${ this.userPhone  }
                                    </span>
                        </h4>
                    </div>`
            };
            axios.post(config.hostUrl + '/api/order/phone', body)
                .then(res => {
                    functions.modalSuccessActivity('open');
                    setTimeout(() => {
                        functions.modalSuccessActivity('close');
                    }, 5000);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    },
    mounted: function () {
        let context = this;
        setInterval(() => {
            context.inputField = context.$refs.number1.value
        }, 500);
    }
});
new Vue({
    el: '#callback-success',
    methods: {
        closeModal() {
            functions.modalSuccessActivity('close');
        }
    }
});
new Vue({
    el: '#modal'
});
new Vue({
    el: '#savings'
});

