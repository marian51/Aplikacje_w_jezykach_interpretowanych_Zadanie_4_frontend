<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col mt-2">
                <h4 class="bg-warning text-white text-center p-2">
                    Wszystkie zamówienia {{ thatState }}
                </h4>
                <v-select
                    label="stateName"
                    :options="states"
                    :reduce="name => name.id"
                    v-model="thatState"
                    >
                </v-select>
                <button class="btn btn-info m-1" @click="retrieveChoosenOrders">Szukaj</button>
                <table class="table table-bordered table-striped p-2">
                    <thead>
                        <tr>
                            <th>Numer</th>
                            <th>Użytkownik</th>
                            <th>Kwota</th>
                            <th>Data złożenia</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="orders == ''">
                            <td colspan="5" class="text-center">
                                Nie złożono żadnych zamówień
                            </td>
                        </tr>
                        <tr v-for="(o) in orders" v-bind:key="o.id" @click="goToOrder(o.id)">
                            <td> {{ o.id }} </td>
                            <td> {{ o.userName }} </td>
                            <td> {{ o.totalPrice | currency }} </td>
                            <td> {{ o.createdAt | moment('DD.MM.YYYY HH:mm') }} </td>
                            <td> {{ states[o.stateId-1].stateName }} {{ o.acceptDate | moment('DD.MM.YYYY HH:mm') }}</td> <!-- FIXME XDDDD -->
                        </tr>
                    </tbody>
                </table>
               <div v-if="showed">
                   <h5 class="bg-info text-white text-center p-2">
                    Szczegóły zamówienia o numerze: {{ thatOrder }}
                    </h5>
                    <!-- najpierw pogłowimy się nad zmianą statusu zamówienia -->
                    <div class="text-center">
                        <button class="badge badge-warning mr-2" @click="changeStatus(thatOrder, 1)">Niezatwierdzone</button>
                        <button class="badge badge-info mr-2" @click="changeStatus(thatOrder, 2)">Zatwierdzone</button>
                        <button class="badge badge-danger mr-2" @click="changeStatus(thatOrder, 3)">Anulowane</button>
                        <button class="badge badge-success mr-2" @click="changeStatus(thatOrder, 4)">Zrealizowane</button>
                        <p>{{ message }}</p>
                    </div>
                    <!-- lista produktów danego zamówienia -->
                    <table class="table table-bordered table-striped p-2 col-6">
                        <thead>
                            <tr>
                                <th colspan="3">Przedmioty w danym zamówieniu</th>
                            </tr>
                            <tr>
                                <th>Id.</th>
                                <th>Nazwa</th>
                                <th>Ilość</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(p, index) in products" v-bind:key="p.id">
                                <td>{{ p.id }}</td>
                                <td>{{ tempNames[index] }}</td>
                                <td>{{ p.productQuantity }}</td>
                            </tr>
                        </tbody>
                    </table>
                    
               </div> 
            </div>
        </div>        
    </div>
</template>

<script>
import OrderDataService from '../services/OrderDataService'
import StateDataService from '../services/StateDataService'
import ProductDataService from '../services/ProductDataService'

/* eslint-disable no-console */
export default {
    data() {
        return {
            orders: [],
            states: [],
            opened: [],
            products: [],
            showed: false,
            thatOrder: null,
            message: '',
            tempNames: [],
            thatState: ''
        }
    },

    methods: {
        retrieveOrders() {

            this.retrieveStates();

            OrderDataService.getAll()
                .then(response => {
                    this.orders = response.data;
                    console.log(this.orders);
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
        },
        
        goToOrder(id) {
            console.log("Kilknięcie działa" + id)
            this.thatOrder = id;
            if(!this.showed) {
                this.showed = true
                this.retrieveProducts(id)

                
                

            } else {
                this.showed = false
            }


        },

        changeStatus(id, i) {
            /**
             * id to numer id aktualnie wybranego zamówienia (id w bazie zamówień)
             * i to status, jaki chcemy zrobić
             */
            
            

            let temp = [] //obiekt wybranego zamówienia

            for (let o in this.orders) {
                if(this.orders[o].id==id) {
                    temp = this.orders[o]
                    
                    console.log(temp)
                    console.log(i)
                }
            }

            //logika statusów
            if((i==1 || i==2 || i==3) && temp.stateId == 2)
            {
                console.log("Tutaj jest if")
                this.message = "Nie można zmienić statusu z "+temp.stateId+" na "+i
                return null;
            }
            if(temp.stateId == 3) {
                this.message = "Nie można zmienić statusu anulowanego zamówienia"
                return null;
            }
            if(temp.stateId == 4) {
                this.message = "Nie można zmienić statusu zrealizowanego zamówienia"
                return null;
            }
            

            let Today = new Date();

            if(i==2) {
                temp.acceptDate = Today
            } else {
                temp.acceptDate = null
            }

            let data = {
                id: temp.id,
                stateId: i,
                userName: temp.userName,
                userEmail: temp.userEmail,
                userPhone: temp.userPhone,
                totalPrice: temp.totalPrice,
                createdAt: temp.createdAt, // TODO dodać tutaj gdzieś pole do daty zatwierdzenia
                updatedAt: Today,
                acceptDate: temp.acceptDate
            }

            console.log(data)

            OrderDataService.update(id, data)
                .then(response => {
                    //this.currentProduct.available = response.data.available;
                    console.log(response.data);
                    window.location.reload(false);
                })
                .catch(error => {
                    console.log(error || "Błąd formularza");
                    this.message = "Błąd formularza. Przedmiot nie został edytowany."
                });

            this.message = "Pomyślnie zmieniono status"
            
        },
        /**
         * id - id zamówienia, dla którego wybieramy produkty
         */
        retrieveProducts(id) {
            ProductDataService.findProducts(id)
                .then(response => {
                    this.products = response.data;
                    console.log(this.products);

                    for (let po in this.products) {
                    console.log(this.products[po])
                    let n = this.getProductName(this.products[po].productId);
                    console.log(n)
                    //this.tempNames.push(n)
                }
                    
                })
                .catch(err => {
                    console.log(err);
                })
        },

        //Kombajn do pobierania nazwy przedmiotu
        getProductName(id) {
            ProductDataService.get(id)
            .then(response => {
                    let n = response.data.name;
                    //this.tempName.push(response.data.name);
                    console.log(n);
                    this.tempNames.push(n)
                })
                .catch(err => {
                    console.log(err);
                })
        },

        retrieveChoosenOrders() {
            console.log("retrieveChoosenOrders")
            console.log(this.thatState)
            //this.retrieveStates();
            if(this.thatState==null) {
                console.log("zadziałał if")
                this.retrieveOrders();
                return;
            }

            this.orders = [];
            OrderDataService.getAll()
                .then(response => {
                    for(let o in response.data) {
                        if(response.data[o].stateId == this.thatState) {
                            this.orders.push(response.data[o])
                        }
                    }
                    //this.orders = response.data;
                    console.log(this.orders);
                })
                .catch(err => {
                    console.log(err);
                });
        },
    },

    mounted() {
        this.retrieveOrders();
        //this.retrieveStates();
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

<style>
.table {
    margin: auto;
}
</style>