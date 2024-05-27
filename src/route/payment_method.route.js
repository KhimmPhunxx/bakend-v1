

////
const ct = require("../controller/payment_menthod.controller")
const {upload} = require("../util/service");

// upload.fields([{name:"image", maxCount:2}])  upload multiple file
// upload.fields([{name:"image", maxCount:1},{name:"image_detail", maxCount:5}])

const payment_method = (app,base_route) => {
    app.get(base_route, ct.getAll);
    app.post(base_route, upload.single("image"), ct.create);
    app.delete(`${base_route}`, ct.remove);

}
module.exports = payment_method;