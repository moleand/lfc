const config = {
    hostUrl: 'http://localhost',
    modalClass: 'modal',
    activeClass: 'is-active',
    modalTitle: 'Укажите Ваш телефон и наш сотрудник свяжется с Вами!'
};
const modalTitles = ['Укажите Ваш телефон и наш сотрудник свяжется с Вами!',
    'Оставьте Ваш телефон и наш сотрудник свяжется с Вами для уточнения деталей'];
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
new Vue({
    el: '#modal'
});
const menu = new Vue({
    el:'#menu'
});
new Vue({
    el: '#navMenuApp',
    data: {
        region: '',
        city: '',
        menuActive: false
    },
    methods: {
        burger(){
            if(!this.menuActive){
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
    mounted: function () {
        axios.get(' http://api.sypexgeo.net/json/')
            .then(res => {
                console.log(res);
                this.region = res.data.region.name_ru;
                this.city = res.data.city.name_ru;
            })
    }
});
