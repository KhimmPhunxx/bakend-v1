
const { userGuard } = require("../controller/auth.controller");
const categoryController = require("../controller/category.controller");
const { upload } = require("../util/service");

const category = (app,base_route) => {
    app.get(base_route, categoryController.getAll);
    app.get(`${base_route}/:id`,userGuard("read.category"), userGuard, categoryController.getone); // prarams
    app.post(base_route, userGuard("create.category"),upload.single("cate_image"), categoryController.create);
    app.put(base_route, userGuard("update.category"), upload.single("cate_image"), categoryController.update);
    app.delete(`${base_route}`, categoryController.remove);

}
module.exports = category;
