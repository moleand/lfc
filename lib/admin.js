"use strict";

var config = {
  hostname: 'https://lenfincentr.ru'
};
var newReviewApp = new Vue({
  el: '#newReview',
  data: {
    show: true,
    name: '',
    content: '',
    image: null,
    filename: null,
    example: {
      name: 'Иванов И.И.',
      content: 'В 2018 г обратилась в ВТБ,отделение в Кисловодске по адресу пр. Первомайский 31 для получения кредита.Не являясь клиентом банка по справке о доходе с места работы получила кредит с...'
    }
  },
  computed: {
    disableSubmit: function disableSubmit() {
      if (this.name === '' || this.content === '' || this.image === null) {
        return false;
      }

      return true;
    }
  },
  methods: {
    changeFile: function changeFile(event) {
      if (event.target.files.length > 0) {
        this.filename = event.target.files[0].name;
        this.image = event.target.files[0];
      }
    },
    saveReview: function saveReview() {
      var _this = this;

      if (this.$refs.btnSubmit.classList.contains('is-loading')) {
        return;
      }

      this.$refs.btnSubmit.classList.add('is-loading');
      var body = new FormData();
      body.append('name', this.name);
      body.append('content', this.content);
      body.append('image', this.image);
      body.append('key', '11');
      axios.post(config.hostname + '/api/review/new', body).then(function (res) {
        bulmaToast.toast({
          message: res.data,
          duration: 5000,
          position: "bottom-center",
          type: "is-success",
          closeOnClick: true,
          opacity: 1,
          animate: {
            in: 'fadeIn',
            out: 'fadeOut'
          }
        });

        _this.$refs.btnSubmit.classList.remove('is-loading');

        _this.name = '';
        _this.content = '';
        _this.image = null;
        _this.filename = '';
      }).catch(function (err) {
        bulmaToast.toast({
          message: err.message,
          duration: 5000,
          position: "bottom-center",
          type: "is-danger",
          closeOnClick: true,
          opacity: 1,
          animate: {
            in: 'fadeIn',
            out: 'fadeOut'
          }
        });
      });
    },
    mounted: function mounted() {}
  }
});
var editReviewApp = new Vue({
  el: '#editReviews',
  data: {
    show: false,
    reviews: [],
    editMod: false,
    revEdit: {},
    filename: '',
    photoChanged: false
  },
  mounted: function mounted() {
    var _this2 = this;

    axios.get(config.hostname + '/api/review/all').then(function (res) {
      _this2.reviews = res.data;
    }).catch(function (err) {
      bulmaToast.toast({
        message: err.message,
        duration: 5000,
        position: "bottom-center",
        type: "is-danger",
        closeOnClick: true,
        opacity: 1,
        animate: {
          in: 'fadeIn',
          out: 'fadeOut'
        }
      });
    });
  },
  computed: {
    disableSubmit: function disableSubmit() {
      if (this.revEdit.name === '' || this.revEdit.content === '' || this.revEdit.image === null) {
        return false;
      }

      return true;
    }
  },
  methods: {
    selectToEdit: function selectToEdit(rev) {
      this.revEdit = rev;
      this.editMod = true;
      this.filename = rev.image;
      this.photoChanged = false;
    },
    changeFile: function changeFile(event) {
      if (event.target.files.length > 0) {
        if (event.target.files[0] != this.revEdit.image) {
          this.photoChanged = true;
        }

        this.filename = event.target.files[0].name;
        this.revEdit.image = event.target.files[0];
      }
    },
    backToSelection: function backToSelection() {
      this.editMod = false;
    },
    saveReview: function saveReview() {
      var _this3 = this;

      if (this.$refs.btnSubmit.classList.contains('is-loading')) {
        return;
      }

      this.$refs.btnSubmit.classList.add('is-loading');
      console.log(this.revEdit);
      var body = new FormData();
      body.append('name', this.revEdit.name);
      body.append('content', this.revEdit.content);
      body.append('number', +this.revEdit.number);

      if (this.photoChanged) {
        body.append('image', this.revEdit.image);
      }

      body.append('key', '11');
      axios.patch(config.hostname + '/api/review/edit', body).then(function (res) {
        bulmaToast.toast({
          message: "\u041E\u0442\u0437\u044B\u0432 \u2116".concat(res.data.number, " \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0438\u0437\u043C\u0435\u043D\u0435\u043D!"),
          duration: 5000,
          position: "bottom-center",
          type: "is-success",
          closeOnClick: true,
          opacity: 1,
          animate: {
            in: 'fadeIn',
            out: 'fadeOut'
          }
        });

        _this3.$refs.btnSubmit.classList.remove('is-loading');
      }).catch(function (err) {
        bulmaToast.toast({
          message: err.message,
          duration: 5000,
          position: "bottom-center",
          type: "is-danger",
          closeOnClick: true,
          opacity: 1,
          animate: {
            in: 'fadeIn',
            out: 'fadeOut'
          }
        });
      });
    },
    closeModal: function closeModal() {
      this.$refs.modal.classList.remove('is-active');
    },
    askForDelete: function askForDelete() {
      this.$refs.modal.classList.add('is-active');
    },
    deleteReview: function deleteReview() {
      var _this4 = this;

      this.closeModal();
      var body = new FormData();
      body.append('key', 11);
      body.append('number', this.revEdit.number);
      axios.delete(config.hostname + '/api/review/deleteOne', {
        data: body
      }).then(function (res) {
        bulmaToast.toast({
          message: "\u041E\u0442\u0437\u044B\u0432 \u2116".concat(_this4.revEdit.number, " \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0443\u0434\u0430\u043B\u0435\u043D!"),
          duration: 5000,
          position: "bottom-center",
          type: "is-success",
          closeOnClick: true,
          opacity: 1,
          animate: {
            in: 'fadeIn',
            out: 'fadeOut'
          }
        });

        var index = _this4.reviews.findIndex(function (value, index) {
          if (value.number === _this4.revEdit.number) return true;
          return false;
        });

        _this4.reviews.splice(index, 1);

        _this4.revEdit = {};
        _this4.editMod = false;
      }).catch(function (err) {
        bulmaToast.toast({
          message: err.message,
          duration: 5000,
          position: "bottom-center",
          type: "is-danger",
          closeOnClick: true,
          opacity: 1,
          animate: {
            in: 'fadeIn',
            out: 'fadeOut'
          }
        });
      });
    }
  }
});
var statisticsApp = new Vue({
  el: '#statsApp',
  data: {
    show: false,
    stats: {}
  },
  methods: {},
  mounted: function mounted() {
    var _this5 = this;

    axios.get(config.hostname + '/api/stats/global').then(function (res) {
      _this5.stats = res.data;
    }).catch(function (err) {
      bulmaToast.toast({
        message: 'Произошла ошибка при загрузке данных :(',
        duration: 5000,
        position: "bottom-center",
        type: "is-danger",
        closeOnClick: true,
        opacity: 1,
        animate: {
          in: 'fadeIn',
          out: 'fadeOut'
        }
      });
    });
  }
});
var menu = new Vue({
  el: '#menu',
  data: {
    tabs: [newReviewApp, editReviewApp, statisticsApp, {
      show: false
    }],
    menus: []
  },
  methods: {
    selectTab: function selectTab(index, event) {
      for (var i = 0; i < this.tabs.length; i++) {
        if (index != i) {
          this.tabs[i].show = false;
          this.menus[i].classList.remove('is-active');
        }
      }

      this.tabs[index].show = true;
      this.menus[index].classList.add('is-active');
    }
  },
  mounted: function mounted() {
    for (var i = 0; i < this.$refs.table.childNodes.length; i++) {
      var childNode = this.$refs.table.childNodes[i];

      if (childNode.nodeName === 'LI') {
        this.menus.push(childNode);
      }
    }
  }
});