const { userGuard } = require("../controller/auth.controller");
const customerController = require("../controller/customer.controller");
const { upload } = require("../util/service");

// const route = "/api/employee";
const customer = (app,base_route) => {
    app.get(base_route, customerController.getAll);
    app.get(`${base_route}/:id`,userGuard("read.customer"), customerController.getone); // prarams
    app.post(base_route, customerController.create);
    app.post(`${base_route}_login`, customerController.login);
    app.put(base_route,userGuard("update.customer",), customerController.update);
    app.delete(`${base_route}/:id`,userGuard("delete.customer"), customerController.remove);

    app.get(`${base_route}_address`, customerController.listAddress); // api/customer/address get
    app.get(`${base_route}_address/:id`, customerController.listOneAddress); // api/customer/address/id get
    app.post(`${base_route}_address`, customerController.newAddress); // api/customer/address post
    app.put(`${base_route}_address`, customerController.updateAddress); // api/customer/address put
    app.delete(`${base_route}_address /:id`, customerController.removeAddress); // api/customer/address/id delete
}

module.exports = customer;