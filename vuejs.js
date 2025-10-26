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
        },
        submitCheckout() {
            if (!this.isCheckoutValid) return;

            const checkoutSummary = this.cartSummary.map(s =>
                `${s.lesson.title} x${s.quantity} ${(s.lesson.price * s.quantity)}`
            );
            const checkoutTotal = this.cartTotal;
            const checkoutMessage = `Order Submitted! Thank you for your order. \n\n Name: ${this.checkout.name} \n Phone: ${this.checkout.phone} \n\nItems: \n${checkoutSummary.join('\n')} \n\nTotal: $${checkoutTotal} `;
            alert(checkoutMessage);

            this.cart = [];
            this.checkout.name = '';
            this.checkout.phone= '';
            this.showCartPage = false;
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
        isNameValid () {
            if (!this.checkout.name) return false;
            return /^[A-Za-z\s'.-]+$/.test(this.checkout.name);
        },
        isPhoneValid () {
            if (!this.checkout.phone) return false;
            return /^\+?\d+$/.test(this.checkout.phone);
        },
        isCheckoutValid() {
            return this.isNameValid && this.isPhoneValid && this.cartItemCount > 0;
        },
        filteredLessons() {
            const query = (this.searchQuery || '').trim().toLowerCase();

            const matchedQuery = (lesson) => {
                if (!query) return true;
                const combinedInfo = `${lesson.title} ${lesson.subject} ${lesson.location} ${lesson.price} ${lesson.spaces}`.toLowerCase();
                return combinedInfo.indexOf(query) !== -1;
            };
            let result = this.lessons.filter(matchedQuery);

            const attr = this.sortAttribute;
            const dir = this.sortDirection === 'asc' ? 1 : -1;

            result = result.slice().sort((a,b) => {
                let va = a[attr];
                let vb = b[attr];

                if (attr === 'subject' || attr === 'location') {
                    va = (va || '').toString().toLowerCase();
                    vb = (vb || '').toString().toLowerCase();
                    if (va < vb) return -1 * dir;
                    if (va > vb) return 1 * dir; 
                    return 0;
                }

                if (attr === 'price' || attr === 'spaces') {
                    const na = Number(va) || 0;
                    const nb = Number(vb) || 0;
                    return (na - nb) * dir;
                }
                return 0;
            })
            return result;
        }
    }
});