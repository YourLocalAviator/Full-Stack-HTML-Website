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
    // Initialization of Vue and data. 

    methods: {
        toggleCartPage() {
            this.showCartPage = this.showCartPage ? false : true;
        },
        // Function to show the cart page if true, if not, show the product page and set to false.

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
        /* Function that will add an item to the cart, if there is more than 0 spaces,
        locates the lesson ID, adds a quantity to the cart, and removes 1 space from the lesson item. */

        increaseCartItem(lesson) {
            if (lesson.spaces <= 0) return;
            const entry = this.cart.find(it => it.lessonId === lesson.id);
            if (entry) {
                entry.quantity += 1;
                lesson.spaces -= 1;
            }
        },
        /* Function that will add an additional quantity of an item inside the cart page,
        it again checks if there are more than 0 spaces for that lesson, then checks which item
        it is through the lesson ID, then adding another quantity in the cart, whilst removing one
        space from the lesson item. */

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
        /* Function that will remove a quantity of an item inside the cart page,
        it locates which lesson item via lesson ID and will remove a quantity from the cart page,
        whilst adding one space to the lesson item. If the quantity becomes 0, that item is removed
        from the cart page. */

        removeFromCart(lesson){
            const entryIndex = this.cart.findIndex(it => it.lessonId === lesson.id);
            if (entryIndex === -1) return;

            const entry = this.cart[entryIndex];
            lesson.spaces += entry.quantity;
            this.cart.splice(entryIndex,1);
        },
        /* Removes an item completely from the cart. It checks which lesson item using the lesson ID,
        then restores the spaces from the quantity in the cart and removes the item from the cart page. */

        emptyCart() {
            this.cart.forEach(cartItem => {
                const lesson = this.lessons.find(lesson => lesson.id === cartItem.lessonId);
                if (lesson) {
                    lesson.spaces += cartItem.quantity;
                }
            });
            this.cart = [];
        },
        /* Empties the cart of all items. It performs a forEach loop which first locates the lesson item through 
        lesson ID, then restores the spaces from the quantity in the cart, and then clears the cart array. */

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
        /* Performs successful checkout. First checks if the isCheckoutValid function is true, if false, function will not run.
        It then creates a summarized list of items of the lesson details, and displays it as a message. It then clears all checkout
        details and shows the product page. */
    },
    computed: {
        cartItemCount() {
            let total = 0;
            for (let i = 0; i < this.cart.length; i++){
                total += this.cart[i].quantity;
            }
            return total;
        },
        // Function that counts the total number of items in the cart, including quantity of lesson items and returns the total.

        cartSummary(){
            return this.cart.map(it => {
                const lesson = this.lessons.find(l => l.id === it.lessonId);
                return {lesson, quantity: it.quantity};
            });
        },
        // Function that gets a summary of all lesson information using .map function and returns an object.

        cartTotal() {
            return this.cartSummary.reduce(
                (sum, {lesson, quantity}) => sum + lesson.price * quantity,0);
        },
        // Function that generates cart total by calculating each lesson's price and quantity, and totaling them.

        isNameValid () {
            if (!this.checkout.name) return false;
            return /^[A-Za-z\s'.-]+$/.test(this.checkout.name);
        },
        /* Checks that the name input field is not empty, and checks using regex if the name is valid, and allows things
        such as upper and lower case lettesr, spaces, periods, hyphens and apostrophes. */

        isPhoneValid () {
            if (!this.checkout.phone) return false;
            return /^\+?\d+$/.test(this.checkout.phone);
        },
        /* Checks that the phone field is not empty, then checks using regex is the number is valid, and allows things
        such as + signs, and numbers, restricting anything else. */

        isCheckoutValid() {
            return this.isNameValid && this.isPhoneValid && this.cartItemCount > 0;
        },
        /* Function that checks that all validation checks are completed, such as isNameValid, isPhoneValid, and 
        that there is more than one item in the cart. */

        filteredLessons() {
            // Search Function
            const query = (this.searchQuery || '').trim().toLowerCase();
            const matchedQuery = (lesson) => {
                if (!query) return true;
                const combinedInfo = `${lesson.title} ${lesson.subject} ${lesson.location} ${lesson.price} ${lesson.spaces}`.toLowerCase();
                return combinedInfo.indexOf(query) !== -1;
            };
            let result = this.lessons.filter(matchedQuery);
            /* Saves the user input as a constant, under "query".
            It first checks if the query is empty, if it is, then just return all lessons. combinedInfo
            contains all the lesson information into one string, making it easier to search under.
            result will return all results that matched the query. */

            // Sort Function
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
        /* Function that will filter out lessons based on the search or sort query. */
    }
});
// End of Vue-JS Code