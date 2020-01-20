<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col mt-2">
                <h4 class="bg-warning text-white text-center p-2">
                    Wszystkie zamówienia
                </h4>
                <table class="table table-bordered table-striped p-2">
                    <thead>
                        <tr>
                            <th>Numer</th>
                            <th>Użytkownik</th>
                            <th>Kwota</th>
                            <th>Data</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="orders == ''">
                            <td colspan="5" class="text-center">
                                Nie złożono żadnych zamówień
                            </td>
                        </tr>
                        <tr v-for="o in orders" v-bind:key="o.id">
                            <td> {{ o.id }} </td>
                            <td> {{ o.userName }} </td>
                            <td> {{ o.totalPrice | currency }} </td>
                            <td> {{ o.createdAt }} </td>
                            <td> {{ states[o.id-1].stateName }} </td> <!-- FIXME XDDDD -->
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>        
    </div>
</template>

<script>
import OrderDataService from '../services/OrderDataService'
import StateDataService from '../services/StateDataService'

/* eslint-disable no-console */
export default {
    data() {
        return {
            orders: [],
            states: []
        }
    },

    methods: {
        retrieveOrders() {
            OrderDataService.getAll()
                .then(response => {
                    this.orders = response.data;
                })
                .catch(err => {
                    console.log(err);
                });
        },

        retrieveStates() {
            StateDataService.getAll()
                .then(response => {
                    this.states = response.data;
                    console.log(this.states);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    },

    mounted() {
        this.retrieveOrders();
        this.retrieveStates();
    },
    
    filters: {
        currency(value) {
            return new Intl.NumberFormat("pl-PL", {
                style: "currency", currency: "PLN"
            }).format(value);
        }
    },
}
</script>