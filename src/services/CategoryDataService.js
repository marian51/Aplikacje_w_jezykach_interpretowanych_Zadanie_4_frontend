/**
 * Usługa do obsługi zapytań dla kategorii
 */

 import http from "../http-common";

 class CategoryDataService {
     getAll() {
         return http.get("/categories");
     }

     get(id) {
         return http.get(`/categories/${id}`);
     }
 }

 export default new CategoryDataService();