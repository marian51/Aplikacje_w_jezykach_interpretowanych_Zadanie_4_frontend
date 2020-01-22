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

        <div v-if="submitted==true" class="text-center">
            <h5>{{ message }}</h5> <!-- TODO wyrównać do środka -->
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
            orderId: null,
            message: ''
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

            // FIXME prostacka walidacja, ale działa
            if(this.name=='' || this.email=='' || this.phone=='' || this.name==null || this.email==null || this.phone==null ) {
                this.message = "Zamówienie nie zostało przesłane. Sprawdź formularz."
                console.log(this.message)
                this.submitted=true
                return;
            }

            
            let data = {
                userName: this.name,
                userEmail: this.email,
                userPhone: this.phone,
                totalPrice: this.totalPrice,
                acceptDate: null,
                stateId: 1
            };

            OrderDataService.create(data)
                .then(response => {
                    console.log(response.data);
                    this.orderId = response.data.id;
                    console.log(this.orderId);
                    console.log("koszyk:")
                    console.log(this.cart)

                    //tworzenie wpisów w bazie zamówienie-produkt
                    for(let p in this.cart) {
                        let pr = {
                            orderId: this.orderId,
                            productId: this.cart[p].product.id,
                            productQuantity: this.cart[p].quantity
                        }
                        console.log("tworzenie wpisu")
                        console.log(pr)

                        OrderDataService.createEntity(pr)
                            .then(response => {
                                console.log(response.data);
                            })
                            .catch(err => {
                                console.log(err);
                            })
                     }
                     
                    this.cart = []
                    localStorage.setItem("cart", JSON.stringify(this.cart));
                })
                .catch(err => {
                    console.log(err);
                });

            console.log(this.name)
            this.submitted = true;
            this.message = "Zamówienie zostało przesłane"
            
            
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