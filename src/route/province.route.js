

const ct = require("../controller/province.controller")

const provine = (app,base_route) => {
    app.get(base_route, ct.getAll);
}
module.exports = provine;