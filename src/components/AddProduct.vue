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
            <button class="btn btn-success" @click="newProduct">Dodaj</button>
        </div>
    </div>
</template>