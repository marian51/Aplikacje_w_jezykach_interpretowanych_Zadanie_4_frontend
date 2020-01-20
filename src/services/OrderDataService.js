import http from "../http-common"

class OrderDataService {
    create(data) {
        return http.post("/orders", data);
    }
}

export default new OrderDataService();