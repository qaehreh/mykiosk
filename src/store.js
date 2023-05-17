import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
export default createStore({
    plugins: [createPersistedState()],
    state: {
        cart: [],
    },
    mutations: {
        ADD_TO_CART(state, product) {
            let found = state.cart.find(item => item.product.id === product.id);

            if (found) {
                found.quantity++;
            } else {
                state.cart.push({product, quantity: 1});
            }
        },
        REMOVE_FROM_CART(state, product) {
            let index = state.cart.findIndex(item => item.product.id === product.id);

            if (index > -1) {
                if(state.cart[index].quantity > 1) {
                    state.cart[index].quantity--;
                } else {
                    state.cart.splice(index, 1);
                }
            }
        },
    },
    actions: {
        addToCart({ commit }, product) {
            commit('ADD_TO_CART', product);
        },
        removeFromCart({ commit }, product) {
            commit('REMOVE_FROM_CART', product);
        },
    },
    getters: {
        cart: state => state.cart,
        cartTotal: state => {
            return state.cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
        },
    },
})
