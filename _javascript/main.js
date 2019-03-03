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
