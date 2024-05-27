// 

const ct = require("../controller/cart.controller");

const cart = (app,route_name) => {
    app.get(`${route_name}`, ct.getCartByCustomer); // use `${route_name}` and not route_name work the same
    app.post(route_name, ct.addCart);
    app.delete(`${route_name}/:id`, ct.removeCart);
    app.put(`${route_name}/:id`, ct.updateCart);
}

module.exports = cart;