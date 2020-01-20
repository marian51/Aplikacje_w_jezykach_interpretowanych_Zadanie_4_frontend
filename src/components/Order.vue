<template>
    <div class="this-form">
        <h4 class="bg-primary text-white text-center p-2">
            Podaj dane do zamówienia
        </h4>
        <div class="m-2">
            <div class="form-group m-2">
                <label>Nazwisko</label>
                <input v-model="$v.name.$model" class="form-control" />
                <validation-error v-bind:validation="$v.name" />
            </div>
            <div class="form-group m-2">
                <label>Email</label>
                <input v-model="$v.email.$model" class="form-control" />
                <validation-error v-bind:validation="$v.email" />
            </div>
            <div class="form-group m-2">
                <label>Numer telefonu</label>
                <input v-model="$v.phone.$model" class="form-control" />
                <validation-error v-bind:validation="$v.phone" />
            </div>
        </div>
        
        <div>
            <h6>Wartość zamówienia: {{ totalPrice | currency }}</h6>
        </div>
        
        <div class="text-center">
            <a href="/cart" class="btn btn-secondary m-1">Wróć do koszyka</a>
            <button class="btn btn-primary m-1" v-on:click="submit">Złóż zamówienie</button>
        </div>

        <div v-if="submitted==true">
            <h5>Zamówienie zostało przesłane</h5> <!-- TODO wyrównać do środka -->
        </div>
    </div>
</template>

<script>
/*eslint-disable no-console*/

import { required, email} from "vuelidate/lib/validators"
import ValidationError from "./ValidationError"
import OrderDataService from "../services/OrderDataService";

export default {
    components: { ValidationError },

    data() {
        return {
            name: null,
            email: null,
            phone: null,
            totalPrice: 0,
            cart: JSON.parse(localStorage.getItem("cart")),
            submitted: false,
            orderId: null
        }
    },

    validations: {
        name: {
            required
        },
        email: {
            required,
            email
        },
        phone: {
            required
        }
    },

    methods: {
        submit() {
            // TODO wypadało by dodać walideację, kiedy pola są puste
            let data = {
                userName: this.name,
                userEmail: this.email,
                userPhone: this.phone,
                totalPrice: this.totalPrice,
                stateId: 1
            };

            OrderDataService.create(data)
                .then(response => {
                    console.log(response.data);
                    this.orderId = response.data.id;
                    console.log(this.orderId);

                    //tworzenie wpisów w bazie zamówienie-produkt
                    for(let p in this.cart) {
                        let pr = {
                            orderId: this.orderId,
                            productId: this.cart[p].product.id,
                            productQuantity: this.cart[p].quantity
                        }
                        console.log(pr)

                        OrderDataService.createEntity(pr)
                            .then(response => {
                                console.log(response.data);
                            })
                            .catch(err => {
                                console.log(err);
                            })
                     }    
                })
                .catch(err => {
                    console.log(err);
                });

            this.submitted = true;
            // TODO dodać czyszczenie koszyka po złożeniu zamówienia
            
        },     

        calculate() {
            let t = 0
            for (let i in this.cart) {
                t += (this.cart[i].quantity * this.cart[i].product.price)
            }
            this.totalPrice = t
        },
    },

    mounted() {
        this.calculate();
    },

    filters: {
        currency(value) {
            return new Intl.NumberFormat("pl-PL", {
                style: "currency", currency: "PLN"
            }).format(value);
        }
    }

}
</script>

<style>
.this-form {
    max-width: 500px;
    margin: auto;
}
</style>