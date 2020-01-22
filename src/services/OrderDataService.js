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

    update(id, data) {
        return http.put(`/orders/${id}`, data);
    }
}

export default new OrderDataService();