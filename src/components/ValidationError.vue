<template>
    <div v-if="show" class="text-danger">
        <div v-for="m in messages" v-bind:key="m">{{ m }}</div>
    </div>
</template>

<script>
export default {
    props: ["validation"],
    computed: {
        show() {
            return this.validation.$dirty && this.validation.$invalid
        },

        messages() {
            let messages = [];
            if (this.validation.$dirty) {
                if (this.validationError("required")) {
                    messages.push("Wprowadź wartość")
                }
                else if (this.validationError("email")) {
                    messages.push("Wprowadź poprawny email")
                }
            }
            return messages;
        }
    },

    methods: {
        validationError(type) {
            return this.validation.$params.hasOwnProperty(type) && !this.validation[type];
        }
    }
}
</script>