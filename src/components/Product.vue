<template>
    <div v-if="currentProduct" class="edit-form">
        <h4>Produkt</h4>
        <form>
            <div class="form-group">
                <label for="name">Nazwa</label>
                <input type="text" 
                    class="form-control" 
                    id="name" 
                    v-model="currentProduct.name" />
            </div>

            <div class="form-group">
                <label for="description">Opis</label>
                <input type="text" 
                    class="form-control" 
                    id="description"
                    v-model="currentProduct.description" />
            </div>

            <div class="form-group">
                <label for="description">Cena</label>
                <input type="text" 
                    class="form-control" 
                    id="price"
                    v-model="currentProduct.price" />
            </div>

            <div class="form-group">
                <label for="description">Waga</label>
                <input type="text" 
                    class="form-control" 
                    id="weight"
                    v-model="currentProduct.weight" />
            </div>

            <div class="form-group">
                <label for="category">Kategoria</label>
                <v-select
                    label="name"
                    :options="categories"
                    v-model="currentProduct.categoryId"
                    :reduce="name => name.id">
                </v-select>
            </div>

            <div class="form-group">
                <label><strong>Status: </strong></label>
                {{ currentProduct.available ? "Dostępny" : "Niedostępny" }}
            </div>
        </form>

        <button class="badge badge-primary mr-2"
            v-if="currentProduct.available"
            @click="updateAvailable(false)" >
            Niedostępny
        </button>

        <button v-else class="badge badge-primary mr-2"
            @click="updateAvailable(true)" >
            Dostępny
        </button>

        <button class="badge badge-danger mr-2"
            @click="deleteProduct" >
            Usuń
        </button>

        <button type="submit" class="badge badge-success mr-2"
            @click="updateProduct" >
            Edytuj
        </button>

        <p>{{ message }}</p>
    </div>
    <div v-else>
        <br />
        <p>Wybierz produkt</p>
    </div>   
</template>

<script>
/* eslint-disable no-console */
import ProductDataService from "../services/ProductDataService";
import CategoryDataService from "../services/CategoryDataService";


export default {
    name: "product",
    data() {
        return {
            currentProduct: null,
            message: "",
            categories: [],
            selected: ''
        };
    },

    methods: {
        getProduct(id) {
            ProductDataService.get(id)
                .then(response => {
                    this.currentProduct = response.data;
                    console.log(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        },

        updateAvailable(status) {
            let data = {
                id: this.currentProduct.id,
                name: this.currentProduct.name,
                description: this.currentProduct.description,
                price: this.currentProduct.price,
                weight: this.currentProduct.weight,
                categoryId: this.selected,
                available: status
            };

            console.log("Selected: "+this.selected)

            ProductDataService.update(this.currentProduct.id, data)
                .then(response => {
                    this.currentProduct.available = response.data.available;
                    console.log(response.data);
                    window.location.reload(false);
                })
                .catch(error => {
                    console.log(error);
                });
        },

        updateProduct() {
            ProductDataService.update(this.currentProduct.id, this.currentProduct)
                .then(response => {
                    console.log(response.data);
                    this.message = "Produkt zmieniony poprawnie.";
                })
                .catch(error => {
                    console.log(error);
                });
        },

        deleteProduct() {
            ProductDataService.delete(this.currentProduct.id)
                .then(response => {
                    console.log(response.data);
                    this.$router.push('/products');
                })
                .catch(error => {
                    console.log(error);
                });
        },

        retrieveCategories() {
            CategoryDataService.getAll()
                .then(response => {
                    this.categories = response.data;
                    console.log(response.data)
                })
                .catch(err => {
                    console.log(err);
                })
        }
    },

    mounted() {
        this.message = '';
        this.getProduct(this.$route.params.id);
        this.retrieveCategories();
    }
};
</script>

<style>
.edit-form {
  max-width: 300px;
  margin: auto;
}
</style>