import http from "../http-common"

class StateDataService {
    
    
    getAll() {
        return http.get("/states");
    }
}

export default new StateDataService();