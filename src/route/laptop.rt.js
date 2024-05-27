const { userGuard } = require("../controller/auth.controller");
const { upload } = require("../util/service");
const ct = require("../controller/laptop.ct");

const laptop = (app,route_name) => {
    app.get(`${route_name}`, ct.getAll); 
    app.post(route_name, userGuard("create.laptop"), upload.single("lt_image"), ct.create);
    app.put(`${route_name}`, userGuard("update.laptop"), upload.single("lt_image"), ct.update);
    app.delete(`${route_name}/:id`, userGuard("delete.laptop"), ct.remove);
    
}

module.exports = laptop;