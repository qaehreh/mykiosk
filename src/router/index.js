import Payment from "../components/Payment.vue";
import ShoppingCart from "../components/ShoppingCart.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/ShoppingCart",
        name: "ShoppingCart",
        component: ShoppingCart,
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
