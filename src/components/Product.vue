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