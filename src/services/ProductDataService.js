/**
 * Usługa będzie używała axios do obsługi HTTP
 */

 import http from "../http-common";

 class ProductDataService {
     getAll() {
         return http.get("/products");
     }

     get(id) {
         return http.get(`/products/${id}`);
     }

     create(data) {
         return http.post("/products", data);
     }

     update(id, data) {
         return http.put(`/products/${id}`, data);
     }

     delete(id) {
         return http.delete(`/products/${id}`);
     }

     deleteAll() {
         return http.delete(`/products`);
     }

     findByName(name) {
         return http.get(`/products?name=${name}`);
     }

     findByCategoryId(id) {
        return http.get(`/products/products/${id}`);
    }

    findProducts(id) { // FIXME powinno to być w oddzielnym serwisie
        return http.get(`/orderproducts?orderId=${id}`);
    }
 }

 export default new ProductDataService();