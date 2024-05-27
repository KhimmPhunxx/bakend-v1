const { userGuard } = require("../controller/auth.controller");
const { upload } = require("../util/service");
const ct = require("../controller/laptop_category.ct");

const laptop_cate = (app,route_name) => {
    app.get(`${route_name}`, ct.getAll); 
    app.post(route_name, userGuard("create.laptop_category"), upload.single("image"), ct.create);
    app.put(`${route_name}`, userGuard("update.laptop_category"), upload.single("image"), ct.update);
    app.delete(`${route_name}/:laptop_cate_id`, userGuard("delete.laptop_category"), ct.remove);  
}

module.exports = laptop_cate;