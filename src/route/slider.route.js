////
const ct = require("../controller/slider.controller");
const { upload } = require("../util/service");

const slider = (app,base_route) => {
    app.get(base_route, ct.getAll);
    app.post(base_route, upload.single("slider_image"), ct.create);
    app.delete(`${base_route}`, ct.remove);

}
module.exports = slider;