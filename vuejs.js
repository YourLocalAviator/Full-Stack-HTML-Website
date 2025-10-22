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
        increaseCartItem(lesson) {
            if (lesson.spaces <= 0) return;
            const entry = this.cart.find(it => it.lessonId === lesson.id);
            if (entry) {
                entry.quantity += 1;
                lesson.spaces -= 1;
            }
        },
        decreaseCartItem(lesson) {
            const entryIndex = this.cart.findIndex(it => it.lessonId === lesson.id);
            if (entryIndex === -1) return;

            const entry = this.cart[entryIndex];
            lesson.spaces += 1;
            entry.quantity -= 1;

            if (entry.quantity <= 0){
                this.cart.splice(entryIndex,1);
            }
        },
        removeFromCart(lesson){
            const entryIndex = this.cart.findIndex(it => it.lessonId === lesson.id);
            if (entryIndex === -1) return;

            const entry = this.cart[entryIndex];
            lesson.spaces += entry.quantity;
            this.cart.splice(entryIndex,1);
        },
        emptyCart() {
            this.cart.forEach(cartItem => {
                const lesson = this.lessons.find(lesson => lesson.id === cartItem.lessonId);
                if (lesson) {
                    lesson.spaces += cartItem.quantity;
                }
            });
            this.cart = [];
        }
    },
    computed: {
        cartItemCount() {
            let total = 0;
            for (let i = 0; i < this.cart.length; i++){
                total += this.cart[i].quantity;
            }
            return total;
        },
        cartSummary(){
            return this.cart.map(it => {
                const lesson = this.lessons.find(l => l.id === it.lessonId);
                return {lesson, quantity: it.quantity};
            });
        },
        cartTotal() {
            return this.cartSummary.reduce(
                (sum, {lesson, quantity}) => sum + lesson.price * quantity,0);
        },
    }
});