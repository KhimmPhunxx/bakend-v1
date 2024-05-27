////
const ct = require("../controller/blog_home.controller");
const { upload } = require("../util/service");

const blog_home = (app,base_route) => {
    app.get(base_route,ct.getAll);
    app.post(base_route, upload.single('blog_image'),ct.create);
    app.delete(`${base_route}`,ct.remove);
    app.put(base_route, upload.single('blog_image'),ct.update);
   

}
module.exports = blog_home;