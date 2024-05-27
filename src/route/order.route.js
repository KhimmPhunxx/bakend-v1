// 

const { userGuard } = require("../controller/auth.controller");
const ct = require("../controller/order.controller");

const order = (app,route_name) => {
    app.get(`${route_name}`, ct.getAll); // use `${route_name}` and not route_name work the same
    app.get(`${route_name}/:id`,userGuard(), ct.getone);
    app.post(`${route_name}`, ct.create);
    app.put(`${route_name}/:id`,userGuard, ct.update);
    app.delete(`${route_name}/:id`,userGuard, ct.remove);
}

module.exports = order;