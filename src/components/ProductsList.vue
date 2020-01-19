<template>
    <div class="list row">
        <div class="col-md-8">
            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Wyszukaj po nazwie" v-model="name" />
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button"
                    @click="searchName">
                    Szukaj
                    </button>
                </div>
            </div>
        </div>

        <div class="col-md-6">
            <h4>Lista produktów</h4>    <!-- TODO Pomyśleć nad generowaniem tabeli zamiast listy -->
            <ul class="list-group"> <!-- TODO Można dodać wyświetlanie wagi, ceny itp oprócz tylko opisu -->
                <li class="list-group-item"
                :class="{ active: index == currentIndex }"
                v-for="(product, index) in products"
                :key="index"
                @click="setActiveProduct(product, index)"
                >
                {{ product.name }}
                <button class="btn btn-success btn-sm float-right"
                        v-on:click="addToCart(product)">
                        Dodaj do koszyka
                </button>
                </li>
            </ul>

            <button class="m-3 btn btn-sm btn-danger" @click="removeAllProducts">
                Usuń wszystkie
            </button>
        </div>

        <div class="col-md-6">
            <div v-if="currentProduct">
                <h4>Produkt</h4>
                <div>
                    <label><strong>Nazwa: </strong></label> {{ currentProduct.name }}
                </div>
                <div>
                    <label><strong>Opis: </strong></label> {{ currentProduct.description }}
                </div>
                <div>
                    <label><strong>Cena: </strong></label> {{ currentProduct.price | currency }}
                </div>
                <div>
                    <label><strong>Waga: </strong></label> {{ currentProduct.weight | comma }} kg
                </div>
                <div>
                    <label><strong>Kategoria: </strong></label> {{ currentCategory.name }}
                </div>
                <div>
                    <label><strong>Status: </strong></label> {{ currentProduct.available ? "Dostępny" : "Niedostępny" }}
                </div>

                <a class="badge badge-warning"
                :href="'/products/' + currentProduct.id"
                >
                Edytuj
                </a>
                
            </div>

            <div v-else>
                <br />
                <p>Wybierz produkt</p>
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable no-console */
import ProductDataService from "../services/ProductDataService";
import CategoryDataService from "../services/CategoryDataService";
//import CartDataService from "../services/CartDataService";

export default {
    name: "products-list",
    data() {
        return {
            products: [],
            categories: [],
            cart: [],
            currentProduct: null,
            currentIndex: -1,
            name: "",
            categoryName: '',
            currentCategory: ''
        };
    },

    methods: {
        retrieveProducts() {
            ProductDataService.getAll()
                .then(response => {
                    this.products = response.data;
                })
                .catch(error => {
                    console.log(error);
                });
        },

        retrieveCategories() {
            CategoryDataService.getAll()
                .then(response => {
                    this.categories = response.data;
                })
                .catch(err => {
                    console.log(err);
                })
        },

        getCategory(id) {
            CategoryDataService.get(id)
                .then(response => {
                    this.currentCategory = response.data;
                })
                .catch(err => {
                    console.log(err);
                })
        },

        refreshList() {
            this.retrieveProducts();
            this.currentProduct = null;
            this.currentIndex = -1;
        },

        setActiveProduct(product, index) {
            this.currentProduct = product;
            this.currentIndex = index;

            /*for (let c in this.categories) {
                if(this.categories[c].id==this.currentProduct.categoryId)
                {
                    this.categoryName = this.categories[c].name
                }
            }*/

            this.getCategory(this.currentProduct.categoryId);

        },

        removeAllProducts() {
            ProductDataService.deleteAll()
                .then(response => {
                    console.log(response.data);
                    this.refreshList();
                })
                .catch(error => {
                    console.log(error);
                });
        },

        searchName() {
            ProductDataService.findByName(this.name)
                .then(response => {
                    this.products = response.data;
                    console.log(response.data);
                })
                .catch(error => {
                    console.log(error)
                });
        },

        addToCart(p) {
            console.log(p)
            let t = this.cart.find(t => t.product.id == p.id)
            if(t != null) {
                console.log("Znalazlem")
                for (let i in this.cart) {
                    if(this.cart[i].product.id == p.id) {
                        this.cart[i].quantity++;
                    }
                }
            }
            else {
                console.log("Nie znalaznem")
                this.cart.push({
                product: p,
                quantity: 1
            });
            }

            
            localStorage.setItem("cart", JSON.stringify(this.cart));
            this.$router.push("/cart")
        }
    },

    mounted() {
        this.retrieveProducts();
        this.retrieveCategories();
        if(localStorage.getItem("cart")===null)
        {
            localStorage.setItem("cart", JSON.stringify(this.cart));
        }else {
            this.cart = JSON.parse(localStorage.getItem("cart"))
        }
    },

    filters: {
        currency(value) {
            return new Intl.NumberFormat("pl-PL", {
                style: "currency", currency: "PLN"
            }).format(value);
        },
        comma(value) {
            return new Intl.NumberFormat("pl-PL").format(value);
        }
    }
};
</script>


<style>
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}
</style>