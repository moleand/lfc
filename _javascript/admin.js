let config = {
    hostname: 'http://188.68.210.217'
};
let newReviewApp = new Vue({
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
        disableSubmit: function () {
            if (this.name === '' || this.content === '' || this.image === null) {
                return false;
            }
            return true;
        }
    },
    methods: {
        changeFile(event) {
            if (event.target.files.length > 0) {
                this.filename = event.target.files[0].name;
                this.image = event.target.files[0];
            }
        },
        saveReview() {
            if (this.$refs.btnSubmit.classList.contains('is-loading')) {
                return;
            }
            this.$refs.btnSubmit.classList.add('is-loading');

            let body = new FormData();
            body.append('name', this.name);
            body.append('content', this.content);
            body.append('image', this.image);
            body.append('key', '11');

            axios.post(config.hostname + '/api/review/new', body)
                .then(res => {
                    bulmaToast.toast(
                        {
                            message: res.data,
                            duration: 5000,
                            position: "bottom-center",
                            type: "is-success",
                            closeOnClick: true,
                            opacity: 1,
                            animate: {in: 'fadeIn', out: 'fadeOut'}
                        });
                    this.$refs.btnSubmit.classList.remove('is-loading');
                    this.name = '';
                    this.content = '';
                    this.image = null;
                    this.filename = '';
                })
                .catch(err => {
                    bulmaToast.toast(
                        {
                            message: err.message,
                            duration: 5000,
                            position: "bottom-center",
                            type: "is-danger",
                            closeOnClick: true,
                            opacity: 1,
                            animate: {in: 'fadeIn', out: 'fadeOut'}
                        });
                })
        },
        mounted: function () {

        }
    }
});
let editReviewApp = new Vue({
    el: '#editReviews',
    data: {
        show: false,
        reviews: [],
        editMod: false,
        revEdit: {},
        filename: '',
        photoChanged: false
    },
    mounted: function () {
        axios.get(config.hostname + '/api/review/all')
            .then(res => {
                this.reviews = res.data;
            })
            .catch(err => {
                bulmaToast.toast(
                    {
                        message: err.message,
                        duration: 5000,
                        position: "bottom-center",
                        type: "is-danger",
                        closeOnClick: true,
                        opacity: 1,
                        animate: {in: 'fadeIn', out: 'fadeOut'}
                    });
            })
    },
    computed: {
        disableSubmit: function () {
            if (this.revEdit.name === '' || this.revEdit.content === '' || this.revEdit.image === null) {
                return false;
            }
            return true;
        }
    },
    methods: {
        selectToEdit(rev) {
            this.revEdit = rev;
            this.editMod = true;
            this.filename = rev.image;
            this.photoChanged = false;
        },
        changeFile(event) {
            if (event.target.files.length > 0) {
                if (event.target.files[0] != this.revEdit.image) {
                    this.photoChanged = true;
                }
                this.filename = event.target.files[0].name;
                this.revEdit.image = event.target.files[0];
            }
        },
        backToSelection() {
            this.editMod = false;
        },
        saveReview() {
            if (this.$refs.btnSubmit.classList.contains('is-loading')) {
                return;
            }
            this.$refs.btnSubmit.classList.add('is-loading');
            console.log(this.revEdit);
            let body = new FormData();
            body.append('name', this.revEdit.name);
            body.append('content', this.revEdit.content);
            body.append('number', +this.revEdit.number);
            if (this.photoChanged) {
                body.append('image', this.revEdit.image);
            }
            body.append('key', '11');

            axios.patch(config.hostname + '/api/review/edit', body)
                .then(res => {
                    bulmaToast.toast(
                        {
                            message: `Отзыв №${res.data.number} успешно изменен!`,
                            duration: 5000,
                            position: "bottom-center",
                            type: "is-success",
                            closeOnClick: true,
                            opacity: 1,
                            animate: {in: 'fadeIn', out: 'fadeOut'}
                        });
                    this.$refs.btnSubmit.classList.remove('is-loading');
                })
                .catch(err => {
                    bulmaToast.toast(
                        {
                            message: err.message,
                            duration: 5000,
                            position: "bottom-center",
                            type: "is-danger",
                            closeOnClick: true,
                            opacity: 1,
                            animate: {in: 'fadeIn', out: 'fadeOut'}
                        });
                })
        },
        closeModal() {
            this.$refs.modal.classList.remove('is-active');
        },
        askForDelete() {
            this.$refs.modal.classList.add('is-active');
        },
        deleteReview() {
            this.closeModal();
            let body = new FormData();
            body.append('key', 11);
            body.append('number', this.revEdit.number);
            axios.delete(config.hostname + '/api/review/deleteOne', {data: body})
                .then(res => {
                    bulmaToast.toast(
                        {
                            message: `Отзыв №${this.revEdit.number} успешно удален!`,
                            duration: 5000,
                            position: "bottom-center",
                            type: "is-success",
                            closeOnClick: true,
                            opacity: 1,
                            animate: {in: 'fadeIn', out: 'fadeOut'}
                        });
                    let index = this.reviews.findIndex((value, index) => {
                        if (value.number === this.revEdit.number) return true;
                        return false;
                    });
                    this.reviews.splice(index, 1);
                    this.revEdit = {};
                    this.editMod = false;
                })
                .catch(err => {
                    bulmaToast.toast(
                        {
                            message: err.message,
                            duration: 5000,
                            position: "bottom-center",
                            type: "is-danger",
                            closeOnClick: true,
                            opacity: 1,
                            animate: {in: 'fadeIn', out: 'fadeOut'}
                        });
                })
        }
    }
});
let statisticsApp = new Vue({
    el: '#statsApp',
    data: {
        show: false,
        stats: {}
    },
    methods: {},
    mounted: function () {
        axios.get(config.hostname + '/api/stats/global')
            .then(res => {
                this.stats = res.data;
            })
            .catch(err => {
                bulmaToast.toast(
                    {
                        message: 'Произошла ошибка при загрузке данных :(',
                        duration: 5000,
                        position: "bottom-center",
                        type: "is-danger",
                        closeOnClick: true,
                        opacity: 1,
                        animate: {in: 'fadeIn', out: 'fadeOut'}
                    });
            });
    }
});
let menu = new Vue({
    el: '#menu',
    data: {
        tabs: [newReviewApp, editReviewApp, statisticsApp, {show: false}],
        menus: []
    },
    methods: {
        selectTab(index, event) {
            for (let i = 0; i < this.tabs.length; i++) {
                if (index != i) {
                    this.tabs[i].show = false;
                    this.menus[i].classList.remove('is-active');
                }
            }
            this.tabs[index].show = true;
            this.menus[index].classList.add('is-active');
        }
    },
    mounted: function () {
        for (let i = 0; i < this.$refs.table.childNodes.length; i++) {
            const childNode = this.$refs.table.childNodes[i];
            if (childNode.nodeName === 'LI') {
                this.menus.push(childNode);
            }
        }
    }
});




