"use strict";

var config = {
    hostUrl: 'https://lenfincentr.ru',
    modalClass: 'modal',
    activeClass: 'is-active',
    modalTitle: 'Укажите Ваш телефон и наш сотрудник свяжется с Вами!'
};
var modalTitles = ['Укажите Ваш телефон и наш сотрудник свяжется с Вами!', 'Оставьте Ваш телефон и наш сотрудник свяжется с Вами для уточнения деталей'];
var user = {
    name: null,
    nubmer: null,
    email: null,
    editionInfo: null
};
var functions = {
    modalSuccessActivity: function modalSuccessActivity(operType) {
        var modal = document.getElementById('callback-success');

        if (arguments.length === 0) {
            var consistClass = modal.classList.contains(config.activeClass);

            if (consistClass) {
                modal.classList.remove(config.activeClass);
            } else {
                modal.classList.add(config.activeClass);
            }
        } else {
            switch (operType) {
                case 'open': {
                    if (!modal.classList.contains(config.activeClass)) modal.classList.add(config.activeClass);
                    break;
                }

                case 'close': {
                    modal.classList.remove(config.activeClass);
                    break;
                }
            }
        }
    },
    modalActivity: function modalActivity(operType) {
        var modal = document.getElementById('call-me');

        if (arguments.length === 0) {
            var consistClass = modal.classList.contains(config.activeClass);

            if (consistClass) {
                modal.classList.remove(config.activeClass);
            } else {
                modal.classList.add(config.activeClass);
            }
        } else {
            switch (operType) {
                case 'open': {
                    if (!modal.classList.contains(config.activeClass)) modal.classList.add(config.activeClass);
                    break;
                }

                case 'close': {
                    modal.classList.remove(config.activeClass);
                    break;
                }
            }
        }
    },
    requestCall: function requestCall() {
        config.modalTitle = modalTitles[0];
        user.editionInfo = null;
        var updateEvent = new Event('modal-update-title');
        document.getElementById('call-me').dispatchEvent(updateEvent);
        this.modalActivity('open');
    }
};
Vue.component('modal', {
    props: {
        initTitle: String
    },
    template: "\n   <div class=\"modal\" id=\"call-me\">\n      <div class=\"modal-background\"  @click=\"closeModal\"></div>\n      <div class=\"modal-card\">\n        <section class=\"modal-card-body\">\n          <p class=\"title\">{{title}}</p>\n          <div class=\"field\">\n            <div class=\"control\">\n              <input class=\"input\" type=\"text\" placeholder=\"\u0412\u0430\u0448\u0435 \u0438\u043C\u044F\"\n                @input=\"controlInput($event)\"/>\n            </div>\n            <div class=\"control\">\n              <input class=\"input\" type=\"tel\" placeholder=\"\u0412\u0430\u0448 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\" ref=\"phone\" id=\"userPhone\"/>\n            </div>\n            <div class=\"control\">\n              <a class=\"button is-info\" :disabled=\"submitDisabled\" @click=\"makeOrder($event)\" ref=\"button\">\n                \u041F\u0435\u0440\u0435\u0437\u0432\u043E\u043D\u0438\u0442\u0435 \u043C\u043D\u0435!\n              </a>\n            </div>\n          </div>\n        </section>\n      </div>\n      <button class=\"modal-close is-large\" aria-label=\"close\" @click=\"closeModal\"></button>\n    </div>",
    data: function data() {
        return {
            inputFieldNumber: null,
            userPhone: null,
            userName: null,
            title: this.initTitle
        };
    },
    computed: {
        submitDisabled: function submitDisabled() {
            if (this.$refs.button) if (this.$refs.button.classList.contains('is-loading')) {
                return true;
            }
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
        makeOrder: function makeOrder(event) {
            if(!event.target.classList.contains('is-loading') && !this.submitDisabled) {
                event.target.classList.add('is-loading');
                event.target.disabled = true;
                var body = {
                    html: "\n                <div><h3>\u041A\u043E\u043D\u0442\u0430\u043A\u0442:</h3>\n                <h4>\u0418\u043C\u044F: <span style=\"font-weight: normal\">".concat(this.userName, " </span></h4>\n                <h4>\u0422\u0435\u043B\u0435\u0444\u043E\u043D: <span style=\"font-weight: normal\">").concat(this.userPhone, "</span></h4>\n                </div>\n                    ").concat(user.editionInfo ? user.editionInfo : '', "\n             ")
                };
                axios.post(config.hostUrl + '/api/order/program', body).then(function () {
                    functions.modalActivity('close');
                    functions.modalSuccessActivity('open');
                    event.target.classList.remove('is-loading');
                    setTimeout(function () {
                        functions.modalSuccessActivity('close');
                    }, 3000);
                }).catch(function (err) {
                    event.target.classList.remove('is-loading');
                });
            }
        },
        closeModal: function closeModal() {
            functions.modalActivity('close');
        },
        controlInput: function controlInput(event) {
            $('#userPhone').mask('+7 (999) 999-99-99', {
                autoclear: false
            });
            event.target.value = event.target.value.replace(/[^ A-zА-яё]/g, '');
            this.userName = event.target.value;
        }
    },
    mounted: function mounted() {
        var _this = this;

        var contex = this;
        this.$el.addEventListener('modal-update-title', function () {
            contex.title = config.modalTitle;
        });
        this.inputFieldNumber = this.$refs.phone.value;
        var context = this;
        setInterval(function () {
            context.inputFieldNumber = _this.$refs.phone.value;
        }, 500);
    }
});
new Vue({
    el: '#modal'
});
var menu = new Vue({
    el: '#menu'
});
new Vue({
    el: '#navMenuApp',
    data: {
        region: '',
        city: '',
        menuActive: false
    },
    methods: {
        burger: function burger() {
            if (!this.menuActive) {
                this.$refs.burgerButton.classList.add(config.activeClass);
                menu.$refs.mainMenu.classList.remove('is-hidden-touch');
                menu.$refs.deepMenu.classList.add(config.activeClass);
            } else {
                this.$refs.burgerButton.classList.remove(config.activeClass);
                menu.$refs.mainMenu.classList.add('is-hidden-touch');
                menu.$refs.deepMenu.classList.remove(config.activeClass);
            }

            this.menuActive = !this.menuActive;
        }
    },
    mounted: function mounted() {
        var _this2 = this;

        axios.get(' https://api.sypexgeo.net/json/').then(function (res) {
            _this2.region = res.data.region.name_ru;
            _this2.city = res.data.city.name_ru;
        });
    }
});
new Vue({
    el: '#call-input',
    data: {
        userPhone: '',
        inputField: null,
        userName: null
    },
    computed: {
        requestButtonAvailable: function requestButtonAvailable() {
            if (this.inputField) {
                if (this.inputField.replace(/\D+/g, '').length >= 9) {
                    this.userPhone = this.inputField;
                    return true;
                }
            }

            if (this.$refs.button) if (this.$refs.button.classList.contains('is-loading')) {
                return false;
            }
            return false;
        }
    },
    methods: {
        callRequest: function callRequest() {
            var _this3 = this;

            this.$refs.button.classList.add('is-loading');
            var body = {
                user: {
                    name: this.userName,
                    phone: this.userPhone
                },
                html: "<div>\n                        <h3>\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435</h3>\n                        <h4>\n                            \u0418\u043C\u044F:  <span style=\"font-weight:normal\">\n                           ".concat(this.userName ? this.userName : 'Клиент', "\n                           </span>\n                        </h4>\n                        <h4>\n                            \u041D\u043E\u043C\u0435\u0440:  <span style=\"font-weight:normal\">\n                                    ").concat(this.userPhone, "\n                                    </span>\n                        </h4>\n                    </div>")
            };
            axios.post(config.hostUrl + '/api/order/phone', body).then(function (res) {
                functions.modalSuccessActivity('open');
                setTimeout(function () {
                    functions.modalSuccessActivity('close');
                }, 5000);

                _this3.$refs.button.classList.remove('is-loading');
            }).catch(function (err) {


                _this3.$refs.button.classList.remove('is-loading');
            });
        }
    },
    mounted: function mounted() {
        var context = this;
        setInterval(function () {
            context.inputField = context.$refs.number1.value;
        }, 500);
        $(document).ready(function () {
            $('#phone').mask('+7 (999) 999-99-99', { autoclear: false });
        });
    }
});
new Vue({
    el: '#addressTabs',
    data: {
        region: '',
        addressConfig: {
            moscow: {
                street: 'Москва, 1-я Тверская-Ямская улица, 24',
                phone: '8 (800) 555-93-84',
                time: {
                    mon: 'Понедельник-Пятница с 10:00 до 20:00',
                    sut: 'Суббота-Воскресенье с 10:00 до 18:00'
                }
            },
            spb: {
                street: 'Санк-Петербург, Новочеркасский проспект, дом 41/14',
                phone: '8 (800) 555-90-53',
                time: {
                    mon: 'Понедельник-Пятница с 10:00 до 20:00',
                    sut: 'Суббота-Воскресенье с 11:00 до 18:00'
                }
            }
        },
        address: {
            street: 'Москва, 1-я Тверская-Ямская улица, 24',
            phone: '8 (800) 555-93-84',
            time: {
                mon: 'Понедельник-Пятница с 10:00 до 20:00',
                sut: 'Суббота-Воскресенье с 10:00 до 18:00'
            }
        }
    },
    methods: {
        selectTab(index, event) {
            if (index === 0) {
                let _this = this;
                _this.$refs.spb.classList.remove('is-active');
                _this.$refs.msc.classList.add('is-active');
                _this.address = _this.addressConfig.moscow;
                document.getElementById('map2').setAttribute('style', 'display:none;');
                document.getElementById('map1').setAttribute('style', '');
            } else {
                let _this = this;
                _this.$refs.msc.classList.remove('is-active');
                _this.$refs.spb.classList.add('is-active');
                _this.address = _this.addressConfig.spb;
                document.getElementById('map1').setAttribute('style', 'display:none;');
                document.getElementById('map2').setAttribute('style', '');
            }
        }
    },
    mounted: function () {
        this.address = this.addressConfig.moscow;
        let _this3 = this;
        axios.get(' https://api.sypexgeo.net/json/').then(function (res) {
            _this3.region = res.data.region.name_ru;
            if (_this3.region === "Питер" || _this3.region === "Санкт-Петербург" || _this3.region === "Ленинградская область" || _this3.region === "Санкт Перербург") {
                _this3.selectTab(1);
            }
        });
    }
});

