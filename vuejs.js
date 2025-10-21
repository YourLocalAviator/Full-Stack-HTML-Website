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
        toggleCartPage() {
            this.showCartPage = this.showCartPage ? false : true;
        },
        addToCart(lesson) {
            if (lesson.spaces <=0) return;
            const cartEntry = this.cart.find(it => it.lessonId === lesson.id);
            if (cartEntry) {
                cartEntry.quantity += 1;
            }
            else {
                this.cart.push({lessonId: lesson.id, quantity: 1});
            }
            lesson.spaces--;
        },
    },
    computed: {
        cartItemCount() {
            let total = 0;
            for (let i = 0; i < this.cart.length; i++){
                total += this.cart[i].quantity;
            }
            return total;
        },
        increaseCartItem(lesson) {
            if (lesson.spaces <= 0) return;
            const entry = this.cart.find(function(it) {
                return it.lessonId === lesson.id;
            });
            if (entry) {
                entry.quantity += 1;
                lesson.spaces -+ 1;
            }
        },
    }
});