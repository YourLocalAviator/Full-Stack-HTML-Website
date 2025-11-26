var webstore = new Vue({
    el: '#app',
    data: {
        lessons: [],
        searchResults: [],
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

    async created () {
        await this.fetchLessons();
    },
    // Use of async created() to run fetchLessons function.

    watch: {
        async searchQuery(newQuery) {
            if (!newQuery.trim()) {
                this.searchResults = [];
                return;
            }

            this.searchResults = await searchLessons(newQuery);
        }
        // Async Search Query to get the search input from the front end, and calls the searchLessons fetch function.
    },
    // Use of watch to auto-trigger function when an input occurs / changes in the search.

    methods: {
        async fetchLessons() {
            this.lessons = await getLessons();
        },
        // Use of async function for calling getLessons fetch function.

        toggleCartPage() {
            this.showCartPage = this.showCartPage ? false : true;
        },
        // Function to show the cart page if true, if not, show the product page and set to false.

        addToCart(lesson) {
            if (lesson.spaces <=0) return;
            const cartEntry = this.cart.find(it => it.lessonId === lesson._id);
            if (cartEntry) {
                cartEntry.quantity += 1;
            }
            else {
                this.cart.push({lessonId: lesson._id, quantity: 1});
            }
            lesson.spaces--;
        },
        /* Function that will add an item to the cart, if there is more than 0 spaces,
        locates the lesson ID, adds a quantity to the cart, and removes 1 space from the lesson item. */

        increaseCartItem(lesson) {
            if (lesson.spaces <= 0) return;
            const entry = this.cart.find(it => it.lessonId === lesson._id);
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
            const entryIndex = this.cart.findIndex(it => it.lessonId === lesson._id);
            if (entryIndex === -1) return;

            const entry = this.cart[entryIndex];
            lesson.spaces++;
            entry.quantity--;

            if (entry.quantity <= 0){
                this.cart.splice(entryIndex,1);
            }
        },
        /* Function that will remove a quantity of an item inside the cart page,
        it locates which lesson item via lesson ID and will remove a quantity from the cart page,
        whilst adding one space to the lesson item. If the quantity becomes 0, that item is removed
        from the cart page. */

        removeFromCart(lesson){
            const entryIndex = this.cart.findIndex(it => it.lessonId === lesson._id);
            if (entryIndex === -1) return;

            const entry = this.cart[entryIndex];
            lesson.spaces += entry.quantity;
            this.cart.splice(entryIndex,1);
        },
        /* Removes an item completely from the cart. It checks which lesson item using the lesson ID,
        then restores the spaces from the quantity in the cart and removes the item from the cart page. */

        emptyCart() {
            for (const cartItem of this.cart) {
                const lesson = this.lessons.find(l => l._id === cartItem.lessonId);
                if (lesson){
                    lesson.spaces += cartItem.quantity;
                }
            }
            this.cart = [];
        },
        /* Empties the cart of all items. It performs a forEach loop which first locates the lesson item through 
        lesson ID, then restores the spaces from the quantity in the cart, and then clears the cart array. */

        async submitCheckout() {
            if (!this.isCheckoutValid) return;

            const orderLessons = this.cartSummary.map(item => ({
                lessonID: item.lesson._id,
                lessonName: item.lesson.title,
                quantity: item.quantity
            }));
            
            const orderData = {
                name: this.checkout.name,
                phone: this.checkout.phone,
                lessons: orderLessons
            };

            try {
                const res = await saveOrder(orderData);

                if (res.msg === "Order added to database") {
                    for (const item of this.cartSummary) {
                        await updateLesson(item.lesson._id, {
                            spaces: item.lesson.spaces
                        });
                    };
                    alert("Thank you! Order submitted successfully!");
                } else {
                    alert("Sorry, order submission failed. Please try again.");
                } 
            } catch (err) {
                console.error("Checkout error: ", err);
                alert("Error submitting order.");
            };

            this.cart = [];
            this.checkout.name = '';
            this.checkout.phone= '';
            this.showCartPage = false;
        }
        /* Performs successful checkout. First checks if the isCheckoutValid function is true, if false, function will not run.
        It then creates a summarized list of items of the lesson details and order data. It then uploads the orderData to the 
        back end, and also updates the lesson spaces in MongoDB. It then clears all checkout details and shows the product page. */
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
                const lesson = this.lessons.find(l => l._id === it.lessonId);
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

        isNameMinLength() {
            return this.checkout.name.length >=8;
        },
        // Checks that the name has a minimum of 8 characters or more. 

        isPhoneValid () {
            if (!this.checkout.phone) return false;
            return /^\+?\d+$/.test(this.checkout.phone);
        },
        /* Checks that the phone field is not empty, then checks using regex is the number is valid, and allows things
        such as + signs, and numbers, restricting anything else. */

        isCheckoutValid() {
            return this.isNameValid && this.isNameMinLength && this.isPhoneValid && this.cartItemCount > 0;
        },
        /* Function that checks that all validation checks are completed, such as isNameValid, isNameMinLength, 
        isPhoneValid, and that there is more than one item in the cart. */

        filteredLessons() {
            // Search Function
            let searchedLessons = this.searchQuery.trim()
                ? this.searchResults
                : this.lessons;

            // Sort Function
            const attr = this.sortAttribute;
            const dir = this.sortDirection === 'asc' ? 1 : -1;

            result = searchedLessons.slice().sort((a,b) => {
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
        /* Function that will filter out lessons based on the search or sort query. It first checks if the user is
        inputting something, if there is, the this.searchResults is called, if not, this.lessons is called. It then
        checks if the user has used any of the sort features. slice() creates a copy of the results rather than
        modifying the original array. It then performs sorting by text fields, then by numbers. 
        If no sort was used, the original order is used, and the final result is sent to the front end. */
    }
});
// End of Vue-JS Code