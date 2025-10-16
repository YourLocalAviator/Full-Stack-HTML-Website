var webstore = new Vue({
    el: '#app',
    data: {
        lessons: lessons,
        showCartPage: false,

        sortAttribute: 'subject',
        sortDirection: 'asc',
        searchQuery: '',
        
        cart: [],
        checkout: {
            name: '',
            phone: '',
        }
    },
    methods: {

    },
    computed: {

    }
});