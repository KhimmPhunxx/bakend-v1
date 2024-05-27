

////
const db = require("../util/db");
const ct = require("../controller/wishlist.conteoller")

const wishlist = (app,base_route) => {
    app.get(base_route, ct.getAll);
    app.post(base_route, ct.create);
    app.delete(`${base_route}`, ct.remove);

}
module.exports = wishlist;