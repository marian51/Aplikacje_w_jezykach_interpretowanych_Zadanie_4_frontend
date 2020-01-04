<template>
    <div class="submit-form">
        <div v-if="!submitted">
            <div class="form-group">
                <label for="name">Nazwa</label>
                <input
                    type="text"
                    class="form-control"
                    id="name"
                    required
                    v-model="product.name"
                    name="name"
                />
            </div>

            <div class="form-group">
                <label for="name">Opis</label>
                <input
                    class="form-control"
                    id="description"
                    required
                    v-model="product.description"
                    name="description"
                />
            </div>

            <button @click="saveProduct" class="btn btn-success">Zapisz</button>
        </div>

        <div v-else>
            <h4>Produkt dodany pomyślnie</h4>
            <button class="btn btn-success" @click="newProduct">Okej!</button>
        </div>
    </div>
</template>

<script>
/* eslint-disable no-console */
import ProductDataService from "../services/ProductDataService";

export default {
    name: "add-product",
    data() {
        return {
            product: {
                id: null,
                name: "",
                description: "",
                available: false
            },
            submitted: false
        };
    },

    methods: {
        saveProduct() {
            let data = {
                name: this.product.name,
                description: this.product.description
            };

            ProductDataService.create(data)
                .then(response => {
                    this.product.id = response.data.id;
                    console.log(response.data);
                })
                .catch(error => {
                    console.log(error);
                });

            this.submitted = true;
        },

        newProduct() {
            this.submitted = false;
            this.product = {};
            this.$router.push('/products');
        }
    }
};
</script>

<style>
.submit-form {
    max-width: 300px;
    margin: auto;
}
</style>s