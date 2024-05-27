const { userGuard } = require("../controller/auth.controller");
const { upload } = require("../util/service");
const ct = require("../controller/pc_hw.ct");

const pc_hw = (app,route_name) => {
    app.get(`${route_name}`, ct.getAll); 
    
}

module.exports = pc_hw;