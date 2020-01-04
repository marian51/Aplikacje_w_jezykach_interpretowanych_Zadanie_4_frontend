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
            <h4>Lista produktów</h4>
            <ul class="list-group">
                <li class="list-group-item"
                :class="{ active: index == currentIndex }"
                v-for="(product, index) in products"
                :key="index"
                @click="setActiveProduct(product, index)"
                >
                {{ product.name }}
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

export default {
    name: "products-list",
    data() {
        return {
            products: [],
            currentProduct: null,
            currentIndex: -1,
            name: ""
        };
    },

    methods: {
        retrieveProducts() {
            ProductDataService.getAll()
                .then(response => {
                    this.products = response.data;
                    console.log(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        },

        refreshList() {
            this.retrieveProducts();
            this.currentProduct = null;
            this.currentIndex = -1;
        },

        setActiveProduct(product, index) {
            this.currentProduct = product;
            this.currentIndex = index;
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
        }
    },

    mounted() {
        this.retrieveProducts();
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