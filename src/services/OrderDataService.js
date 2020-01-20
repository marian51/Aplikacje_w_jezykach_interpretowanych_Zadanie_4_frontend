import http from "../http-common"

class OrderDataService {
    create(data) {
        return http.post("/orders", data);
    }
    
    getAll() {
        return http.get("/orders");
    }

    createEntity(data) {
        return http.post("/orderproducts", data);
    }
}

export default new OrderDataService();