import Vue from 'vue'
import vSelect from 'vue-select'
import App from './App.vue'
import router from "./router"
import Vuelidate from "vuelidate"

Vue.config.productionTip = false

Vue.component('v-select', vSelect)

Vue.use(Vuelidate);

import "bootstrap/dist/css/bootstrap.min.css";
import 'vue-select/dist/vue-select.css';

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
