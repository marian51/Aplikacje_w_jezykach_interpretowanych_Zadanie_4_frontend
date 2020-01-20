import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
    mode: "history",
    routes: [
        {
            path: "/",
            alias: "/products",
            name: "products",
            component: () => import("./components/ProductsList")
        },
        {
            path: "/products/:id",
            name: "product-details",
            component: () => import("./components/Product")
        },
        {
            path: "/add",
            name: "add",
            component: () => import("./components/AddProduct")
        },
        {
            path: "/cart",
            name: "cart",
            component: () => import("./components/ShoppingCart")
        },
        {
            path: "/order",
            name: "order",
            component: () => import("./components/Order")
        },
        {
            path: "/allOrders",
            name: "allOrders",
            component: () => import("./components/AllOrders")
        }
    ]
});