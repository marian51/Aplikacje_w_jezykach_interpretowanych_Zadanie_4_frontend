<template>
    <div class="submit-form">
        
        <div v-if="!submitted">
            <!--<div v-if="errors.length">
                <b>Pojawiły się błędy!
                    <ul>
                        <li v-for="e in errors" v-bind:key="e">{{ e }}</li>
                    </ul>
                </b>
            </div>-->
            <div class="form-group">
                <label for="name">Nazwa</label>
                <input
                    type="text"
                    class="form-control"
                    id="name"
                    required
                    v-model="product.name"
                    name="name"
                    v-bind:class="{ 'is-invalid': ifSubmit && wrongName }"
                />
                <div class="invalid-feedback">Wymagana jest nazwa przedmiotu</div>
            </div>

            <div class="form-group">
                <label for="name">Opis</label>
                <input
                    class="form-control"
                    id="description"
                    required
                    v-model="product.description"
                    name="description"
                    v-bind:class="{ 'is-invalid': ifSubmit && wrongDescription }"
                />
                <div class="invalid-feedback">Wymagany jest opis przedmiotu</div>
            </div>

            <div class="form-group">
                <label for="price">Cena</label>
                <input
                    class="form-control"
                    id="price"
                    required
                    v-model="product.price"
                    name="price"
                    v-bind:class="{ 'is-invalid': ifSubmit && wrongPriceNumber }"
                >
                <div class="invalid-feedback">Wymagana jest liczba</div>
            </div>

            <div class="form-group">
                <label for="number">Waga</label>
                <input
                    class="form-control"
                    id="weight"
                    required
                    v-model="product.weight"
                    name="weight"
                    v-bind:class="{ 'is-invalid': ifSubmit && wrongWeightNumber }"
                >
                <div class="invalid-feedback">Wymagana jest liczba</div>
            </div>

            <div class="form-group">
                <label for="category">Kategoria</label>
                <v-select 
                    label="name" 
                    :options="categories"
                    v-model="selected"
                    :reduce="name => name.id"></v-select>
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
import CategoryDataService from "../services/CategoryDataService";

export default {
    name: "add-product",
    data() {
        return {
            product: {
                id: null,
                name: "",
                description: "",
                price: '',
                weight: '',
                categoryId: '',
                available: false
            },
            submitted: false,
            errors: false,
            number: '',
            thisSubmit: false,
            categories: [],
            selected: ''
        };
    },

    computed: {
        wrongWeightNumber() {
            return (this.isNumeric(this.product.weight)===false);
        },

        wrongPriceNumber() {
            return (this.isNumeric(this.product.price)===false);
        },

        wrongName() {
            console.log("Selected = "+this.selected);
            return (this.product.name==='')
        },

        wrongDescription() {
            return (this.product.description==='')
        },

        ifSubmit(){
            if(this.thisSubmit===false)
                return false;
            else if (this.thisSubmit===true)
                return true;
            else
                return false
        }
    },

    methods: {
        saveProduct() {
            this.validateForm();

            if(this.errors) {
                console.log("Są errory");
                return false;
            }

            console.log("Stan errors: "+this.errors);
            let data = {
                name: this.product.name,
                description: this.product.description,
                price: this.product.price,
                weight: this.product.weight,
                categoryId: this.selected
            };

            //this.validation(data);

            

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
        },

        validateForm() {
            this.thisSubmit = true;
            console.log("thisSubmit = true");
            if(this.wrongName) {
                this.errors = true;
            }
            else if(this.wrongDescription) {
                this.errors = true;
            }
            else if(this.wrongPriceNumber) {
                this.errors = true;
            }
            else if(this.wrongWeightNumber) {
                this.errors = true;
            }
            else {
                this.errors = false;
            }
        },

        /*validation(data) {
            this.errors = [];

            if(!data.name)
            {
                this.errors.push("Nazwa przedmiotu jest wymagana.")
            }

            if(!data.description)
            {
                this.errors.push("Opis przedmiotu jest wymagany.")
            }

            if(!data.weight)
            {
                this.errors.push("Waga przedmiotu jest wymagana.")
            }
            else if(this.isNumeric(data.weight)===false) {
                
                this.errors.push("Waga musi być liczbą.")
            }

            //this.wrongWeightNumer();

        },*/

        

        isNumeric(d) {
            return !isNaN(parseFloat(d)) && isFinite(d);
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
        this.retrieveCategories();
        console.log("Kategorie: "+this.categories);
    }
};
</script>

<style>
.submit-form {
    max-width: 300px;
    margin: auto;
}
</style>s