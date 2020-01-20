<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col mt-2">
                <h4 class="bg-primary text-white text-center p-2">
                    Twój koszyk
                </h4>
                <table class="table table-bordered table-striped p-2">
                    <thead>
                        <tr>
                            <th>Ilość</th>
                            <th>Produkt</th>
                            <th>Cena</th>
                            <th>Cena łączna</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="cart == ''">
                            <td colspan="4" class="text-center">
                                Twój koszyk jest pusty
                            </td>
                        </tr>
                        <tr v-for="c in cart" v-bind:key="c.id">
                            <td>
                                <input type="number"
                                        class="form-control-sm"
                                        style="width:5em"
                                        v-model="c.quantity"
                                        v-on:input="changeQuantity(c)"
                                />
                            </td>
                            <td> {{ c.product.name }} </td>
                            <td class="text-right"> {{ c.product.price | currency }} </td>
                            <td class="text-right"> {{ c.product.price * c.quantity | currency }} </td>
                            <td class="text-center">
                                <button class="btn btn-sm btn-danger"
                                        v-on:click="remove(c)">
                                    Usuń
                                </button>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot v-if="cart != ''">
                        <tr>
                            <td colspan="3" class="text-right">Suma zamówienia</td>
                            <td class="text-right">
                                {{ total | currency }}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
        <div class="row">
            <div class="col text-center ">
                <div class="btn-group">
                    <a class="btn btn-warning" href="/products">Kontynuuj zakupy</a>
                    <a class="btn btn-warning" href="/order">Złóż zamówienie</a> <!-- TODO dodać komponent podziękowania za zamówienie -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/*eslint-disable no-console*/
export default {
    data() {
        return {
            cart: JSON.parse(localStorage.getItem("cart")),
            total: 0
        }
    },

    methods: {
        changeQuantity(c) {
            let tempP = c
            let tempC = this.cart
            let tempT = 0

            for (let i in tempC) { // FIXME istnieje fajna możliwość znajdowania jednego obiektu w innym, można tu tego spróbować
                if(tempC[i].product.id == tempP.product.id) {
                    console.log(tempC[i])
                    if(tempP.quantity>0) {
                        tempC[i].quantity = tempP.quantity
                    }
                    else {
                        tempC[i].quantity = 1
                    }
                    
                }
                tempT += (tempC[i].quantity * tempC[i].product.price)
            }
            this.total = tempT
            localStorage.setItem("cart", JSON.stringify(tempC));
        },

        remove(c) {
            let tempC = this.cart
            console.log(tempC)
            console.log(c)
            tempC.splice(c,1)
            localStorage.setItem("cart", JSON.stringify(tempC));
            this.calculate();           
            console.log(tempC)
        },

        calculate() {
            let t = 0
            for (let i in this.cart) {
                t += (this.cart[i].quantity * this.cart[i].product.price)
            }
            this.total = t
        },

        
    },

    

    filters: {
        currency(value) {
            return new Intl.NumberFormat("pl-PL", {
                style: "currency", currency: "PLN"
            }).format(value);
        }
    },

    mounted() {
        this.calculate();
    }
}
</script>