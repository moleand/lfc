'use strict';

var config = {
  hostUrl: 'https://lenfincentr.ru',
  modalClass: 'modal',
  activeClass: 'is-active',
  modalTitle: 'Укажите Ваш телефон и наш сотрудник свяжется с Вами!'
};
var modalTitles = ['Укажите Ваш телефон и наш сотрудник свяжется с Вами!', 'Оставьте Ваш телефон и наш сотрудник свяжется с Вами для уточнения деталей'];
var programTypes = {
  pens: 'Пенсионная',
  nakop: 'Накопительная',
  invest: 'Инвестиционная'
};
var user = {
  name: null,
  number: null,
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
        case 'open':
          {
            if (!modal.classList.contains(config.activeClass)) modal.classList.add(config.activeClass);
            break;
          }

        case 'close':
          {
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
        case 'open':
          {
            if (!modal.classList.contains(config.activeClass)) modal.classList.add(config.activeClass);
            break;
          }

        case 'close':
          {
            modal.classList.remove(config.activeClass);
            break;
          }
      }
    }
  },
  chooseBankParam: function chooseBankParam(userInfo) {
    user.editionInfo = userInfo;
    config.modalTitle = modalTitles[1];
    var updateEvent = new Event('modal-update-title');
    document.getElementById('call-me').dispatchEvent(updateEvent);
    this.modalActivity('open');
  },
  requestCall: function requestCall() {
    config.modalTitle = modalTitles[0];
    user.editionInfo = null;
    var updateEvent = new Event('modal-update-title');
    document.getElementById('call-me').dispatchEvent(updateEvent);
    this.modalActivity('open');
  }
};
Vue.component('inputFieldSelect', {
  props: {
    label: String,
    options: Array
  },
  template: "\n    <div class=\"field\">\n                <label class=\"label\">{{label}}</label>\n                <div class=\"control\">\n                  <div class=\"select\">\n                    <select ref=\"selector\" @change=\"$emit('value-changed', $event.target.value)\">\n                      <option v-for=\"option in options\">\n                      {{option}}\n                      </option>\n                    </select>\n                  </div>\n                </div>\n              </div>\n    ",
  mounted: function mounted() {
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
    sliderMult: Number,
    unitsError: Number
  },
  template: "\n    <div class=\"field\" style=\"position: relative\">\n                <label class=\"label\">{{label}}</label>\n                \n                <p class=\"control\">\n                  <input\n                    class=\"input\"\n                    type=\"tel\"\n                    value=\"100 000\"\n                    :min=\"min\"\n                    :max=\"max\"\n                    placeholder=\"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0441\u0443\u043C\u043C\u0443 \u0441\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u0438\u0439\"\n                    @input=\"input($event)\"\n                    ref=\"numInputField\"\n                  />\n                  <span class=\"active-placeholder\">\n                    {{units}}                    \n                  </span>\n                  <input\n                    class=\"slider\"\n                    type=\"range\"\n                    :min=\"min/sliderMult\"\n                    :max=\"max/sliderMult\"\n                    @input=\"inputSlider($event)\"\n                    :value=\"value/sliderMult\"\n                  />\n                </p>\n                <label class=\"label\" style=\"color: #F04539; font-size: 12px; font-weight: 400; text-transform: none; margin-top: 24px; position: absolute; width: 100%;\" v-if=\"errorMessage\">{{errorMessageText}}</label>\n              </div>\n    ",
  data: function data() {
    return {
      errorMessage: false,
      errorMessageText: "\u0417\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u043D\u0430\u0445\u043E\u0434\u0438\u0442\u044C\u0441\u044F \u0432 \u043F\u0440\u0435\u0434\u0435\u043B\u0430\u0445 \u043C\u0435\u0436\u0434\u0443 ".concat(this.min.toLocaleString(), " \u0438 ").concat(this.max.toLocaleString(), " ").concat(this.unitsError),
      value: this.val
    };
  },
  watch: {
    value: function value(newValue) {
      this.$emit('value-changed', newValue);
    }
  },
  methods: {
    input: function input(event) {
      var previous = this.value;
      var number = event.target.value.replace(/[^0-9]/g, '');
      number = +number;

      if (number < this.min || number > this.max) {
        this.errorMessage = true;
        event.target.value = number.toLocaleString();
      } else {
        this.value = number;
        event.target.value = number.toLocaleString();
        this.errorMessage = false;
      }
    },
    inputSlider: function inputSlider(event) {
      this.value = event.target.value * this.sliderMult;
      this.$refs.numInputField.value = this.value.toLocaleString();
    }
  },
  mounted: function mounted() {
    this.$refs.numInputField.value = this.value.toLocaleString();
  }
});
Vue.component('modal', {
  props: {
    initTitle: String
  },
  template: "\n   <div class=\"modal\" id=\"call-me\">\n      <div class=\"modal-background\"  @click=\"closeModal\"></div>\n      <div class=\"modal-card\">\n        <section class=\"modal-card-body\">\n          <p class=\"title\">{{title}}</p>\n          <div class=\"field\">\n            <div class=\"control\">\n              <input class=\"input\" type=\"text\" placeholder=\"\u0412\u0430\u0448\u0435 \u0438\u043C\u044F\"\n                @input=\"controlInput($event)\"/>\n            </div>\n            <div class=\"control\">\n              <input class=\"input\" type=\"text\" placeholder=\"\u0412\u0430\u0448 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\" ref=\"phone\" id=\"userPhone\"/>\n            </div>\n            <div class=\"control\">\n              <a class=\"button is-info\" :disabled=\"submitDisabled\" @click=\"makeOrder($event)\" ref=\"button\">\n                \u041F\u0435\u0440\u0435\u0437\u0432\u043E\u043D\u0438\u0442\u0435 \u043C\u043D\u0435!\n              </a>\n            </div>\n          </div>\n        </section>\n      </div>\n      <button class=\"modal-close is-large\" aria-label=\"close\" @click=\"closeModal\"></button>\n    </div>",
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
      if (this.inputFieldNumber) {
        if (this.inputFieldNumber.replace(/\D+/g, '').length === 11 && this.userName.length > 1) {
          this.userPhone = this.inputFieldNumber;
          return false;
        }
      }

      if (this.$refs.button) if (this.$refs.button.classList.contains('is-loading')) {
        return false;
      }
      return true;
    }
  },
  methods: {
    makeOrder: function makeOrder(event) {
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
Vue.component('button-choose-program', {
  props: {
    callbackText: String
  },
  template: "\n     <button class=\"button is-fullwidth\" @click=\"requestCallback\">\u041E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u044F\u0432\u043A\u0443</button>\n    ",
  methods: {
    requestCallback: function requestCallback() {
      user.editionInfo = "<div> <h3>\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0438\u043B\u0441\u044F \u0441 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u043E\u0439 \u0432\u043A\u043B\u0430\u0434\u0430</h3> <h4>\u0412\u044B\u0431\u0440\u0430\u043D\u043D\u0430\u044F \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0430 -  <span style=\"font-weight: normal\">".concat(this.callbackText, "</span> </h4></div>");
      config.modalTitle = modalTitles[1];
      var updateEvent = new Event('modal-update-title');
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
    result: function result() {
      var result = 0;

      switch (this.procentType) {
        case 'Ежемесячно':
          {
            if (this.savingsPerMonth === 0) {
              result = 0;
              result = (+this.savings * (1 + 0.1395 * +this.period / 12)).toFixed(0);
              this.income = (result - this.savings).toFixed(0);
            } else {
              var percent = 0.1395;
              var savings = +this.savings;

              for (var i = 0; i < this.period; i++) {
                var addition = this.savingsPerMonth;

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

        case 'В конце срока с капитализацией':
          {
            if (this.savingsPerMonth === 0) {
              result = 0;
              result = (+this.savings * Math.pow(1 + 0.1395 / 12, +this.period)).toFixed(0);
              this.income = (result - this.savings).toFixed(0);
            } else {
              var _savings = this.savings;
              var _percent = 0.1395;
              var period = this.period;

              for (var _i = 0; _i < period; _i++) {
                var _addition = this.savingsPerMonth;

                if (_i === 0) {
                  result += _savings * (1 + _percent / 12);
                } else {
                  _savings = result + _addition;
                  result += _savings * _percent / 12 + _addition;
                }
              }
            }

            break;
          }
      }

      result = parseInt(result).toFixed(0);
      return +result;
    },
    income: function income() {
      return this.result - this.savings - this.savingsPerMonth * (this.period - 1);
    }
  },
  methods: {
    chooseProgram: function chooseProgram() {
      var userInfo = "\n<div> \n<h3>\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043E \u0437\u0430\u043A\u0430\u0437\u0435:</h3>\n                    <h4>\u0421\u0443\u043C\u043C\u0430 \u0441\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u0438\u0439: <span style=\"font-weight: normal\">".concat(this.savings, "</span></h4>                    \n                    <h4>\u0421\u0443\u043C\u043C\u0430 \u043F\u043E\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F: <span style=\"font-weight: normal\">").concat(this.savingsPerMonth, "</span></h4>                    \n                    <h4>\u0412\u044B\u043F\u043B\u0430\u0442\u0430 \u043F\u0440\u043E\u0446\u0435\u043D\u0442\u043E\u0432: <span style=\"font-weight: normal\">").concat(this.procentType, "</span></h4>                    \n                    <h4>\u0421\u0440\u043E\u043A \u0441\u0431\u0440\u0435\u0436\u0435\u043D\u0438\u044F: <span style=\"font-weight: normal\">").concat(this.period, "</span></h4> \n                    <h4>\u0418\u0442\u043E\u0433: <span style=\"font-weight:normal\">").concat(this.result, "</span></h4>\n                    <h4>\u0412\u044B\u0433\u043E\u0434\u0430 \u043A\u043B\u0438\u0435\u043D\u0442\u0430: <span style=\"font-weight: normal\">").concat(this.income, "</span></h4>                    \n                    </div>\n                ");
      functions.chooseBankParam(userInfo);
    }
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
      var _this2 = this;

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

        _this2.$refs.button.classList.remove('is-loading');
      }).catch(function (err) {


        _this2.$refs.button.classList.remove('is-loading');
      });
    }
  },
  mounted: function mounted() {
    var context = this;
    setInterval(function () {
      context.inputField = context.$refs.number1.value;
    }, 500);
  }
});
new Vue({
  el: '#callback-success',
  methods: {
    closeModal: function closeModal() {
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
    var _this3 = this;

    axios.get(' http://api.sypexgeo.net/json/').then(function (res) {
      _this3.region = res.data.region.name_ru;
      _this3.city = res.data.city.name_ru;
    });
  }
});
new Vue({
  el: '#appCarusel',
  data: {
    reviews: []
  },
  methods: {
    downloadFile: function downloadFile(file, name) {
      window.open("".concat(config.hostUrl, "/").concat(file));
      return true;
      {
        var link = document.createElement('a');
        var format = null;

        if (file.endsWith('.jpg')) {
          format = '.jpg';
        } else if (file.endsWith('.png')) {
          format = '.png';
        } else if (file.endsWith('.jpeg')) {
          format = '.jpeg';
        }

        if (format === null) throw {
          message: 'Ошибка в формате файла'
        };
        link.download = name + format;
        link.href = config.hostUrl + '/' + file;
        console.log(link.href);
        link.click();
      }
    }
  },
  mounted: function mounted() {
    var _this4 = this;

    axios.get(config.hostUrl + '/api/review/all').then(function (res) {
      _this4.reviews = res.data;
      setTimeout(function () {
        new Siema({
          selector: '.siema',
          duration: 200,
          easing: 'ease-out',
          perPage: {
            320: 1,
            768: 2
          },
          startIndex: 0,
          draggable: true,
          multipleDrag: true,
          threshold: 20,
          loop: false,
          rtl: false,
          onInit: function onInit() {},
          onChange: function onChange() {}
        });
      }, 100);
    });
  }
});