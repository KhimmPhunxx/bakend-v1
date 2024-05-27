const ct = require("../controller/order_detail.controller")
const order_detail = (app,base_route) => {
    app.get(base_route, ct.getAll);
}
module.exports = order_detail;